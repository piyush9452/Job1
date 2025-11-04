import jwt from 'jsonwebtoken';
import expressAsyncHandler from 'express-async-handler';
import Employer from '../models/employer.js';

export const protectEmployer = expressAsyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // FIX 1: Token is now assigned
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.employerId = decoded.employer.id;
      next(); // Continue only if token is valid

    } catch (error) {
      // Token is invalid or expired
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // FIX 2: This check now catches requests with NO token
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
});