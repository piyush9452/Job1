import expressAsyncHandler from "express-async-handler";
import Job from "../models/jobs.js";
import User from "../models/users.js";
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
  // --- 1. FILTERING ---
  // We start with a base query object and add filters conditionally.
  const queryObj = { ...req.query };
  const filters = {};

  // Text-based search for title and location (case-insensitive)
  if (queryObj.title) {
    filters.title = { $regex: queryObj.title, $options: 'i' };
  }
  if (queryObj.location) {
    filters.location = { $regex: queryObj.location, $options: 'i' };
  }

  // Exact match for enum fields
  if (queryObj.jobType) {
    filters.jobType = queryObj.jobType;
  }
  if (queryObj.status) {
    filters.status = queryObj.status;
  }

  // Filter by skills (supports comma-separated values like "react,node")
  if (queryObj.skillsRequired) {
    const skills = queryObj.skillsRequired.split(',');
    // $in operator matches if the skillsRequired array contains any of the provided skills
    filters.skillsRequired = { $in: skills };
  }

  // Numeric range for salary (e.g., /jobs?salary[gte]=500&salary[lte]=1000)
  if (queryObj.salary) {
    const salaryFilter = {};
    if (queryObj.salary.gte) {
      salaryFilter.$gte = Number(queryObj.salary.gte);
    }
    if (queryObj.salary.lte) {
      salaryFilter.$lte = Number(queryObj.salary.lte);
    }
    if (Object.keys(salaryFilter).length > 0) {
      filters.salary = salaryFilter;
    }
  }

  // --- 2. PAGINATION ---
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10; // Default to 10 results per page
  const skip = (page - 1) * limit;

  // --- 3. SORTING ---
  // Default sort by most recent post.
  // Supports sorting like ?sort=salary or ?sort=-salary (for descending)
  let sortBy = { postedAt: -1 }; 
  if (req.query.sort) {
    const sortField = req.query.sort.startsWith('-') 
      ? req.query.sort.substring(1) 
      : req.query.sort;
    const sortOrder = req.query.sort.startsWith('-') ? -1 : 1;
    sortBy = { [sortField]: sortOrder };
  }

  // --- 4. EXECUTE QUERY ---
  const jobs = await Job.find(filters)
    .sort(sortBy)
    .skip(skip)
    .limit(limit);
    
  // Optional: Get total count for pagination metadata on the frontend
  const totalJobs = await Job.countDocuments(filters);

  res.status(200).json({
    results: jobs.length,
    page,
    totalPages: Math.ceil(totalJobs / limit),
    totalJobs,
    data: jobs,
  });
});


export const jobCreatedByUser = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const jobs = await Job.find({ postedBy: id });
  if (!jobs) return res.status(404).json({ message: "No jobs found for this user" });
  res.status(200).json(jobs);
})


export const updateJob = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const job = await Job.findById(id);
  if (!job) return res.status(404).json({ message: "Job not found" });
  // Ensure the authenticated user is the owner of the job
  if (job.postedBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized to update this job" });
  }
  const updatedJob = await Job.findByIdAndUpdate(id, req.body, { new: true });
  res.status(200).json({ message: "Job updated successfully", job: updatedJob });
});

export const deleteJob = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const job = await Job.findById(id);
  if (!job) return res.status(404).json({ message: "Job not found" });
  // Ensure the authenticated user is the owner of the job
  if (job.postedBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized to delete this job" });
  }

  await Job.deleteOne({ _id: id });

  await User.findByIdAndUpdate(req.user._id, {
  $pull: { createdJobs: id },
});

  res.status(200).json({ message: "Job deleted successfully" });
});
