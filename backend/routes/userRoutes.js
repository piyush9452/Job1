import express from "express";
import { 
  createUser, loginUser, updateUser, userDetails, verifyUserOTP, googleLogin,
  getResumeUploadUrl, saveResumeKey, getViewableResumeUrl, getDownloadableResumeUrl
} from "../controllers/userControllers.js";

const router = express.Router();

// Auth & Profile
router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/verifyotp", verifyUserOTP);
router.post("/google-login", googleLogin);
router.patch("/:id", updateUser);
router.get("/:id", userDetails);

// FACT: New S3 Resume Endpoints
router.post("/:id/resume/upload-url", getResumeUploadUrl);
router.post("/:id/resume/save-key", saveResumeKey);
router.get("/:id/resume/view", getViewableResumeUrl);
router.get("/:id/resume/download", getDownloadableResumeUrl);

export default router;