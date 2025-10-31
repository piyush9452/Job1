// controllers/employerController.js
import expressAsyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import Employer from '../models/employer.js'; // Adjust path as needed

export const registerEmployer = expressAsyncHandler(async (req, res) => {
  // 1. Check for validation errors from the middleware
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400); // Set status
    throw new Error(errors.array()[0].msg); // Let error handler format it
  }

  // 2. Destructure the full body
  const { name, email, password, phone , companyName} = req.body;

  // 3. Hash password (following your style)
  const hashedPassword = await bcrypt.hash(password, 10);

  // 4. Check if employer exists (following your style)
  const existingEmployer = await Employer.findOne({ email });
  if (existingEmployer) {
    res.status(400);
    throw new Error('Employer with this email already exists');
  }

  // 5. Create and save new employer
  const employer = new Employer({
    name,
    email,
    password: hashedPassword, // Use the hashed password
    phone,
    companyName: companyName || "",
  });
  const savedEmployer = await employer.save();

  // 6. Create and return JWT (This is the correct response)
  const payload = {
    employer: {
      id: savedEmployer.id, // Use the new employer's ID
    },
  };

  // Sign the token
  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET, // Ensure JWT_SECRET is in your .env file
    { expiresIn: '5h' } // Set an expiration
  );

  // 7. Send the token as the response
  res.status(201).json({ token });
});