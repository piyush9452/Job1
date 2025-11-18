// controllers/employerController.js
import expressAsyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import Employer from '../models/employer.js'; // Adjust path as needed
import {protectEmployer} from '../middleware/employercheck.js';
import OTP from '../models/verification.js';
import sendEmail from '../utils/emailVerification.js';
import {S3Client, PutObjectCommand, GetObjectCommand} from '@aws-sdk/client-s3';
import crypto from 'crypto';
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';
import mime from 'mime-types';

let s3Client;

const getS3Client = () => {
  if (!s3Client) {
    // This code will now run *after* dotenv.config()
    s3Client = new S3Client({
      region: process.env.AWS_BUCKET_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }
  return s3Client;
};


export const registerEmployer = expressAsyncHandler(async (req, res) => {
  // 1. Validation (Same as before)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const { name, email, password, phone, companyName } = req.body;

  // 2. Check existence (Same as before)
  const existingEmployer = await Employer.findOne({ email });
  if (existingEmployer) {
    res.status(400);
    throw new Error('Employer with this email already exists');
  }

  // 3. Hash password (Same as before)
  const hashedPassword = await bcrypt.hash(password, 10);

  // 4. Create Employer
  const employer = new Employer({
    name,
    email,
    password: hashedPassword,
    phone,
    companyName: companyName || "",
  });
  
  const savedEmployer = await employer.save();

  // 5. Generate 6-digit OTP
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    // 6. Save to OTP collection
    await OTP.create({
      employerId: savedEmployer._id,
      otp: otpCode,
    });

    // 7. Send Email
    await sendEmail({
      email: savedEmployer.email,
      subject: 'Verify your Employer Account',
      message: `Your verification code is: ${otpCode}. It expires in 10 minutes.`,
    });

    // 8. Response (NO TOKEN)
    res.status(201).json({
      message: 'Registration successful. Please check your email to verify your account.',
      email: savedEmployer.email,
      employerId: savedEmployer._id // <-- ADDED THIS LINE
    });

  } catch (error) {
    // CRITICAL: If email/OTP fails, delete the user.
    await Employer.deleteOne({ _id: savedEmployer._id });
    await OTP.deleteOne({ employerId: savedEmployer._id });
    
    console.error("Registration failed during OTP step:", error);
    res.status(500);
    throw new Error('Could not send verification email. Please try registering again.');
  }
});

//-----------------------------------------------------------------------------------------------------------------


export const verifyOTP = expressAsyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  // 1. Find the employer first to get their ID
  const employer = await Employer.findOne({ email });
  if (!employer) {
      res.status(400);
      throw new Error("Employer not found");
  }

  // 2. Look for their OTP in the separate collection
  const otpRecord = await OTP.findOne({
      employerId: employer._id,
      otp: otp,
  });

  if (!otpRecord) {
      res.status(400);
      // If it's not found, it either didn't exist OR it already auto-expired.
      throw new Error("Invalid or expired OTP.");
  }

  // 3. OTP found! Mark employer as verified.
  employer.isVerified = true;
  await employer.save();

  // 4. (Optional but good) Manually delete the OTP now so it can't be used again
  // even before the 10 minutes are up.
  await OTP.deleteOne({ _id: otpRecord._id });

  // 5. Generate token and log them in
  const token = jwt.sign({ employer: { id: employer._id } }, process.env.JWT_SECRET, { expiresIn: '5h' });
  res.status(200).json({ message: "Verified!", token });
});




export const loginEmployer = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const employer = await Employer.findOne({ email });

  
  const isMatch = employer 
    ? await bcrypt.compare(password, employer.password) 
    : false;

  // 2. Use ONE generic error message
  if (!employer || !isMatch) {
    res.status(401); // Use 401 Unauthorized
    throw new Error("Invalid credentials");
  }

  // 3. Create and return JWT
  const payload = {
    employer: {
      id: employer.id,
    },
  };

  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: "5h" }
  );

  res.status(200).json({ token });
});


export const updateEmployerProfile = expressAsyncHandler(async (req, res) => {
  // 1. Find employer, but select all fields EXCEPT password
  const employer = await Employer.findById(req.employerId).select('-password');

  if (employer) {
    // 2. Check each field for updates (the correct way)
    if (req.body.name !== undefined) {
      employer.name = req.body.name;
    }
    if (req.body.phone !== undefined) {
      employer.phone = req.body.phone;
    }
    if (req.body.companyName !== undefined) { 
      employer.companyName = req.body.companyName;
    }
    if (req.body.companyWebsite !== undefined) { 
      employer.companyWebsite = req.body.companyWebsite;
    }
    if (req.body.location !== undefined) { 
      employer.location = req.body.location;
    }
    if (req.body.industry !== undefined) { 
      employer.industry = req.body.industry;
    }
    if (req.body.description !== undefined) { 
      employer.description = req.body.description;
    }
    if (req.body.profilePicture !== undefined) {
      employer.profilePicture = req.body.profilePicture;
    }
    
    // 3. Save the updated employer
    const updatedEmployer = await employer.save();

    // 4. Return the full, updated employer object
    res.status(200).json(updatedEmployer);
  } else {
    res.status(404);
    throw new Error('Employer not found');
  }
});

