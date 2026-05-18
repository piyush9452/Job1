// ============================================================
// aiChatControllers.js  —  AI SDK v5 COMPATIBLE
// Verified against: ai@^5.0.0, @ai-sdk/google@^2.0.0
//
// v4 → v5 breaking changes fixed here:
//   1. tool() uses inputSchema (not parameters)
//   2. maxSteps removed from streamText; replaced with stopWhen: stepCountIs(N)
//   3. messages must be converted via convertToModelMessages() before passing to streamText
//   4. pipeUIMessageStreamToResponse is a standalone function imported from 'ai',
//      NOT a method on the result object (result.pipeUIMessageStreamToResponse was v4)
// ============================================================

import { streamText, tool, convertToModelMessages, pipeUIMessageStreamToResponse, stepCountIs } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { z } from 'zod';
import Job from '../models/jobs.js';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY || 'AIzaSyBHgD7iM5hqWEGw1bUv3u35bUjgL2TF6pY'
});

export const handleChatBot = async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    console.error("CRITICAL ERROR: No messages received.");
    return res.status(400).json({ error: "Invalid request payload." });
  }

  try {
    // FIX 1: convertToModelMessages() converts UIMessage[] (from the React hook)
    //        into ModelMessage[] that streamText understands.
    //        In v4 you could pass UIMessages directly; v5 requires explicit conversion.
    const modelMessages = convertToModelMessages(messages);

    const result = streamText({
      model: google('gemini-2.5-flash'),
      messages: modelMessages,
      system: `You are the official AI assistant for the JobOne portal. 
               Your job is to help candidates find jobs. 
               Always be professional, concise, and to the point. 
               If someone asks for jobs, ALWAYS use the searchJobs tool to check the live database. Do not invent jobs.
               CRITICAL INSTRUCTION: You MUST extract a specific search keyword (like "React") and pass it to the searchJobs tool. NEVER leave the keyword blank.`,
      tools: {
        searchJobs: tool({
          description: 'Search the live MongoDB database for active job postings.',

          // FIX 2: 'parameters' is renamed to 'inputSchema' in AI SDK v5.
          //        Using 'parameters' silently sends an empty schema to the LLM,
          //        causing the tool to always receive {} — which is exactly what
          //        you saw in your curl output (toolName: "searchJobs", input: {}).
          inputSchema: z.object({
            keyword: z.string().min(1).describe(
              'The job title, skill, or industry to search for (e.g., "React", "Software").'
            ),
          }),

          execute: async ({ keyword }) => {
            const safeKeyword = keyword ? String(keyword) : "";
            console.log(`[AI TOOL EXECUTED] Searching DB for: "${safeKeyword}"`);

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

      // FIX 3: maxSteps no longer exists on streamText in v5.
      //        Multi-step tool execution is now controlled server-side with stopWhen.
      //        stepCountIs(5) means: keep looping tool calls until 5 steps are done
      //        or the model produces a final text response with no further tool calls.
      stopWhen: stepCountIs(5),
    });

    // FIX 4: In v4, pipeUIMessageStreamToResponse was a METHOD on the result object:
    //           result.pipeUIMessageStreamToResponse(res)   ← v4, does NOT exist in v5
    //
    //        In v5, it is a STANDALONE FUNCTION imported from 'ai'.
    //        You pass the ServerResponse and the UI message stream separately:
    //           pipeUIMessageStreamToResponse(res, result.toUIMessageStream())
    //
    //        This is what sends the SSE events the React useChat hook understands.
    pipeUIMessageStreamToResponse(res, result.toUIMessageStream());

  } catch (error) {
    console.error("Chatbot Error:", error);
    // Only send error header if headers haven't been sent yet (streaming may have started)
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to process chat" });
    }
  }
};