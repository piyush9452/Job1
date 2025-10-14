import errorHandler from "express-async-handler";
import Application from "../models/applications.js";
import Job from "../models/jobs.js";
import User from "../models/users.js";


export const createApplication = errorHandler(async (req, res) => {
 const { jobId } = req.body;
  const userId = req.user?._id; // from protect middleware

  if (!userId) {
    res.status(401);
    throw new Error("Unauthorized: User not logged in");
  }

  if (!jobId) {
    res.status(400);
    throw new Error("Job ID is required");
  }

  const job = await Job.findById(jobId);
  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  if (job.postedBy.toString() === userId.toString()) {
    res.status(400);
    throw new Error("You cannot apply to your own job");
  }

  const existingApplication = await Application.findOne({
    job_id: jobId,
    appliedBy: userId,
  });
  if (existingApplication) {
    res.status(400);
    throw new Error("You have already applied for this job");
  }


  const application = await Application.create({
    job_id: jobId,
    jobHost: job.postedBy,
    appliedBy: userId,
  });

  job.applicants.push(userId);
  await job.save();

  await User.findByIdAndUpdate(
    userId,
    { $addToSet: { appliedJobs: jobId } }, // addToSet prevents duplicates
    { new: true }
  );

  res.status(201).json({
    success: true,
    message: "Application submitted successfully",
    application,
  });
})




//-----------------------------------------------------------------------------------------------------------------




export const allApplicationFromUser = errorHandler(async (req, res) => {
     const userId = req.user._id;

  // Find all applications by this user
  const applications = await Application.find({ appliedBy: userId })
    .populate({
      path: "job_id",
      model: Job,
      populate: {
        path: "postedBy",
        select: "name email profileImage",
      },
    })
    .populate("jobHost", "name email profileImage");

  if (!applications || applications.length === 0) {
    res.status(404);
    throw new Error("No applications found for this user.");
  }

  // Optionally transform for cleaner output
  const formatted = applications.map((app) => ({
    applicationId: app._id,
    status: app.status,
    appliedAt: app.appliedAt,
    job: {
      id: app.job_id._id,
      title: app.job_id.title,
      description: app.job_id.description,
      jobType: app.job_id.jobType,
      location: app.job_id.location,
      salary: app.job_id.salary,
      skillsRequired: app.job_id.skillsRequired,
      postedBy: {
        id: app.job_id.postedBy?._id,
        name: app.job_id.postedByName || app.job_id.postedBy?.name,
        image: app.job_id.postedByImage || app.job_id.postedBy?.profileImage,
      },
      status: app.job_id.status,
    },
  }));

  res.status(200).json({
    success: true,
    count: formatted.length,
    applications: formatted,
  });
});




// PATCH: /api/applications/:id
export const updateApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Optional: restrict what can be updated
    const allowedFields = ["status"];
    const invalidFields = Object.keys(updates).filter(
      (field) => !allowedFields.includes(field)
    );
    if (invalidFields.length) {
      return res.status(400).json({
        message: `Invalid fields: ${invalidFields.join(", ")}`,
      });
    }

    const application = await Application.findByIdAndUpdate(id, updates, {
      new: true, // return updated document
      runValidators: true, // enforce schema validation
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json({
      message: "Application updated successfully",
      data: application,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};