export const getPublicEmployerProfile = expressAsyncHandler(async (req, res) => {
 
  const { id } = req.params;

  const employer = await Employer.findById(id).select('-password');
  
  if (employer) {
    res.status(200).json(employer);
  } else {
    res.status(404);
    throw new Error('Employer not found');
  }

});




export const getPresignedUploadUrl = expressAsyncHandler(async (req, res) => {
  const client = getS3Client();
  const employerId = req.employerId;
  
  // 1. Get fileType from the request body (e.g., "application/pdf")
  const { fileType } = req.body; 
  
  if (!fileType) {
    res.status(400);
    throw new Error("File type is required");
  }

  // 2. Determine the correct extension (e.g., ".pdf")
  // If you don't want to install mime-types, you can just split the string 'image/png'
  const extension = fileType.split('/')[1]; 
  
  const randomBytes = crypto.randomBytes(16).toString('hex');
  
  // 3. Add extension to the filename so browsers recognize it
  const fileName = `doc-${employerId}-${randomBytes}.${extension}`;
  const key = `verification_documents/${fileName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    ContentType: fileType, // 4. Tell S3 exactly what this file is
  });

  const url = await getSignedUrl(client, command, { expiresIn: 600 });
  
  res.status(200).json({ uploadUrl: url, key: key });
});





export const saveDocumentKey = expressAsyncHandler(async (req, res) => {
  const { key } = req.body;
  const employerIdFromToken = req.employerId;

  if (!key) {
    res.status(400);
    throw new Error("Document key is required");
  }
  
  const employer = await Employer.findById(employerIdFromToken);
  if (!employer) {
    res.status(400);
    throw new Error("Employer not found");
  }

  // --- THIS IS THE FIX ---
  // Save only the key, not the full URL.
  employer.verificationDocument = key; 
  await employer.save();

  res.status(200).json({ 
    message: "Verification document saved successfully.", 
    documentKey: key // Send back the key
  });
});





export const getViewableDocumentUrl = expressAsyncHandler(async (req, res) => {
  const client = getS3Client(); // Use your lazy-loaded client
  const employer = await Employer.findById(req.employerId);

  if (!employer) {
    res.status(404);
    throw new Error("Employer not found");
  }

  if (!employer.verificationDocument) {
    res.status(404);
    throw new Error("No document has been uploaded");
  }

  // Get the key from the database
  const key = employer.verificationDocument; 

  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  });

  // Create a temporary (5 minute) URL to view the file
  const url = await getSignedUrl(client, command, { expiresIn: 300 });

  res.status(200).json({ viewableUrl: url });
});





export const getDownloadableDocumentUrl = expressAsyncHandler(async (req, res) => {
  const client = getS3Client(); // Use your lazy-loaded client
  const employer = await Employer.findById(req.employerId);

  if (!employer) {
    res.status(404);
    throw new Error("Employer not found");
  }

  if (!employer.verificationDocument) {
    res.status(404);
    throw new Error("No document has been uploaded");
  }

  // Get the key from the database
  const key = employer.verificationDocument; 

  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,

    // --- THIS IS THE MAGIC LINE ---
    // It forces the browser to download the file instead of displaying it.
    ResponseContentDisposition: 'attachment',
  });

  // Create a temporary (5 minute) URL to download the file
  const url = await getSignedUrl(client, command, { expiresIn: 300 });

  res.status(200).json({ downloadableUrl: url });
});









// const handleDownloadDocument = async () => {
//   try {
//     const token = JSON.parse(localStorage.getItem('employerInfo')).token;
    
//     // 1. Ask your server for the temporary download link
//     const res = await axios.get(
//       'http://localhost:5000/employer/download-document', // Calls the new route
//       {
//         headers: { Authorization: `Bearer ${token}` }
//       }
//     );

//     // 2. Get the temporary URL from the response
//     const { downloadableUrl } = res.data;

//     // 3. Open the link. The browser will automatically open a "Save As" dialog.
//     window.open(downloadableUrl);

//   } catch (error) {
//     alert("Could not get document: " + error.response?.data?.message);
//   }
// };


