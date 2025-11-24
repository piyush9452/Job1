import { createJob, getJob, getJobs, jobCreatedByUser,deleteJob,updateJob,getEmployerCreatedJobs,getJobApplicants} from "../controllers/jobsControllers.js";
import protect from "../middleware/authorization.js";
import { protectEmployer } from "../middleware/employercheck.js";
import express from "express";


const router = express.Router();




router.post("/",protectEmployer, createJob);


router.get("/employerJobs",protectEmployer,getEmployerCreatedJobs);

// jobs created by a specific employer changed now the path has been changed to employer
router.get("/employer/:id",protectEmployer, jobCreatedByUser);



router.get("/", getJobs);

router.get("/:id", getJob);

router.get("/userApplied/:id",protect,);

router.get("/:id/applicants", protectEmployer, getJobApplicants);

router.delete("/:id",protectEmployer,deleteJob);

router.patch("/:id",protectEmployer,updateJob);

export default router;