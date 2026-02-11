import express from "express";
import protect from "../middleware/authorization.js";
import { protectEmployer } from "../middleware/employercheck.js"; // Import this!

import { 
  allApplicationFromUser, 
  createApplication, 
  getJobApplications,   // Import this
  updateApplicationStatus // Import this
} from "../controllers/applicationControllers.js";

const router = express.Router();

// --- USER ROUTES ---
router.post("/", protect, createApplication);
router.get("/:id", protect, allApplicationFromUser); 

// --- EMPLOYER ROUTES (These were missing) ---

// 1. Get all candidates for a specific job
router.get("/job/:jobId", protectEmployer, getJobApplications);

// 2. Update status (Hire/Reject)
router.patch("/:id/status", protectEmployer, updateApplicationStatus);

export default router;