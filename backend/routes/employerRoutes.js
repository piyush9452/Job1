import express from "express";
import { registerEmployer } from "../controllers/employerControllers.js";
import { body } from 'express-validator';

const router = express.Router();

const rules = [
  body('name', 'Name is required').not().isEmpty().trim(),
  body('email', 'A valid email is required').isEmail().normalizeEmail(),
  body('password', 'Password must be 6+ characters').isLength({ min: 6 })
];
router.post("/register",rules, registerEmployer);





export default router;