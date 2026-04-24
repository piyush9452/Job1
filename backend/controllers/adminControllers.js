import * as xlsx from 'xlsx';
import User from '../models/users.js';

import errorHandler from "express-async-handler";
import Admin from "../models/admin.js";
import Job from "../models/jobs.js";
import jwt from "jsonwebtoken";
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client } from '@aws-sdk/client-s3';
import Employer from '../models/employer.js';
import expressAsyncHandler from "express-async-handler";

// Helper to get S3 Client (duplicate this if it's not already in this file)
const getS3Client = () => {
  return new S3Client({
    region: process.env.AWS_BUCKET_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
};

// 1. Fetch entire confidential profile
export const getEmployerDetailsForAdmin = expressAsyncHandler(async (req, res) => {
  const employer = await Employer.findById(req.params.id).select('-password');
  if (!employer) {
    res.status(404); throw new Error("Employer not found");
  }
  res.status(200).json(employer);
});

// 2. Fetch specific confidential document
export const getAdminViewableDocumentUrl = expressAsyncHandler(async (req, res) => {
  const client = getS3Client(); 
  const employer = await Employer.findById(req.params.id);
  const { field } = req.query; 

  if (!employer) { res.status(404); throw new Error("Employer not found"); }
  if (!field || !employer[field]) { res.status(404); throw new Error(`No document uploaded for ${field}`); }

  const command = new GetObjectCommand({ Bucket: process.env.AWS_BUCKET_NAME, Key: employer[field] });
  const url = await getSignedUrl(client, command, { expiresIn: 300 });

  res.status(200).json({ viewableUrl: url });
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// @desc    Auth admin & get token
// @route   POST /api/admin/login
export const authAdmin = errorHandler(async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });

  if (admin && (await admin.matchPassword(password))) {
    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Get all pending employers
// @route   GET /api/admin/employers/pending
export const getPendingEmployers = errorHandler(async (req, res) => {
  const employers = await Employer.find({ isApproved: "pending" }).select("-password");
  res.json(employers);
});

// @desc    Get all pending jobs
// @route   GET /api/admin/jobs/pending
export const getPendingJobs = errorHandler(async (req, res) => {
  const jobs = await Job.find({ status: "pending_approval" }).populate("postedBy", "name email companyName");
  res.json(jobs);
});

// @desc    Approve or Reject an Employer
// @route   PATCH /api/admin/employers/:id/review
export const reviewEmployer = errorHandler(async (req, res) => {
  const { status } = req.body; // must be "approved" or "rejected"
  const employer = await Employer.findById(req.params.id);

  if (!employer) {
    res.status(404);
    throw new Error("Employer not found");
  }

  employer.isApproved = status;
  await employer.save();

  res.json({ message: `Employer ${status} successfully`, employer });
});

// @desc    Approve or Reject a Job
// @route   PATCH /api/admin/jobs/:id/review
export const reviewJob = errorHandler(async (req, res) => {
  const { status } = req.body; // must be "active" or "rejected"
  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  job.status = status;
  await job.save();

  res.json({ message: `Job marked as ${status} successfully`, job });
});

export const getJobForAdmin = expressAsyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    res.status(404); 
    throw new Error("Job not found");
  }
  res.status(200).json(job);
});

// @desc    Export Profile Data to Excel
// @route   GET /api/admin/export
export const exportDataToExcel = expressAsyncHandler(async (req, res) => {
  // 1. Fetch ONLY Users (Jobseekers) and Employers
  const users = await User.find({}).select('-password -__v').lean();
  const employers = await Employer.find({}).select('-password -__v').lean();

  // 2. Format Jobseeker Profiles cleanly
  const formattedJobseekers = users.map(user => ({
    "Account ID": user._id.toString(),
    "Full Name": user.name || "N/A",
    "Email": user.email,
    "Phone": user.phone || "N/A",
    "Gender": user.gender || "N/A",
    "Profile Complete": user.isProfileComplete ? "Yes" : "No",
    "Account Verified": user.isVerified ? "Yes" : "No",
    "Skills": user.skills && user.skills.length > 0 ? user.skills.join(', ') : "None",
    "Highest Degree": user.education && user.education.length > 0 ? user.education[0].degree : "N/A",
    "Total Experience Entries": user.experience ? user.experience.length : 0,
    "About/Description": user.description || "N/A",
    "Registered On": new Date(user.createdAt).toLocaleDateString()
  }));

  // 3. Format Employer Profiles cleanly
  const formattedEmployers = employers.map(emp => ({
    "Account ID": emp._id.toString(),
    "Contact Person": emp.name || "N/A",
    "Email": emp.email,
    "Phone": emp.phone || "N/A",
    "Gender": emp.gender || "N/A",
    "Entity Type": emp.employerType || "company",
    "Company Name": emp.companyName || "N/A",
    "Nature of Business": emp.natureOfBusiness || "N/A",
    "Industry": emp.industry || "N/A",
    "Location": emp.location || "N/A",
    "Website": emp.companyWebsite || "N/A",
    "Approval Status": emp.isApproved.toUpperCase(),
    "Account Verified": emp.isVerified ? "Yes" : "No",
    "Profile Complete": emp.isProfileComplete ? "Yes" : "No",
    "About/Description": emp.description || "N/A",
    "Registered On": new Date(emp.createdAt).toLocaleDateString()
  }));

  // 4. Create Excel Workbook
  const workbook = xlsx.utils.book_new();
  
  const wsUsers = xlsx.utils.json_to_sheet(formattedJobseekers);
  const wsEmployers = xlsx.utils.json_to_sheet(formattedEmployers);

  // 5. Append targeted profile sheets
  xlsx.utils.book_append_sheet(workbook, wsUsers, "Jobseeker Profiles");
  xlsx.utils.book_append_sheet(workbook, wsEmployers, "Employer Profiles");

  // 6. Generate Buffer and send
  const excelBuffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

  res.setHeader('Content-Disposition', 'attachment; filename="Platform_Profiles_Extraction.xlsx"');
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  
  res.send(excelBuffer);
});



// @desc    Export Single Employer Profile to Excel
// @route   GET /api/admin/employers/:id/export
export const exportSingleEmployerToExcel = expressAsyncHandler(async (req, res) => {
  const emp = await Employer.findById(req.params.id).select('-password -__v').lean();
  
  if (!emp) {
    res.status(404);
    throw new Error("Employer not found");
  }

  // Format the single profile exactly like the bulk export
  const formattedEmployer = [{
    "Account ID": emp._id.toString(),
    "Contact Person": emp.name || "N/A",
    "Email": emp.email,
    "Phone": emp.phone || "N/A",
    "Gender": emp.gender || "N/A",
    "Entity Type": emp.employerType || "company",
    "Company Name": emp.companyName || "N/A",
    "Nature of Business": emp.natureOfBusiness || "N/A",
    "Industry": emp.industry || "N/A",
    "Location": emp.location || "N/A",
    "Website": emp.companyWebsite || "N/A",
    "Approval Status": emp.isApproved ? emp.isApproved.toUpperCase() : "N/A",
    "Account Verified": emp.isVerified ? "Yes" : "No",
    "Profile Complete": emp.isProfileComplete ? "Yes" : "No",
    "About/Description": emp.description || "N/A",
    "Registered On": new Date(emp.createdAt).toLocaleDateString()
  }];

  const workbook = xlsx.utils.book_new();
  const wsEmployer = xlsx.utils.json_to_sheet(formattedEmployer);
  xlsx.utils.book_append_sheet(workbook, wsEmployer, "Employer Profile");

  const excelBuffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

  // Dynamically name the file based on the company name or ID
  const fileName = `EmployerProfile_${emp.companyName ? emp.companyName.replace(/\s+/g, '_') : emp._id}.xlsx`;

  res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  
  res.send(excelBuffer);
});