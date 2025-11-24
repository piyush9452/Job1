import express from "express";
import { registerEmployer,loginEmployer,verifyOTP,getPublicEmployerProfile ,updateEmployerProfile,getPresignedUploadUrl,saveDocumentKey,getViewableDocumentUrl,getDownloadableDocumentUrl,continueWithGoogle,completeGoogleSignup} from "../controllers/employerControllers.js";
import { getEmployerCreatedJobs } from "../controllers/jobsControllers.js";
import { body } from 'express-validator';
import protect from "../middleware/authorization.js";
import { protectEmployer } from "../middleware/employercheck.js";

const router = express.Router();

const rules = [
  body('name', 'Name is required').not().isEmpty().trim(),
  body('email', 'A valid email is required').isEmail().normalizeEmail(),
  body('password', 'Password must be 6+ characters').isLength({ min: 6 })
];


router.post("/register",rules, registerEmployer);

router.post("/verifyotp", verifyOTP);

router.post("/login", loginEmployer);

router.post("/updateProfile",protectEmployer,updateEmployerProfile)

router.get("/profile/:id", getPublicEmployerProfile);

router.post("/generate-upload-url",protectEmployer, getPresignedUploadUrl);

router.patch("/save-document-key", protectEmployer,saveDocumentKey);

router.get("/documentViewUrl", protectEmployer,getViewableDocumentUrl);

router.get("/documentDownloadUrl", protectEmployer,getDownloadableDocumentUrl);

router.post('/google-check', continueWithGoogle);

router.post('/google-complete', completeGoogleSignup);

router.get("/createdJobs", protectEmployer,getEmployerCreatedJobs);



export default router;