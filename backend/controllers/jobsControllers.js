import expressAsyncHandler from "express-async-handler";
import Job from "../models/jobs.js";

export const createJob = expressAsyncHandler((async (req, res) => {
  const {
    title,
    description,
    jobType,
    skillsRequired,
    location,
    pinCode,
    salary,
    expiringAt
  } = req.body;

  // postedBy comes from JWT-authenticated user
  const userId = req.user._id; 
  const userName = req.user.name;
  const userImage = req.user.image || null;

  if (!title || !description || !jobType || !location || !salary) {
    res.status(400);
    throw new Error("Missing required fields");
  }

  const newJob = new Job({
    title,
    description,
    jobType,
    skillsRequired: skillsRequired || [],
    location,
    pinCode,
    salary,
    postedBy: userId,
    postedByName: userName,
    postedByImage: userImage,
    expiringAt
  });

  await newJob.save();

  res.status(201).json({
    message: "Job created successfully",
    job: newJob,
  });
}));


export const getJob = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const job = await Job.findById(id);
  if (!job) return res.status(404).json({ message: "Job not found" });
  res.status(200).json(job);
  
})


export const getJobs = expressAsyncHandler(async (req, res) => {
  const jobs = await Job.find().sort({ createdAt: -1 });
  res.status(200).json(jobs);
  //new addon 
});
