import express from "express";
import { 
  createUser, loginUser, updateUser, userDetails, verifyUserOTP, resendUserOTP, googleLogin,
  getResumeUploadUrl, saveResumeKey, getViewableResumeUrl, getDownloadableResumeUrl,
  forgotPasswordUser, resetPasswordUser
} from "../controllers/userControllers.js";
import { protectAny, protect } from "../middleware/authorization.js";

const router = express.Router();

// Auth & Profile
router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/verifyotp", verifyUserOTP);
router.post("/resend-otp", resendUserOTP);
router.post("/google-login", googleLogin);
router.patch("/:id", protect, updateUser);
router.get("/:id", protectAny, userDetails);
router.post("/forgot-password", forgotPasswordUser);
router.post("/reset-password", resetPasswordUser);

// FACT: New S3 Resume Endpoints
router.post("/:id/resume/upload-url", protect, getResumeUploadUrl);
router.post("/:id/resume/save-key", protect, saveResumeKey);
router.get("/:id/resume/view", protectAny, getViewableResumeUrl);
router.get("/:id/resume/download", protectAny, getDownloadableResumeUrl);

export default router;