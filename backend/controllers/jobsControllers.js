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



