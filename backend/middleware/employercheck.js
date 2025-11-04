import jwt from 'jsonwebtoken';
import expressAsyncHandler from 'express-async-handler';
import Employer from '../models/employer.js'; // Adjust path

export const protectEmployer = expressAsyncHandler(async (req, res, next) => {
  let token;

  // Check for the "Bearer" token in the authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 1. Get token from header (e.g., "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // 2. Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Get employer ID from the token payload
      // (This matches the payload we created in login/register)
      req.employerId = decoded.employer.id;

      // 4. Continue to the next function (the update controller)
      next(); 
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});