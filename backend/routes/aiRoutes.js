import express from "express";
import { protectEmployer } from "../middleware/employercheck.js";
import { generateJobDetails } from "../controllers/aiControllers.js";

const router = express.Router();

// Employer must be logged in to use AI (prevents public API abuse)
router.post("/generate-job-details", protectEmployer, generateJobDetails);

export default router;