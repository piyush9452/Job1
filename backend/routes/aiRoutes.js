import express from "express";
import multer from "multer";
import { protectEmployer } from "../middleware/employercheck.js";
import protect from "../middleware/authorization.js";
import { generateJobDetails , parseResume} from "../controllers/aiControllers.js";

const router = express.Router();

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } 
});

// Employer must be logged in to use AI (prevents public API abuse)
router.post("/generate-job-details", protectEmployer, generateJobDetails);

router.post("/parse-resume", protect, upload.single("resume"), parseResume);

export default router;