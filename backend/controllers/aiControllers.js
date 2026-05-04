import expressAsyncHandler from "express-async-handler";
import mammoth from "mammoth";
import Job from "../models/jobs.js";
import User from "../models/users.js";

import { GoogleGenerativeAI } from "@google/generative-ai";
import expressAsyncHandler from "express-async-handler";
import mammoth from "mammoth";
import Job from "../models/jobs.js";
import User from "../models/users.js";

// FACT: Massively upgraded AI prompt to include Experience, Age, and Skills
export const generateJobDetails = expressAsyncHandler(async (req, res) => {
  const { title, jobType, mode, experience, ageLimit, skills } = req.body;

  if (!title) {
    res.status(400);
    throw new Error("Job title is required to generate a description.");
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  // Dynamically build the experience string based on what was passed from the frontend
  let expString = "Experience flexible based on candidate.";
  if (experience) {
      const relExp = experience.relevantExperience;
      if (relExp && !relExp.isAny) {
          expString = `Requires ${relExp.min} to ${relExp.max} years of specific relevant/on-field experience.`;
      } else if (experience.totalExperience && !experience.totalExperience.isAny) {
          expString = `Requires ${experience.totalExperience.min} to ${experience.totalExperience.max} years of overall professional experience.`;
      } else {
          expString = "Freshers welcome. No strict experience required.";
      }
  }

  // Construct a hyper-specific prompt
  const prompt = `
    You are an expert HR recruiter writing a highly professional job description.
    
    Job Details:
    - Title: "${title}"
    - Job Type: ${jobType || 'Full-time'}
    - Work Mode: ${mode || 'On-site'}
    - Required Skills: ${skills || 'General professional skills'}
    - Experience Needed: ${expString}
    
    Instructions:
    1. Write a "summary" (4-5 sentences). This must be a compelling pitch for the role. YOU MUST explicitly mention the exact experience requirements (${expString}) and the required skills in a natural, flowing way within this summary.
    2. Write "responsibilities" (6-7 bullet points). These must be specific to the title and mode. 
    
    Return EXACTLY a JSON object with this format, and nothing else. Do not use markdown code blocks like \`\`\`json. Just the raw JSON.
    {
      "summary": "Write the compelling summary here...",
      "responsibilities": "- Responsibility 1\\n- Responsibility 2\\n- Responsibility 3"
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Cleanup the Gemini response to guarantee JSON safety
    const cleanedText = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();
    const startIndex = cleanedText.indexOf('{');
    const endIndex = cleanedText.lastIndexOf('}');
    
    if (startIndex === -1 || endIndex === -1) {
       throw new Error("Gemini did not return a valid JSON object.");
    }

    const jsonString = cleanedText.substring(startIndex, endIndex + 1);
    const parsedData = JSON.parse(jsonString);
    
    res.status(200).json(parsedData);
  } catch (error) {
    console.error("AI Generation Error:", error);
    res.status(500);
    throw new Error("Failed to generate content with AI. Check your API key or try again.");
  }
});

import { GoogleGenerativeAI } from "@google/generative-ai";
import expressAsyncHandler from "express-async-handler";
import mammoth from "mammoth";
import User from "../models/users.js";

export const parseResume = expressAsyncHandler(async (req, res) => {
  const userId = req.user._id;

  if (!req.file) {
    res.status(400);
    throw new Error("No document uploaded.");
  }

  if (!req.file.buffer) {
    res.status(400);
    throw new Error("Server Error: File buffer is missing. Ensure your backend route uses multer.memoryStorage().");
  }

  const fileType = req.file.mimetype;
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const basePrompt = `
    You are an expert Applicant Tracking System (ATS). Extract the following information from the provided resume.
    Return EXACTLY a raw JSON object and nothing else. Do NOT use markdown formatting (\`\`\`json). If information for a field is missing, return an empty array or empty string.

    Strict JSON Schema required:
    {
      "name": "Candidate's full name if found, else empty string",
      "phone": "Extract ONLY the core digits of the phone number. Strip away any country codes (like +91), spaces, dashes, and location text (like Bhopal, MP). Example: '7024901312'. Else empty string.",
      "description": "Create a professional 2-3 sentence summary based on their profile.",
      "skills": ["Skill 1", "Skill 2", "Skill 3"],
      "experience": [
        { "role": "Job Title", "company": "Company Name", "duration": "YYYY - YYYY", "description": "Brief summary of duties" }
      ],
      "education": [
        { "degree": "Degree Name", "university": "Institution Name", "ended": "YYYY", "CGPA": "GPA/Percentage if found, else empty string" }
      ]
    }
  `;

  let generateParts = [];

  try {
    if (fileType === "application/pdf") {
      // FACT: Gemini natively understands PDFs. We pass the buffer directly as inlineData.
      generateParts = [
        { text: basePrompt },
        {
          inlineData: {
            data: req.file.buffer.toString("base64"),
            mimeType: "application/pdf"
          }
        }
      ];
    } else if (
      fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || 
      fileType === "application/msword"
    ) {
      // For Word Docs, we still use mammoth to extract text
      const docxData = await mammoth.extractRawText({ buffer: req.file.buffer });
      const rawText = docxData.value;
      
      if (!rawText || rawText.trim().length === 0) {
         throw new Error("The Word document is empty or unreadable.");
      }

      generateParts = [
        { text: basePrompt + "\n\nResume Text:\n" + rawText.substring(0, 15000) }
      ];
    } else {
      res.status(400);
      throw new Error(`Unsupported file format: ${fileType}. Please upload a PDF or DOCX.`);
    }
  } catch (err) {
    console.error("File Extraction Error:", err);
    res.status(500);
    throw new Error(`Document parsing failed: ${err.message}`);
  }

  try {
    // Send the constructed parts (either Text+PDF or just Text) to Gemini
    const result = await model.generateContent(generateParts);
    const responseText = result.response.text();
    
    // Aggressive JSON cleanup
    const cleanedText = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();
    const startIndex = cleanedText.indexOf('{');
    const endIndex = cleanedText.lastIndexOf('}');
    
    if (startIndex === -1 || endIndex === -1) {
       throw new Error("AI failed to output valid JSON.");
    }

    const jsonString = cleanedText.substring(startIndex, endIndex + 1);
    const parsedData = JSON.parse(jsonString);

    // FACT: The database update correctly happens HERE, after parsedData actually exists.
    await User.findByIdAndUpdate(userId, {
        resumeData: parsedData
    });

    res.status(200).json(parsedData);
  } catch (error) {
    console.error("Gemini Parsing Error:", error);
    res.status(500);
    throw new Error("AI failed to process and structure the resume data.");
  }
});


export const recommendJobs = expressAsyncHandler(async (req, res) => {
    const userId = req.user._id;

    // 1. Get user
    const user = await User.findById(userId);

    if (!user) {
        res.status(404);
        throw new Error("User not found.");
    }

// Use profile skills as fallback if no resume
    const userSkills = user.resumeData?.skills?.length
        ? user.resumeData.skills
        : user.skills || []; // your profile skills field

    if (!userSkills.length) {
        res.status(400);
        throw new Error("No skills found. Add skills to your profile or upload a resume.");
    }

    // 2. Fetch jobs (optimized)
    const jobs = await Job.find({ status: "active" })
        .select("title description skillsRequired mode salaryAmount")
        .limit(15);

    if (!jobs.length) {
        return res.json({ recommendedJobs: [] });
    }

    // 3. Pre-filter jobs (FAST)
    const filteredJobs = jobs.filter(job =>
        job.skillsRequired?.some(js =>
            userSkills.some(us => us.toLowerCase() === js.toLowerCase())
        )
    );

    const jobsToSend = filteredJobs.length > 0 ? filteredJobs : jobs;

    // 4. Trim data (VERY IMPORTANT for cost)
    const cleanJobs = jobsToSend.map(job => ({
        _id: job._id,
        title: job.title,
        description: job.description?.substring(0, 300),
        skillsRequired: job.skillsRequired
    }));

    // 5. Gemini setup
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are an AI job recommendation engine.

Candidate:
${JSON.stringify({
        skills: userSkills,
        experience: user.resumeData?.experience || user.experience || [],
        education: user.resumeData?.education || user.education || [],
        description: user.resumeData?.description || user.bio || ""
    })}

Jobs:
${JSON.stringify(cleanJobs)}

Instructions:
- Match based on skills + role relevance
- Return top 5 jobs
- Add matchScore (0-100)
- Add short reason

Return ONLY JSON:
{
  "recommendedJobs": [
    {
      "jobId": "id",
      "title": "Job title",
      "matchScore": 90,
      "reason": "Short reason"
    }
  ]
}
`;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();

        const cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();

        const jsonString = cleaned.substring(
            cleaned.indexOf("{"),
            cleaned.lastIndexOf("}") + 1
        );

        const parsed = JSON.parse(jsonString);

        res.status(200).json(parsed);
    } catch (err) {
        console.error("Gemini Error:", err);

        // 🔥 Fallback (VERY IMPORTANT)
        const fallback = jobs.map(job => {
            const matchCount = userSkills.filter(skill =>
                job.skillsRequired?.some(js => js.toLowerCase() === skill.toLowerCase())
            ).length;

            return {
                jobId: job._id,
                title: job.title,
                matchScore: job.skillsRequired.length
                    ? Math.round((matchCount / job.skillsRequired.length) * 100)
                    : 30,
                reason: "Based on skill matching"
            };
        });

        res.status(200).json({ recommendedJobs: fallback.slice(0, 5) });
    }
});