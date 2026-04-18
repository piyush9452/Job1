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