import { streamText, tool } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { z } from 'zod';
import Job from '../models/jobs.js'; // Ensure this path is correct

// Initialize the Google provider with your existing key
const google = createGoogleGenerativeAI({ 
  apiKey: process.env.GEMINI_API_KEY 
});

export const handleChatBot = async (req, res) => {
  const { messages } = req.body;

  // FACT: If express.json() is missing from server.js, req.body is empty and this prevents a silent crash.
  if (!messages || !Array.isArray(messages)) {
    console.error("CRITICAL ERROR: No messages received. Is express.json() enabled in server.js?");
    return res.status(400).json({ error: "Invalid request payload. Missing messages array." });
  }

  try {
    const result = await streamText({
      model: google('gemini-2.5-flash'),
      messages,
      system: `You are the official AI assistant for the JobOne portal. 
               Your job is to help candidates find jobs. 
               Always be professional, concise, and to the point. 
               If someone asks for jobs, ALWAYS use the searchJobs tool to check the live database. Do not invent jobs.
               If the database returns no jobs, apologize and tell them we don't have roles for that right now.`,
      
      // FACT: This is where we lock down security. The AI can ONLY use this specific function.
      tools: {
        searchJobs: tool({
          description: 'Search the live MongoDB database for active job postings.',
          parameters: z.object({
            keyword: z.string().describe('The job title, skill, or industry the user is looking for.'),
          }),
          execute: async ({ keyword }) => {
            console.log(`[AI TOOL EXECUTED] Searching DB for: ${keyword}`);
            
            // Strictly read-only query limited to 5 results to prevent token bloat
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

            // The SDK automatically feeds this array back to the AI
            return jobs; 
          },
        }),
      },
      maxSteps: 5, // Allows the AI to call the tool, get the data, and reply in one continuous flow
    });

    // Stream the final English text chunk-by-chunk directly to the React frontend
    result.pipeDataStreamToResponse(res);
    
  } catch (error) {
    console.error("Chatbot Error:", error);
    res.status(500).json({ error: "Failed to process chat" });
  }
};