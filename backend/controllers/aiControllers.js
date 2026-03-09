import { GoogleGenerativeAI } from "@google/generative-ai";
import expressAsyncHandler from "express-async-handler";

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
      "summary": "Write a compelling 4-5 sentence summary about this role with clearly mentioning the experience needed for this role...",
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