import Job from "../models/jobs.js";
import { createJob } from "../controllers/jobsControllers.js";
import express from "express";


const router = express.Router();

router.post("/", createJob);


export default router;