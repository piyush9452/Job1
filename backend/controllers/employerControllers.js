// controllers/employerController.js
import expressAsyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import Employer from '../models/employer.js'; // Adjust path as needed
import {protectEmployer} from '../middleware/employercheck.js';
import OTP from '../models/verification.js';
import sendEmail from '../utils/emailVerification.js';


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
  // 1. Find the employer using the ID from the 'protectEmployer' middleware
  const employer = await Employer.findById(req.employerId);

  if (employer) {
    // 2. Update only the fields that are provided in the body
    // If req.body.name exists, use it. Otherwise, keep the old employer.name
    employer.name = req.body.name || employer.name;
    employer.phone = req.body.phone || employer.phone;
    employer.companyWebsite = req.body.companyWebsite || employer.companyWebsite;
    employer.location = req.body.location || employer.location;
    employer.industry = req.body.industry || employer.industry;
    employer.description = req.body.description || employer.description;
    employer.profilePicture = req.body.profilePicture || employer.profilePicture;
    
    // Note: We do NOT update email or password here.
    // Those should be separate, dedicated endpoints.

    // 3. Save the updated employer
    const updatedEmployer = await employer.save();

    // 4. Return the updated data (excluding the password)
    res.status(200).json({
      _id: updatedEmployer._id,
      name: updatedEmployer.name,
      email: updatedEmployer.email,
      phone: updatedEmployer.phone,
      companyWebsite: updatedEmployer.companyWebsite,
      location: updatedEmployer.location,
      industry: updatedEmployer.industry,
      description: updatedEmployer.description,
      profilePicture: updatedEmployer.profilePicture,
    });
  } else {
    res.status(404);
    throw new Error('Employer not found');
  }
});