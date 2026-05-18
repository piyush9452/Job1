import { streamText, tool, convertToModelMessages } from 'ai';
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
    // FACT: MUST be awaited to parse the V5 UI format into the AI model format
    const modelMessages = await convertToModelMessages(messages);

    // FACT: MUST NOT be awaited so the stream remains open for Express to pipe
    const result = streamText({
      model: google('gemini-2.5-flash'), // You were right, this is the correct model
      messages: modelMessages,
      system: `You are the official AI assistant for the JobOne portal. 
               Your job is to help candidates find jobs. 
               Always be professional, concise, and to the point. 
               If someone asks for jobs, ALWAYS use the searchJobs tool to check the live database. Do not invent jobs.
               If the database returns no jobs, apologize and tell them we don't have roles for that right now.`,
      tools: {
        searchJobs: tool({
          description: 'Search the live MongoDB database for active job postings.',
          parameters: z.object({
            // FACT: .min(1) forces the AI to extract a real word (like "React") instead of sending an empty string
            keyword: z.string().min(1).describe('The job title, skill, or industry (e.g., "React", "Software").'),
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
      // FACT: Gives the AI permission to execute the database search AND write the final message
      maxSteps: 5, 
    });

    // FACT: The correct V5 piping function
    result.pipeUIMessageStreamToResponse(res);
    
  } catch (error) {
    console.error("Chatbot Error:", error);
    res.status(500).json({ error: "Failed to process chat" });
  }
};