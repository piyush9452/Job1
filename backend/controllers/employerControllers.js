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
  const employer = await Employer.findById(req.employerId).select('-password');

  if (!employer) {
    res.status(404);
    throw new Error('Employer not found');
  }

  // FACT: Strict 200-word description enforcement
  if (req.body.description !== undefined) {
    // Count words by splitting on spaces and filtering out empty strings
    const wordCount = req.body.description.trim().split(/\s+/).filter(word => word.length > 0).length;
    
    if (wordCount < 200) {
      res.status(400);
      throw new Error(`Profile description must be at least 200 words. You currently have ${wordCount} words.`);
    }
    employer.description = req.body.description;
  }

  // Handle Employer Type switching
  if (req.body.employerType !== undefined) {
    employer.employerType = req.body.employerType;
  }

  // Standard Fields
  if (req.body.name !== undefined) employer.name = req.body.name;
  if (req.body.phone !== undefined) employer.phone = req.body.phone;
  if (req.body.location !== undefined) employer.location = req.body.location; 
  if (req.body.officeLocation !== undefined) employer.officeLocation = req.body.officeLocation;
  if (req.body.industry !== undefined) employer.industry = req.body.industry;
  if (req.body.profilePicture !== undefined) employer.profilePicture = req.body.profilePicture;
  
  // Conditional Company Fields
  if (employer.employerType === "company") {
    if (req.body.companyName !== undefined) employer.companyName = req.body.companyName;
    if (req.body.companyWebsite !== undefined) employer.companyWebsite = req.body.companyWebsite;
    if (req.body.natureOfBusiness !== undefined) employer.natureOfBusiness = req.body.natureOfBusiness;
  } else {
    // FACT: If they are an individual, wipe the company-specific data to keep the database clean
    employer.companyName = "";
    employer.companyWebsite = "";
    employer.natureOfBusiness = "";
  }

  // Document Fields (These expect AWS S3 Keys passed from your frontend)
  if (req.body.aadharCard !== undefined) employer.aadharCard = req.body.aadharCard;
  if (req.body.panCard !== undefined) employer.panCard = req.body.panCard;
  if (req.body.gstForm !== undefined) employer.gstForm = req.body.gstForm;
  if (req.body.otherBusinessCertificate !== undefined) employer.otherBusinessCertificate = req.body.otherBusinessCertificate;
  if (req.body.tradeLicense !== undefined) employer.tradeLicense = req.body.tradeLicense;
  if (req.body.educationDocuments !== undefined) employer.educationDocuments = req.body.educationDocuments;

  const updatedEmployer = await employer.save();
  res.status(200).json(updatedEmployer);
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
  const client = getS3Client(); 
  const employer = await Employer.findById(req.employerId);
  
  // FACT: We now grab the specific field name from the query (e.g., ?field=aadharCard)
  const { field } = req.query; 

  if (!employer) {
    res.status(404); throw new Error("Employer not found");
  }
  if (!field || !employer[field]) {
    res.status(404); throw new Error(`No document uploaded for ${field}`);
  }

  const key = employer[field]; 
  const command = new GetObjectCommand({ Bucket: process.env.AWS_BUCKET_NAME, Key: key });
  const url = await getSignedUrl(client, command, { expiresIn: 300 });

  res.status(200).json({ viewableUrl: url });
});

export const getDownloadableDocumentUrl = expressAsyncHandler(async (req, res) => {
  const client = getS3Client(); 
  const employer = await Employer.findById(req.employerId);
  const { field } = req.query;

  if (!employer) {
    res.status(404); throw new Error("Employer not found");
  }
  if (!field || !employer[field]) {
    res.status(404); throw new Error(`No document uploaded for ${field}`);
  }

  const key = employer[field]; 
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    ResponseContentDisposition: 'attachment',
  });

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



// Ensure other imports (Employer, jwt, expressAsyncHandler, etc.) are present

export const googleLoginEmployer = expressAsyncHandler(async (req, res) => {
  try {
    const { token: googleToken } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { email, name, picture, sub: googleId } = ticket.getPayload();

    let employer = await Employer.findOne({ email });

    if (employer) {
      // --- EXISTING EMPLOYER ---
      const token = jwt.sign({ employer: { id: employer._id } }, process.env.JWT_SECRET, { expiresIn: '5h' });

      if (!employer.profilePicture) {
          employer.profilePicture = picture;
          await employer.save();
      }

      // FACT: We must ensure the phone number is REAL and not the injected dummy one
      const hasRealPhone = employer.phone && !employer.phone.startsWith("EMP-");
      const isProfileComplete = hasRealPhone && employer.companyName && employer.companyName.trim() !== "";

      res.status(200).json({
        message: "Google Login Successful",
        token,
        employerId: employer._id,
        email: employer.email,
        isProfileComplete: !!isProfileComplete
      });

    } else {
      // --- NEW EMPLOYER ---
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      // FACT: Inject unique dummy phone to prevent MongoDB E11000 duplicate key crash
      const dummyPhone = `EMP-${Date.now().toString().slice(-6)}`;

      const newEmployer = new Employer({
        name,
        email,
        password: hashedPassword,
        profilePicture: picture,
        isVerified: true, 
        authProvider: 'google',
        googleId: googleId,
        phone: dummyPhone, // <-- Crash bypassed here
        companyName: ""   
      });

      const savedEmployer = await newEmployer.save();
      const token = jwt.sign({ employer: { id: savedEmployer._id } }, process.env.JWT_SECRET, { expiresIn: '5h' });

      res.status(201).json({
        message: "Google Registration Successful",
        token,
        employerId: savedEmployer._id,
        email: savedEmployer.email,
        isProfileComplete: false // Forces redirect to Edit Profile
      });
    }
  } catch (error) {
    console.error("FATAL GOOGLE LOGIN ERROR (EMPLOYER):", error);
    res.status(500);
    throw new Error(`Google Login Failed: ${error.message}`);
  }
});