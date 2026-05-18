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
    // FACT: streamText MUST be awaited. Without await, 'result' is just a pending Promise, which causes the crash.
    const result = await streamText({
      model: google('gemini-2.5-flash'),
      messages: messages,
      system: `You are the official AI assistant for the JobOne portal. 
               Your job is to help candidates find jobs. 
               Always be professional, concise, and to the point. 
               If someone asks for jobs, ALWAYS use the searchJobs tool to check the live database. Do not invent jobs.
               If the database returns no jobs, apologize and tell them we don't have roles for that right now.`,
      tools: {
        searchJobs: tool({
          description: 'Search the live MongoDB database for active job postings.',
          parameters: z.object({
            keyword: z.string().describe('The job title, skill, or industry the user is looking for.'),
          }),
          execute: async ({ keyword }) => {
            console.log(`[AI TOOL EXECUTED] Searching DB for: ${keyword}`);
            
            const jobs = await Job.find({
              status: "active",
              $or: [
                { title: { $regex: keyword, $options: 'i' } },
                { skillsRequired: { $regex: keyword, $options: 'i' } },
                { industry: { $regex: keyword, $options: 'i' } }
              ]
            })
            .select("title postedByCompany location salaryMin salaryMax mode")
            .limit(5);

            return jobs; 
          },
        }),
      },
      maxSteps: 5, 
    });

    // FACT: Now that result is properly awaited, this function exists and will stream to the React frontend.
    result.pipeDataStreamToResponse(res);
    
  } catch (error) {
    console.error("Chatbot Error:", error);
    res.status(500).json({ error: "Failed to process chat" });
  }
};