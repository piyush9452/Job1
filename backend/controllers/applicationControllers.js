import errorHandler from "express-async-handler";
import Application from "../models/applications.js";
import Employer from "../models/employer.js";
import Job from "../models/jobs.js";
import User from "../models/users.js";
import sendEmail from "../utils/sendEmail.js";

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
    employerMessage: app.employerMessage || "", // <-- FIX: Passing the message to the frontend!
    appliedAt: app.appliedAt,
    job: {
      id: app.job_id._id,
      title: app.job_id.title,
      description: app.job_id.description,
      mode: app.job_id.mode,                       // <-- FIX: New schema
      workDays: app.job_id.workDays,               // <-- FIX: New schema
      location: app.job_id.location,
      salaryAmount: app.job_id.salaryAmount,       // <-- FIX: Fixes the missing salary
      salaryFrequency: app.job_id.salaryFrequency, // <-- FIX: New schema
      isLongTerm: app.job_id.isLongTerm,           // <-- FIX: New schema
      noOfDays: app.job_id.noOfDays,               // <-- FIX: New schema
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
export const updateApplicationStatus = errorHandler(async (req, res) => {
  const { id } = req.params;
  const { status, employerMessage } = req.body;

  // FACT: Populating the user data to get their email, and the job data for the email subject
  const application = await Application.findById(id)
    .populate("appliedBy", "name email")
    .populate("job_id", "title");

  if (!application) {
    res.status(404);
    throw new Error("Application not found");
  }

  if (application.jobHost.toString() !== req.employerId.toString()) {
     res.status(403);
     throw new Error("Not authorized to update this application");
  }

  application.status = status;
  if (employerMessage !== undefined) {
    application.employerMessage = employerMessage;
  }

  await application.save();

  // --- FACT: THE NEW EMAIL SERVICE TRIGGER ---
  try {
    const userEmail = application.appliedBy.email;
    const userName = application.appliedBy.name;
    const jobTitle = application.job_id.title;

    const emailHTML = `
      <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
        <h2 style="color: #4f46e5;">Application Update</h2>
        <p style="color: #334155; font-size: 16px;">Hi <strong>${userName}</strong>,</p>
        <p style="color: #334155; font-size: 16px;">Your application for the <strong>${jobTitle}</strong> role has been updated to: <strong style="color: #4f46e5; text-transform: uppercase;">${status}</strong>.</p>
        
        ${employerMessage ? `
          <div style="margin-top: 20px; padding: 15px; background-color: #f8fafc; border-left: 4px solid #4f46e5; border-radius: 5px;">
            <p style="margin: 0; color: #64748b; font-size: 12px; text-transform: uppercase; font-weight: bold;">Message from the Employer:</p>
            <p style="color: #1e293b; font-size: 15px; white-space: pre-wrap;">${employerMessage}</p>
          </div>
        ` : ''}

        <p style="color: #64748b; font-size: 14px; margin-top: 30px;">Log in to your JobOne dashboard to view more details.</p>
      </div>
    `;

    await sendEmail({
      email: userEmail,
      subject: `Update on your application for ${jobTitle}`,
      html: emailHTML,
    });

    console.log(`Notification email successfully sent to ${userEmail}`);
  } catch (emailError) {
    console.error("Critical: Status updated, but email failed to send.", emailError);
    // We log the error but do NOT crash the API response, so the status still updates on the frontend.
  }

  res.status(200).json({
    message: "Status updated successfully and email triggered.",
    application,
  });
});

export const getJobApplications = errorHandler(async (req, res) => {
  const { jobId } = req.params;

  // 1. Verify Job exists
  const job = await Job.findById(jobId);
  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  // 2. Security Check: Does this job belong to the logged-in employer?
  // req.employerId comes from the protectEmployer middleware
  if (job.postedBy.toString() !== req.employerId.toString()) {
    res.status(403);
    throw new Error("Not authorized to view these applications");
  }

  // 3. Find Applications
  const applications = await Application.find({ job_id: jobId })
    .populate("appliedBy", "name email phone profilePicture skills experience education resume")
    .sort({ appliedAt: -1 });

  res.status(200).json(applications);
});



