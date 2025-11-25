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
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
      employerId: savedEmployer._id,
      savedEmployer // <-- ADDED THIS LINE
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
    res.status(404);
    throw new Error("Employer not found");
  }

  // 2. Look for their OTP in the separate collection
  // We match BOTH employerId and the specific OTP code
  const otpRecord = await OTP.findOne({
    employerId: employer._id,
    otp: otp,
  });

  if (!otpRecord) {
    res.status(400);
    throw new Error("Invalid or expired OTP.");
  }

  // 3. Mark Verified
  employer.isVerified = true;
  await employer.save();

  // 4. Clean up OTP (Prevent reuse)
  await OTP.deleteOne({ _id: otpRecord._id });

  // 5. Generate Token & Login immediately
  const token = jwt.sign(
    { employer: { id: employer._id } }, 
    process.env.JWT_SECRET, 
    { expiresIn: '5h' }
  );
  
  // 6. Send Response
  // CRITICAL: Sending 'employerId' allows frontend to save { token, id } structure
  res.status(200).json({ 
      message: "Account verified successfully!", 
      token,
      employerId: employer._id,
      email: employer.email 
  });
});


export const loginEmployer = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const employer = await Employer.findOne({ email });

  const isMatch = employer 
    ? await bcrypt.compare(password, employer.password) 
    : false;

  if (!employer || !isMatch) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  // --- FIX 1: BLOCK UNVERIFIED USERS ---
  if (!employer.isVerified) {
    res.status(401);
    // Optional: You could trigger a resend OTP logic here if you wanted
    throw new Error("Account not verified. Please verify your email first.");
  }

  // 3. Create JWT
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

  // --- FIX 2: SEND THE ID FOR FRONTEND ---
  res.status(200).json({ 
    token,
    employerId: employer._id, // Frontend needs this for 'employerInfo'
    email: employer.email     // Optional but good to have
  });
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





export const continueWithGoogle = expressAsyncHandler(async (req, res) => {
  const { credential } = req.body; // Google ID Token

  // 1. Verify Token with Google
  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const { email, name, picture, sub: googleId } = ticket.getPayload();

  // 2. Check if email exists in DB
  const employer = await Employer.findOne({ email });

  if (employer) {
    // --- SCENARIO A: USER EXISTS ---

    // CASE 1: They registered via Password (local) originally
    if (employer.authProvider === 'local') {
      res.status(409); // Conflict
      throw new Error("Account exists with this email. Please login with your password.");
    }

    // CASE 2: They registered via Google before -> LOGIN THEM IN
    const token = jwt.sign({ employer: { id: employer._id } }, process.env.JWT_SECRET, { expiresIn: '5h' });
    
    // Optional: Update picture/name if changed on Google
    return res.status(200).json({ 
      status: 'LOGIN_SUCCESS',
      token,
      employerId: employer._id,
      message: 'Logged in successfully' 
    });
  } else {
    // --- SCENARIO B: NEW USER ---
    // We CANNOT create the account yet because we need Phone & Company.
    // We send the Google data back to frontend to pre-fill the form.
    
    return res.status(202).json({ 
      status: 'NEED_PROFILE_COMPLETION',
      googleData: {
        email,
        name,
        picture,
        googleId // Send this back so we can verify it again in step 2
      },
      message: 'Please complete your profile' 
    });
  }
});


export const completeGoogleSignup = expressAsyncHandler(async (req, res) => {
  // Frontend sends: credential (again for security), phone, companyName
  const { credential, phone, companyName } = req.body;

  // 1. RE-Verify Token (Security: prevents spoofing the email)
  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const { email, name, picture, sub: googleId } = ticket.getPayload();

  // 2. Double check duplicate (just in case)
  const userExists = await Employer.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists.");
  }
  
  const phoneExists = await Employer.findOne({ phone });
  if (phoneExists) {
    res.status(400);
    throw new Error("Phone number already in use.");
  }

  // 3. Create dummy password (since they use Google)
  const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
  const hashedPassword = await bcrypt.hash(randomPassword, 10);

  // 4. Create Employer
  const employer = new Employer({
    name,
    email,
    password: hashedPassword, // Dummy hashed password
    phone,
    companyName,
    profilePicture: picture,
    googleId,
    authProvider: 'google',
    isVerified: true // Google emails are verified by definition
  });

  const savedEmployer = await employer.save();

  // 5. Generate Token
  const token = jwt.sign({ employer: { id: savedEmployer._id } }, process.env.JWT_SECRET, { expiresIn: '5h' });

  res.status(201).json({ 
    status: 'REGISTER_SUCCESS',
    token,
    employerId: savedEmployer._id,
    message: 'Account created successfully' 
  });
});