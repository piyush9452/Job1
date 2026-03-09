import { GoogleGenerativeAI } from "@google/generative-ai";
import expressAsyncHandler from "express-async-handler";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParseRaw = require("pdf-parse");
const pdfParse = typeof pdfParseRaw === "function" ? pdfParseRaw : pdfParseRaw.default;
import mammoth from "mammoth";

export const generateJobDetails = expressAsyncHandler(async (req, res) => {
  const { title, jobType, mode } = req.body;

  if (!title) {
    res.status(400);
    throw new Error("Job title is required to generate a description.");
  }

  // Initialize Gemini API
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    You are an expert HR recruiter. Write a highly professional job description for a "${title}" position.
    Job Type: ${jobType || 'Full-time'}
    Work Mode: ${mode || 'On-site'}
    
    Return EXACTLY a JSON object with this format, and nothing else. Do not use markdown code blocks like \`\`\`json. Just the raw JSON.
    {
      "summary": "Write a compelling 4-5 sentence summary about this role with clearly mentioning the experience range needed for this role...",
      "responsibilities": "Write 6 to 7 bullet points of key responsibilities. Do not use markdown, just standard text with newlines (\\n) for bullets like:\\n- Task 1\\n- Task 2"
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Brutal cleanup: Strip any markdown formatting Gemini might accidentally include
    const cleanedText = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();
    
    const parsedData = JSON.parse(cleanedText);
    res.status(200).json(parsedData);
  } catch (error) {
    console.error("AI Generation Error:", error);
    res.status(500);
    throw new Error("Failed to generate content with AI. Check your API key or try again.");
  }
});


export const parseResume = expressAsyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No document uploaded.");
  }

  let rawText = "";
  const fileType = req.file.mimetype;

  try {
    // 1. Extract text based on file type
    if (fileType === "application/pdf") {
      const pdfData = await pdfParse(req.file.buffer);
      rawText = pdfData.text;
    } else if (
      fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || 
      fileType === "application/msword"
    ) {
      const docxData = await mammoth.extractRawText({ buffer: req.file.buffer });
      rawText = docxData.value;
    } else {
      res.status(400);
      throw new Error("Unsupported file format. Please upload a PDF or DOCX.");
    }
  } catch (err) {
    console.error("File Extraction Error:", err);
    res.status(500);
    throw new Error("Failed to read the document. Ensure it is not encrypted or password-protected.");
  }

  if (!rawText || rawText.trim().length === 0) {
    res.status(400);
    throw new Error("The document appears to be empty or consists only of images (scanned document).");
  }

  // 2. Feed to Gemini to structure it
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    You are an expert Applicant Tracking System (ATS). Extract the following information from the provided messy resume text.
    Return EXACTLY a raw JSON object and nothing else. Do NOT use markdown formatting (\`\`\`json). If information for a field is missing, return an empty array or empty string.

    Strict JSON Schema required:
    {
      "description": "Create a professional 2-3 sentence summary based on their profile.",
      "skills": ["Skill 1", "Skill 2", "Skill 3"],
      "experience": [
        { "role": "Job Title", "company": "Company Name", "duration": "YYYY - YYYY", "description": "Brief summary of duties" }
      ],
      "education": [
        { "degree": "Degree Name", "university": "Institution Name", "ended": "YYYY", "CGPA": "GPA/Percentage if found, else empty string" }
      ]
    }

    Resume Text to Parse:
    ${rawText.substring(0, 15000)} 
  `;

  try {
    const result = await model.generateContent(prompt);
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

    res.status(200).json(parsedData);
  } catch (error) {
    console.error("Gemini Parsing Error:", error);
    res.status(500);
    throw new Error("AI failed to process and structure the resume data.");
  }
});