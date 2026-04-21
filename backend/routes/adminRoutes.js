import express from "express";
import {
  authAdmin,
  getPendingEmployers,
  getPendingJobs,
  reviewEmployer,
  reviewJob,getEmployerDetailsForAdmin,getAdminViewableDocumentUrl
} from "../controllers/adminControllers.js";
import { protectAdmin } from "../middleware/authorization.js";

const router = express.Router();

router.post("/login", authAdmin);

// Protected Admin Routes
router.get("/employers/pending", protectAdmin, getPendingEmployers);
router.get("/jobs/pending", protectAdmin, getPendingJobs);
router.patch("/employers/:id/review", protectAdmin, reviewEmployer);
router.patch("/jobs/:id/review", protectAdmin, reviewJob);
router.get('/employers/:id', protectAdmin, getEmployerDetailsForAdmin);
router.get('/employers/:id/document', protectAdmin, getAdminViewableDocumentUrl);

export default router;