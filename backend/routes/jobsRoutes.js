import { createJob, getJob, getJobs, jobCreatedByUser,deleteJob,updateJob} from "../controllers/jobsControllers.js";
import protect from "../middleware/authorization.js";
import express from "express";


const router = express.Router();

router.post("/",protect, createJob);

router.get("/user/:id",protect, jobCreatedByUser);

router.get("/:id", getJob);

router.get("/", getJobs);

router.get("/userApplied/:id",protect);

router.delete("/:id",protect,deleteJob);

router.patch("/:id",protect,updateJob);

export default router;