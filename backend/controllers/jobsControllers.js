import expressAsyncHandler from "express-async-handler";
import Job from "../models/jobs.js";
import User from "../models/users.js";
import mongoose from "mongoose";
import { validationResult } from "express-validator";
import Employer from "../models/employer.js"; // Adjust path as needed
import jwt from "jsonwebtoken";


export const createJob = expressAsyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const employer = await Employer.findById(req.employerId);
  if (!employer) {
    res.status(404);
    throw new Error('Employer not found');
  }

  // FACT: The Ultimate Backend Lock.
  // Even if a user bypasses your React frontend using Postman, the server will instantly reject the job creation.
  if (employer.isApproved !== "approved") {
    res.status(403);
    throw new Error("Your account is currently pending admin approval. You cannot post jobs at this time.");
  }

  // Strict Profile Check
  // ==========================================
  // FACT: Dynamic Profile & Document Check 
  // ==========================================
  let missingFields = [];
  
  // Universal required fields
  const baseFields = ['phone', 'location', 'industry', 'description', 'aadharCard', 'panCard'];
  baseFields.forEach(field => {
    if (!employer[field] || employer[field].trim() === '') missingFields.push(field);
  });

  // Conditional required fields based on entity type
  if (employer.employerType === "company") {
    const companyFields = ['companyName', 'natureOfBusiness', 'gstForm'];
    companyFields.forEach(field => {
      if (!employer[field] || employer[field].trim() === '') missingFields.push(field);
    });
  } else {
    // Individual
    const individualFields = ['tradeLicense', 'educationDocuments'];
    individualFields.forEach(field => {
      if (!employer[field] || employer[field].trim() === '') missingFields.push(field);
    });
  }

  if (missingFields.length > 0) {
    res.status(403);
    throw new Error(`You must complete your profile and upload required documents before posting a job. Missing: ${missingFields.join(', ')}`);
  }

  const { 
    title, description, jobType, workDaysPattern, customWorkDaysDescription,
    skillsRequired, salaryAmount, salaryFrequency,salaryCurrency, incentives,
    durationType, startDate, endDate, isFlexibleDuration,
    shifts, isFlexibleShifts, mode, noOfDays, noOfPeopleRequired, 
    genderPreference, qualifications, courses, ageLimit, languages, experience,
    pinCode, location, useOfficeLocation ,applicationDeadline,
  } = req.body;

  let locationData;
  if (useOfficeLocation) {
    if (!employer.officeLocation || !employer.officeLocation.coordinates) {
      res.status(400);
      throw new Error("Your profile does not have a valid Office Location saved. Please update your profile or pick a location manually.");
    }
    locationData = employer.officeLocation;
  } else if (location && location.type === 'Point') {
    locationData = location;
  } else {
    if (mode && (mode.includes('Work from office') || mode.includes('Work from field'))) {
        res.status(400);
        throw new Error("Please pick a location on the map or select 'Same as office location'.");
    }
    locationData = { type: 'Point', coordinates: [0, 0], address: "Remote" };
  }

  const { jobFeatures } = req.body;

  const newJob = new Job({
    title, 
    description, 
    jobType,
    workDaysPattern,
    jobFeatures,
    customWorkDaysDescription: workDaysPattern === "Custom" ? customWorkDaysDescription : "",
    skillsRequired, 
    salaryAmount, 
    salaryFrequency,
      salaryCurrency,
    incentives,
    durationType, 
    startDate, 
    endDate,
      isFlexibleDuration,
    applicationDeadline,
    shifts: isFlexibleShifts ? [] : shifts, 
    isFlexibleShifts,
    mode, 
    noOfDays, 
    noOfPeopleRequired, 
    genderPreference, 
    qualifications,
    courses,
    ageLimit,
    languages,
      experience,
    pinCode,
    location: locationData,
    
    // FACT: Jobs no longer go live automatically. They are forced into the pending state for Admin review.
    status: "pending_approval", 
    
    postedBy: req.employerId,
    postedByName: employer.name, 
    postedByImage: employer.profilePicture || '', 
    postedByCompany: employer.companyName,
  });

  const savedJob = await newJob.save();
  employer.createdJobs.push(savedJob._id);
  await employer.save();
  
  res.status(201).json(savedJob);
});

