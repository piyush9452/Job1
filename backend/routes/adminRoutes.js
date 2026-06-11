import express from "express";
import {
  authAdmin,
  getPendingEmployers,
  getPendingJobs,
  reviewEmployer,
  reviewJob,
  getEmployerDetailsForAdmin,
  getAdminViewableDocumentUrl,
  getJobForAdmin,
  exportDataToExcel,
  exportSingleEmployerToExcel,
  freezeUser,
  freezeEmployer,searchJobseekers,searchEmployers,
  createAdmin, getAllJobsForAdmin, getEmployerJobsWithApplications, getJobseekerApplicationsForAdmin,
  getAllEmployersForAdmin, getAllJobseekersForAdmin
} from "../controllers/adminControllers.js";
import { protectAdmin, restrictTo } from "../middleware/authorization.js";

const router = express.Router();

router.post("/login", authAdmin);

// Super Admin Only Route
router.post("/create-admin", protectAdmin, restrictTo("superAdmin"), createAdmin);

// Protected Global Admin Routes
router.get("/employers/pending", protectAdmin, restrictTo('superAdmin', 'employerAdmin'), getPendingEmployers);
router.get("/employers", protectAdmin, restrictTo('superAdmin', 'employerAdmin'), getAllEmployersForAdmin);
router.get("/users", protectAdmin, restrictTo('superAdmin', 'jobseekerAdmin'), getAllJobseekersForAdmin);
router.get("/jobs/pending", protectAdmin, restrictTo('superAdmin', 'employerAdmin'), getPendingJobs);
router.get("/jobs", protectAdmin, restrictTo('superAdmin', 'employerAdmin'), getAllJobsForAdmin);
router.get("/employers/:id/jobs", protectAdmin, restrictTo('superAdmin', 'employerAdmin'), getEmployerJobsWithApplications);
router.get("/users/:id/applications", protectAdmin, restrictTo('superAdmin', 'jobseekerAdmin'), getJobseekerApplicationsForAdmin);
router.patch("/employers/:id/review", protectAdmin, restrictTo('superAdmin', 'employerAdmin'), reviewEmployer);
router.patch("/jobs/:id/review", protectAdmin, restrictTo('superAdmin', 'employerAdmin'), reviewJob);
router.get('/employers/:id', protectAdmin, restrictTo('superAdmin', 'employerAdmin'), getEmployerDetailsForAdmin);
router.get('/employers/:id/document', protectAdmin, restrictTo('superAdmin', 'employerAdmin'), getAdminViewableDocumentUrl);
router.get('/jobs/:id', protectAdmin, getJobForAdmin);
router.get('/export', protectAdmin, restrictTo('superAdmin'), exportDataToExcel);
router.get('/employers/:id/export', protectAdmin, restrictTo('superAdmin', 'employerAdmin'), exportSingleEmployerToExcel);

// FACT: Strict RBAC Route Freezing. 
// employerAdmin cannot freeze jobseekers. jobseekerAdmin cannot freeze employers.
router.put('/freeze-user/:id', protectAdmin, restrictTo('superAdmin', 'jobseekerAdmin'), freezeUser);
router.put('/freeze-employer/:id', protectAdmin, restrictTo('superAdmin', 'employerAdmin'), freezeEmployer);


router.get('/search/users', protectAdmin, restrictTo('superAdmin', 'jobseekerAdmin'), searchJobseekers);
router.get('/search/employers', protectAdmin, restrictTo('superAdmin', 'employerAdmin'), searchEmployers);

export default router;