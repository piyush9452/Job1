import errorHandler from "express-async-handler";
import Admin from "../models/admin.js";
import Employer from "../models/employer.js";
import Job from "../models/jobs.js";
import jwt from "jsonwebtoken";

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