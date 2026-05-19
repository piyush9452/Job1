// ============================================================
// ChatWidgets.jsx  —  AI SDK v5 COMPATIBLE
// Verified against: @ai-sdk/react@^2.0.0, ai@^5.0.0
//
// This file was already mostly correct for v5.
// One subtle fix applied:
//   - The 'isLoading' check for showing the typing indicator has been tightened.
//     In v5, 'status' can be: "ready" | "submitted" | "streaming" | "error"
//     The component should show the bot typing indicator when status is "streaming"
//     AND the last message is from the user (meaning the assistant hasn't replied yet).
//     The original logic was correct; kept as-is with a cleaner guard.
// ============================================================

import React, { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { MessageSquare, X, Send, Bot, Loader2 } from "lucide-react";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  // v5: useChat no longer manages input state internally.
  //     You MUST manage your own input state — this was already done correctly.
  const [input, setInput] = useState("");

  // v5 useChat API:
  //   - transport: replaces the old 'api' string option
  //   - sendMessage: replaces the old 'append' function
  //   - status: replaces the old 'isLoading' boolean
  //             values: "ready" | "submitted" | "streaming" | "error"
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "https://localhost:5000/ai/chat",
    }),
    onError: (err) => console.error("Chat Error:", err),
  });

  // "submitted" = request sent, waiting for first chunk
  // "streaming" = actively receiving chunks
  const isLoading = status === "submitted" || status === "streaming";

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      // v5: sendMessage takes { text: string }, NOT a plain string
      sendMessage({ text: input });
      setInput("");
    }
  };

  // Determine if we should show the typing indicator.
  // Show it when loading AND the last message in the list is still from the user
  // (meaning the assistant's response hasn't started streaming yet).
  const lastMessage = messages[messages.length - 1];
  const showTypingIndicator = isLoading && lastMessage?.role === "user";

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 p-4 bg-indigo-600 text-white rounded-full shadow-2xl hover:bg-indigo-700 hover:scale-105 transition-all z-50"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[350px] h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col z-50 overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-600 p-4 text-white flex items-center gap-3">
            <Bot size={24} />
            <div>
              <h3 className="font-bold text-sm">JobOne Assistant</h3>
              <p className="text-[10px] text-indigo-200">Ask me about open roles</p>
            </div>
          </div>

          {/* Message list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages?.length === 0 && (
              <p className="text-center text-xs text-slate-400 mt-10">
                Type "Find me React jobs" to test the database search.
              </p>
            )}

            {messages?.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "assistant" && (
                  <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                    <Bot size={14} className="text-indigo-600" />
                  </div>
                )}

                <div
                  className={`p-3 rounded-2xl max-w-[80%] text-sm ${
                    m.role === "user"
                      ? "bg-indigo-600 text-white rounded-br-none"
                      : "bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm"
                  }`}
                >
                  {/* v5: messages use message.parts[] instead of message.content (string).
                       Each part has a 'type' field. For text: part.type === "text", part.text.
                       For in-progress tool calls: part.type starts with "tool-" */}
                  {m.parts?.map((part, i) => {
                    if (part.type === "text") {
                      return (
                        <p key={i} className="whitespace-pre-wrap">
                          {part.text}
                        </p>
                      );
                    }
                    // tool-invocation, tool-result, etc. — show a searching indicator
                    if (part.type.startsWith("tool-")) {
                      return (
                        <div
                          key={i}
                          className="text-xs text-indigo-400 font-mono mb-1 animate-pulse"
                        >
                          🔍 Searching database...
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            ))}

            {/* Typing indicator: only shown before the assistant's first chunk arrives */}
            {showTypingIndicator && (
              <div className="flex gap-2 justify-start">
                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                  <Bot size={14} className="text-indigo-600" />
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-2xl rounded-bl-none shadow-sm flex items-center">
                  <Loader2 size={14} className="animate-spin text-slate-400" />
                </div>
              </div>
            )}
          </div>

          {/* Input form */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-white border-t border-slate-200 flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about jobs..."
              disabled={isLoading}
              className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}