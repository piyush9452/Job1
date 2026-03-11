import expressAsyncHandler from "express-async-handler";
import Job from "../models/jobs.js";
import User from "../models/users.js";
import { validationResult } from "express-validator";
import Employer from "../models/employer.js";

export const createJob = expressAsyncHandler(async (req, res) => {
  // 1. Validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  // 2. Fetch the Employer
  const employer = await Employer.findById(req.employerId);
  if (!employer) {
    res.status(404);
    throw new Error('Employer not found');
  }

  const requiredFields = ['companyName', 'phone', 'location', 'industry', 'description', 'companyWebsite'];
  const missingFields = requiredFields.filter(field => !employer[field] || employer[field].trim() === '');

  if (missingFields.length > 0) {
    res.status(403);
    throw new Error(`You must complete your profile before posting a job. Missing: ${missingFields.join(', ')}`);
  }

  const { 
    title, description, jobType, skillsRequired, 
    salary, durationType, startDate, endDate, 
    dailyWorkingHours, mode, workFrom, workTo, 
    noOfDays, noOfPeopleRequired, genderPreference, 
    paymentPerHour, pinCode, location
  } = req.body;

  // 3. FACT: Validate and handle location STRICTLY based on the Job Mode
  let finalLocation = undefined; // Default to completely undefined for WFH jobs

  if (mode === "Work from Office" || mode === "Hybrid") {
    // If it's an office job, it MUST have a valid location sent from frontend
    if (!location || !location.coordinates || location.coordinates.length !== 2) {
      res.status(400);
      throw new Error("Map coordinates and address are required for Office and Hybrid roles.");
    }
    finalLocation = location;
  }

  // 4. Create Job
  const newJob = new Job({
    title, description, jobType, skillsRequired, 
    salary, durationType, startDate, endDate, 
    dailyWorkingHours, mode, workFrom, workTo, 
    noOfDays, noOfPeopleRequired, genderPreference, 
    paymentPerHour, pinCode,
    
    location: finalLocation, // If WFH, this passes undefined, saving your DB from crashing

    postedBy: req.employerId,
    postedByName: employer.name, 
    postedByImage: employer.profilePicture || '', 
    postedByCompany: employer.companyName, 
  });

  const savedJob = await newJob.save();
  
  // 5. Link to Employer
  employer.createdJobs.push(savedJob._id);
  await employer.save();
  
  res.status(201).json(savedJob);
});


export const getJob = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const job = await Job.findById(id);
  if (!job) return res.status(404).json({ message: "Job not found" });
  res.status(200).json(job);
});

export const getJobs = expressAsyncHandler(async (req, res) => {
  const queryObj = { ...req.query };
  const filters = {};

  if (queryObj.title) filters.title = { $regex: queryObj.title, $options: 'i' };
  if (queryObj.location) filters.location = { $regex: queryObj.location, $options: 'i' };
  if (queryObj.jobType) filters.jobType = queryObj.jobType;
  if (queryObj.status) filters.status = queryObj.status;

  if (queryObj.skillsRequired) {
    const skills = queryObj.skillsRequired.split(',');
    filters.skillsRequired = { $in: skills };
  }

  if (queryObj.salary) {
    const salaryFilter = {};
    if (queryObj.salary.gte) salaryFilter.$gte = Number(queryObj.salary.gte);
    if (queryObj.salary.lte) salaryFilter.$lte = Number(queryObj.salary.lte);
    if (Object.keys(salaryFilter).length > 0) filters.salary = salaryFilter;
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  let sortBy = { postedAt: -1 }; 
  if (req.query.sort) {
    const sortField = req.query.sort.startsWith('-') ? req.query.sort.substring(1) : req.query.sort;
    const sortOrder = req.query.sort.startsWith('-') ? -1 : 1;
    sortBy = { [sortField]: sortOrder };
  }

  const jobs = await Job.find(filters).sort(sortBy).skip(skip).limit(limit);
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

  if (!jobs || jobs.length === 0) {
    return res.status(404).json({ message: "No jobs found for this user" });
  }
  res.status(200).json(jobs);
});

export const updateJob = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const job = await Job.findById(id);
  
  if (!job) return res.status(404).json({ message: "Job not found" });

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

  if (job.postedBy.toString() !== req.employerId.toString()) {
    return res.status(403).json({ message: "Not authorized to delete this job" });
  }

  await Job.deleteOne({ _id: id });
  await Employer.findByIdAndUpdate(req.employerId, { $pull: { createdJobs: id } });

  res.status(200).json({ message: "Job deleted successfully" });
});

export const getJobApplicants = expressAsyncHandler(async (req, res) => {
  const jobId = req.params.id;
  const job = await Job.findById(jobId);

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  if (job.postedBy.toString() !== req.employerId.toString()) {
    res.status(403); 
    throw new Error("Not authorized to view applicants for this job");
  }

  await job.populate({
    path: 'applicants',
    select: 'name email phone resume skills experience education profilePicture' 
  });

  res.status(200).json(job.applicants);
});

export const getJobsNearby = expressAsyncHandler(async (req, res) => {
  const { lat, lng, dist } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ message: "Latitude and Longitude are required" });
  }

  const radiusKm = dist || 50; 
  const radiusRadians = radiusKm / 6378.1; 

  const jobs = await Job.find({
    location: {
      $geoWithin: {
        $centerSphere: [[parseFloat(lng), parseFloat(lat)], radiusRadians]
      }
    }
  });

  res.status(200).json(jobs);
});