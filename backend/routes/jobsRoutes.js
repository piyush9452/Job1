import { createJob, getJob, getJobs, jobCreatedByUser} from "../controllers/jobsControllers.js";
import protect from "../middleware/authorization.js";
import express from "express";


const router = express.Router();

router.post("/",protect, createJob);

router.get("/:id", getJob);

router.get("/", getJobs);

router.get("/user/:id",protect, jobCreatedByUser);

router.get("/userApplied/:id",protect);


export default router;