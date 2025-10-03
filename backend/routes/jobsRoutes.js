import { createJob, getJob, getJobs} from "../controllers/jobsControllers.js";
import protect from "../middleware/authorization.js";
import express from "express";


const router = express.Router();

router.post("/",protect, createJob);

router.get("/:id", getJob);

router.get("/", getJobs);


export default router;