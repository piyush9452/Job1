import User from "../models/users.js";
import jwt from "jsonwebtoken";
import expressAsyncHandler from "express-async-handler";
// import errorHandler from "../middleware/errorhandler.js";
import bcrypt from "bcrypt";
import admin from 'firebase-admin';

// Initialize Firebase Admin SDK (do this once when your server starts)
// admin.initializeApp({
//   credential: admin.credential.cert(require('./path/to/your/serviceAccountKey.json'))
// });

// Create a new user
import UserOTP from '../models/userVerification.js'; // <-- Import the new model
import sendEmail from '../utils/emailVerification.js';
import { validationResult } from 'express-validator';

export const createUser = expressAsyncHandler(async (req, res) => {
  // 1. Validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const { name, email, password, phone } = req.body;

  // 2. Check existence
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error("User already exists");
  }

  // 3. Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 4. Create User (isVerified: false by default)
  const user = new User({
    name,
    email,
    password: hashedPassword,
    phone,
  });
  const savedUser = await user.save();

  // 5. Generate OTP
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    // 6. Save to the separate UserOTP collection
    await UserOTP.create({
      userId: savedUser._id,
      otp: otpCode,
    });

    // 7. Send Email
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
    // Cleanup if email fails
    await User.deleteOne({ _id: savedUser._id });
    await UserOTP.deleteOne({ userId: savedUser._id });
    res.status(500);
    throw new Error('Verification email failed. Please try again.');
  }
});



export const verifyUserOTP = expressAsyncHandler(async (req, res) => {
  // ... (existing validation logic) ...

  // Mark Verified
  user.isVerified = true;
  await user.save();

  // Clean up OTP
  await UserOTP.deleteOne({ _id: otpRecord._id });

  // Generate Token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '5h' });
  
  // --- FIX: Return userId along with token ---
  res.status(200).json({ 
      message: "Account verified!", 
      token,
      userId: user._id // <--- ADDED THIS
  });
});






export const loginUser = expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // --- FIX: Block unverified users ---
    if (!user.isVerified) {
        return res.status(401).json({ message: "Account not verified. Please verify email." });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "120h" }
    );

    // Response structure looks good
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
});



export const updateUser = expressAsyncHandler(async (req, res) => {

    const userId = req.params.id; // get user id from URL
    const updates = req.body;     // only the fields provided

    const notAllowed = ["email", "password", "phone"]; 
    notAllowed.forEach(field => delete updates[field]);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },   // update only provided fields
      { new: true, runValidators: true } // return updated doc
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);

    console.error("Update error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  
});





export const userDetails = expressAsyncHandler(async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);

    res.status(500).json({ error: err.message });
  
})




