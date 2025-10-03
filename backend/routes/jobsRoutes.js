import Job from "../models/jobs.js";
import { createJob } from "../controllers/jobsControllers.js";
import protect from "../middleware/authorization.js";
import express from "express";


const router = express.Router();

router.post("/",protect, createJob);


export default router;