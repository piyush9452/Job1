import expressAsyncHandler from "express-async-handler";
import Job from "../models/jobs.js";
import User from "../models/users.js";
import { validationResult } from "express-validator";
import Employer from "../models/employer.js"; // Adjust path as needed


export const createJob = expressAsyncHandler(async (req, res) => {
  // 1. Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  // 2. Find the employer who is posting the job
  // We get req.employerId from the 'protectEmployer' middleware
  const employer = await Employer.findById(req.employerId).select('name profilePicture createdJobs');

  if (!employer) {
    res.status(404);
    throw new Error('Employer not found');
  }

  // 3. Create the new job
  const newJob = new Job({
    ...req.body,
    postedBy: req.employerId,
    postedByName: employer.name,
    postedByImage: employer.profilePicture || '', // Use profile pic or empty string
  });

  // 4. Save the job
  const savedJob = await newJob.save();

  // 5. Add this job's ID to the employer's 'createdJobs' array
  employer.createdJobs.push(savedJob._id);
  await employer.save();

  // 6. Send the new job as the response
  res.status(201).json(savedJob);
});





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



export const getEmployerCreatedJobs = expressAsyncHandler(async (req, res) => {
  // 1. req.employerId is attached by the 'protectEmployer' middleware
  const employerId = req.employerId;
  try{
    const jobs = await Job.find({ postedBy: employerId }).sort({ postedAt: -1 });
    res.status(200).json(jobs);
  }
  catch(error){
    res.status(500).json({ message: "Server error", error: error.message });

  }
 
});




export const jobCreatedByUser = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const jobs = await Job.find({ postedBy: id });

  // This is the correct way to check if no jobs were found
  if (!jobs || jobs.length === 0) {
    return res.status(404).json({ message: "No jobs found for this user" });
  }

  res.status(200).json(jobs);
});


export const updateJob = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const job = await Job.findById(id);
  
  if (!job) return res.status(404).json({ message: "Job not found" });

  // FIX: Use req.employerId, NOT req.user._id
  if (job.postedBy.toString() !== req.employerId.toString()) {
    return res.status(403).json({ message: "Not authorized to update this job" });
  }

  const updatedJob = await Job.findByIdAndUpdate(id, req.body, { new: true });
  res.status(200).json({ message: "Job updated successfully", job: updatedJob });
});



export const deleteJob = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const job = await Job.findById(id);
  
  if (!job) return res.status(404).json({ message: "Job not found" });

  // FIX: Use req.employerId, NOT req.user._id
  if (job.postedBy.toString() !== req.employerId.toString()) {
    return res.status(403).json({ message: "Not authorized to delete this job" });
  }

  await Job.deleteOne({ _id: id });

  // FIX: You must also update the EMPLOYER model, not the User model
  // Import Employer at the top of your file if not already imported
  await Employer.findByIdAndUpdate(req.employerId, {
    $pull: { createdJobs: id },
  });

  res.status(200).json({ message: "Job deleted successfully" });
});



export const getJobApplicants = expressAsyncHandler(async (req, res) => {
  const jobId = req.params.id;

  // 1. Find the Job
  const job = await Job.findById(jobId);

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  // 2. SECURITY CHECK: Is the logged-in employer the owner?
  // req.employerId comes from your 'protectEmployer' middleware
  if (job.postedBy.toString() !== req.employerId.toString()) {
    res.status(403); // Forbidden
    throw new Error("Not authorized to view applicants for this job");
  }

  // 3. Populate the applicants array
  // This replaces the User IDs with the actual User documents
  await job.populate({
    path: 'applicants',
    // Select ONLY the fields you need. Do NOT send the password hash!
    select: 'name email phone resume skills experience education profilePicture' 
  });

  // 4. Return the populated list
  res.status(200).json(job.applicants);
});
