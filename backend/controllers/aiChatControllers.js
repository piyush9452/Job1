import { streamText, tool } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { z } from 'zod';
import Job from '../models/jobs.js'; 

const google = createGoogleGenerativeAI({ 
  apiKey: process.env.GEMINI_API_KEY 
});

export const handleChatBot = async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    console.error("CRITICAL ERROR: No messages received.");
    return res.status(400).json({ error: "Invalid request payload." });
  }

  try {
    const result = streamText({
      // FACT: Using the exact model you verified.
      model: google('gemini-2.5-flash'), 
      messages: messages, 
      system: `You are the official AI assistant for the JobOne portal. 
               Your job is to help candidates find jobs. 
               Always be professional, concise, and to the point. 
               If someone asks for jobs, ALWAYS use the searchJobs tool to check the live database. Do not invent jobs.
               CRITICAL INSTRUCTION: You MUST extract a specific search keyword (like "React") and pass it to the searchJobs tool. NEVER leave the keyword blank.`,
      tools: {
        searchJobs: tool({
          description: 'Search the live MongoDB database for active job postings.',
          parameters: z.object({
            keyword: z.string({
              required_error: "Keyword is strictly required to search the database",
            }).min(1).describe('The job title, skill, or industry (e.g., "React", "Software").'),
          }),
          execute: async ({ keyword }) => {
            const safeKeyword = keyword ? String(keyword) : "";
            console.log(`[AI TOOL EXECUTED] Searching DB for: ${safeKeyword}`);
            
            try {
              const jobs = await Job.find({
                status: "active",
                $or: [
                  { title: { $regex: safeKeyword, $options: 'i' } },
                  { skillsRequired: { $regex: safeKeyword, $options: 'i' } },
                  { industry: { $regex: safeKeyword, $options: 'i' } }
                ]
              })
              .select("title postedByCompany location salaryMin salaryMax mode")
              .limit(5)
              .lean(); 

              if (!jobs || jobs.length === 0) {
                return { message: "No active jobs found matching that keyword." };
              }

              return jobs; 
            } catch (err) {
              console.error("[DB ERROR]:", err);
              return { error: "Failed to fetch jobs from the database." };
            }
          },
        }),
      },
      maxSteps: 5, 
    });

    // FACT: This is the ONLY piping function that exists in AI SDK v5 to stream back to the UI.
    result.pipeUIMessageStreamToResponse(res);
    
  } catch (error) {
    console.error("Chatbot Error:", error);
    res.status(500).json({ error: "Failed to process chat" });
  }
};