import User from "../models/users.js";
import jwt from "jsonwebtoken";
import expressAsyncHandler from "express-async-handler";
import { OAuth2Client } from 'google-auth-library';
import bcrypt from "bcrypt";
import UserOTP from '../models/userVerification.js';
import sendEmail from '../utils/emailVerification.js';
import { validationResult } from 'express-validator';

import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';

let s3Client;
const getS3Client = () => {
  if (!s3Client) {
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

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const createUser = expressAsyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const { name, email, password, phone } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    name,
    email,
    password: hashedPassword,
    phone,
  });
  const savedUser = await user.save();

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await UserOTP.create({
      userId: savedUser._id,
      otp: otpCode,
    });

    await sendEmail({
      email: savedUser.email,
      subject: 'Verify your Job Portal Account',
      message: `Your verification code is: ${otpCode}. It expires in 10 minutes.`,
    });

    res.status(201).json({
      message: 'Registration successful. Please check your email to verify your account.',
      email: savedUser.email
    });

  } catch (error) {
    await User.deleteOne({ _id: savedUser._id });
    await UserOTP.deleteOne({ userId: savedUser._id });
    res.status(500);
    throw new Error('Verification email failed. Please try again.');
  }
});


export const verifyUserOTP = expressAsyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const otpRecord = await UserOTP.findOne({
    userId: user._id,
    otp: otp,
  });

  if (!otpRecord) {
    res.status(400);
    throw new Error("Invalid or expired OTP.");
  }

  user.isVerified = true;
  await user.save();

  await UserOTP.deleteOne({ _id: otpRecord._id });

  const token = jwt.sign(
    { id: user._id }, 
    process.env.JWT_SECRET, 
    { expiresIn: '5h' }
  );
  
  res.status(200).json({ 
      message: "Account verified!", 
      token,
      userId: user._id 
  });
});


export const loginUser = expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isVerified) {
        return res.status(401).json({ message: "Account not verified. Please verify email." });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "120h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      userId: user._id
    });
});


export const updateUser = expressAsyncHandler(async (req, res) => {
    const userId = req.params.id; 
    const updates = req.body;     

    const notAllowed = ["email", "password"]; 
    notAllowed.forEach(field => delete updates[field]);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },  
      { new: true, runValidators: true } 
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(updatedUser);
});


export const userDetails = expressAsyncHandler(async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
});


export const googleLogin = expressAsyncHandler(async (req, res) => {
  try {
    const { token: googleToken } = req.body;

    // 1. Verify Google Token
    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const { email, name, picture } = ticket.getPayload();

    // 2. Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      // --- SCENARIO 1: EXISTING USER (LOGIN) ---
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '5h' });
      
      if (!user.profilePicture) {
          user.profilePicture = picture;
          await user.save();
      }

      // Check if they have a REAL phone number (not our dummy one) and skills
      const hasRealPhone = user.phone && !user.phone.startsWith("G-");
      const isProfileComplete = hasRealPhone && user.skills && user.skills.length > 0;

      return res.status(200).json({
        message: "Google Login Successful",
        token,
        userId: user._id,
        user: { id: user._id, name: user.name, email: user.email },
        isProfileComplete: !!isProfileComplete 
      });

    } else {
      // --- SCENARIO 2: NEW USER (REGISTER) ---
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      // FACT: We inject a completely unique dummy phone number to prevent MongoDB E11000 duplicate key crashes
      const dummyPhone = `G-${Date.now().toString().slice(-8)}`;

      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        profilePicture: picture,
        isVerified: true, 
        phone: dummyPhone // Bypass crash here
      });

      const savedUser = await newUser.save();
      
      const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, { expiresIn: '5h' });

      // Send false so frontend redirects to Edit Profile
      return res.status(201).json({
        message: "Google Registration Successful",
        token,
        userId: savedUser._id,
        user: { id: savedUser._id, name, email },
        isProfileComplete: false 
      });
    }
  } catch (error) {
    // FACT: If it crashes again, it will print the real reason in your backend terminal/logs
    console.error("FATAL GOOGLE LOGIN ERROR:", error);
    res.status(500);
    throw new Error(`Google Login Failed: ${error.message}`);
  }
});

export const getResumeUploadUrl = expressAsyncHandler(async (req, res) => {
  const client = getS3Client();
  const userId = req.params.id;
  const { fileType } = req.body; 
  
  if (!fileType) {
    res.status(400); throw new Error("File type is required");
  }

  // Handle docx, doc, pdf extensions
  let extension = "pdf";
  if (fileType.includes("wordprocessingml")) extension = "docx";
  else if (fileType.includes("msword")) extension = "doc";
  
  const randomBytes = crypto.randomBytes(8).toString('hex');
  const key = `resumes/applicant-${userId}-${randomBytes}.${extension}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    ContentType: fileType,
  });

  const url = await getSignedUrl(client, command, { expiresIn: 600 });
  res.status(200).json({ uploadUrl: url, key: key });
});

export const saveResumeKey = expressAsyncHandler(async (req, res) => {
  const userId = req.params.id;
  const { key } = req.body;

  if (!key) {
    res.status(400); throw new Error("Document key is required");
  }
  
  const user = await User.findByIdAndUpdate(userId, { resumeFileKey: key }, { new: true });
  if (!user) {
    res.status(404); throw new Error("User not found");
  }

  res.status(200).json({ message: "Resume saved successfully.", resumeFileKey: key });
});

export const getViewableResumeUrl = expressAsyncHandler(async (req, res) => {
  const client = getS3Client(); 
  const user = await User.findById(req.params.id);
  
  if (!user || !user.resumeFileKey) {
    res.status(404); throw new Error("No resume file uploaded for this user");
  }

  const command = new GetObjectCommand({ Bucket: process.env.AWS_BUCKET_NAME, Key: user.resumeFileKey });
  const url = await getSignedUrl(client, command, { expiresIn: 3600 }); // 1 hour access for recruiters

  res.status(200).json({ viewableUrl: url });
});

export const getDownloadableResumeUrl = expressAsyncHandler(async (req, res) => {
  const client = getS3Client(); 
  const user = await User.findById(req.params.id);

  if (!user || !user.resumeFileKey) {
    res.status(404); throw new Error("No resume file uploaded for this user");
  }

  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: user.resumeFileKey,
    ResponseContentDisposition: `attachment; filename="${user.name.replace(/\s+/g, '_')}_Resume"`,
  });

  const url = await getSignedUrl(client, command, { expiresIn: 300 });
  res.status(200).json({ downloadableUrl: url });
});