export const getJob = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const job = await Job.findById(id);
  
  if (!job) return res.status(404).json({ message: "Job not found" });

  // FACT: If the job is active, anyone can view it.
  if (job.status === "active") {
    return res.status(200).json(job);
  }

  // FACT: If the job is NOT active, we manually check if the requester is the owning employer.
  let isOwner = false;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      if (decoded.employer && decoded.employer.id === job.postedBy.toString()) {
        isOwner = true;
      }
    } catch (error) {
      // Ignore token errors for public viewing attempts
    }
  }

  if (!isOwner) {
    return res.status(403).json({ message: "This job is currently under review or closed and cannot be viewed publicly." });
  }

  res.status(200).json(job);
});




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
  // --- 4. EXECUTE QUERY ---
  // FACT: Merge the user's search filters with the strict Admin security lock
  const finalQuery = { ...filters, status: "active" };

  const jobs = await Job.find(finalQuery)
    .sort(sortBy)
    .skip(skip)
    .limit(limit);
    
  // FACT: The total count must also respect the security lock so pagination doesn't break
  const totalJobs = await Job.countDocuments(finalQuery);

  res.status(200).json({
    results: jobs.length,
    page,
    totalPages: Math.ceil(totalJobs / limit),
    totalJobs,
    data: jobs,
  });
});



// FACT: We are using a MongoDB aggregation pipeline to count every ATS stage dynamically.
export const getEmployerCreatedJobs = expressAsyncHandler(async (req, res) => {
  // 1. Safety check for the employer ID from your auth middleware
  if (!req.employerId) {
    res.status(401);
    throw new Error("Not authorized. No Employer ID found.");
  }

  try {
    // 2. Safely convert to MongoDB ObjectId
    const employerId = new mongoose.Types.ObjectId(req.employerId);
    
    // 3. The Aggregation Pipeline
    const jobs = await Job.aggregate([
      { $match: { postedBy: employerId } },
      { $sort: { postedAt: -1 } },
      {
        $lookup: {
          from: "applications", // Mongoose automatically lowercase-pluralizes "Application" to "applications"
          localField: "_id",
          foreignField: "job_id",
          as: "applicationsData"
        }
      },
      {
        $addFields: {
          stats: {
            total: { $size: "$applicationsData" },
            shortlisted: { $size: { $filter: { input: "$applicationsData", as: "app", cond: { $eq: ["$$app.status", "shortlisted"] } } } },
            interviewScheduled: { $size: { $filter: { input: "$applicationsData", as: "app", cond: { $eq: ["$$app.status", "Interview Scheduled"] } } } },
            interviewConducted: { $size: { $filter: { input: "$applicationsData", as: "app", cond: { $eq: ["$$app.status", "Interview Conducted"] } } } },
            hired: { $size: { $filter: { input: "$applicationsData", as: "app", cond: { $eq: ["$$app.status", "hired"] } } } },
            nctt: { $size: { $filter: { input: "$applicationsData", as: "app", cond: { $eq: ["$$app.status", "NCTT"] } } } }
          }
        }
      },
      { $project: { applicationsData: 0 } } // Strip out the heavy array before sending to frontend
    ]);
    
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Aggregation Error:", error); // This will log the exact issue to your backend terminal
    res.status(500).json({ message: "Failed to fetch dashboard stats", error: error.message });
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

  if (job.postedBy.toString() !== req.employerId.toString()) {
    return res.status(403).json({ message: "Not authorized to update this job" });
  }

  let updateData = { ...req.body };

  // FACT: Handle the "Same as Office Location" logic for edits
  if (updateData.useOfficeLocation) {
    const employer = await Employer.findById(req.employerId);
    if (!employer.officeLocation || !employer.officeLocation.coordinates) {
      res.status(400);
      throw new Error("Your profile does not have a valid Office Location saved. Please update your profile or pick a location manually.");
    }
    updateData.location = employer.officeLocation;
  } else if (updateData.location && updateData.location.type === 'Point') {
    // Keep the new coordinates sent from the frontend map
  } else if (updateData.mode && (updateData.mode.includes('Work from office') || updateData.mode.includes('Work from field'))) {
     if(!updateData.location) {
         res.status(400);
         throw new Error("Please pick a location on the map or select 'Same as office location'.");
     }
  } else {
    // Remote
    updateData.location = { type: 'Point', coordinates: [0, 0], address: "Remote" };
  }

  const updatedJob = await Job.findByIdAndUpdate(id, updateData, { new: true });
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




export const getSimilarJobs = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const currentJob = await Job.findById(id);
  if (!currentJob) {
    res.status(404);
    throw new Error("Job not found");
  }

  // Find jobs that share skills OR the same work mode, excluding the current job
  const similarJobs = await Job.find({
    _id: { $ne: id }, // Don't recommend the job they are already looking at
    $or: [
      { skillsRequired: { $in: currentJob.skillsRequired || [] } },
      { mode: currentJob.mode }
    ]
  })
  .limit(3) // Keep the UI clean by only showing the top 3 best matches
  .sort({ createdAt: -1 }); // Newest matching jobs first

  res.status(200).json(similarJobs);
});