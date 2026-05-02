import React, { useState } from "react";
import axios from "axios";
import { X, Send, Loader2, FileText, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ApplyModal({ job, onClose, onSuccess }) {
  const [pitch, setPitch] = useState("");
  // Initialize state array to hold answers for each question
  const [answers, setAnswers] = useState(
    job.screeningQuestions?.map((q) => ({ question: q, answer: "" })) || [],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnswerChange = (index, value) => {
    const updated = [...answers];
    updated[index].answer = value;
    setAnswers(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all required questions are answered
    if (answers.some((a) => !a.answer.trim())) {
      setError("Please provide an answer for all screening questions.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const storedData = localStorage.getItem("userInfo");
      const token = storedData ? JSON.parse(storedData).token : null;

      if (!token)
        throw new Error("No authorization token found. Please log in.");

      await axios.post(
        "https://jobone-mrpy.onrender.com/applications",
        {
          jobId: job._id,
          message: pitch,
          screeningAnswers: answers,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      onSuccess(); // Close modal and show success toast
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Failed to submit application. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Apply for {job.title}
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              Complete the form below to submit your application.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
          {error && (
            <div className="bg-rose-50 text-rose-600 p-4 rounded-xl text-sm font-bold border border-rose-100 flex items-center gap-2">
              <X size={16} /> {error}
            </div>
          )}

          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <FileText size={16} className="text-indigo-500" />
              Cover Letter / Pitch (Optional)
            </label>
            <textarea
              rows={4}
              value={pitch}
              onChange={(e) => setPitch(e.target.value)}
              placeholder="Why are you a great fit for this role?"
              className="w-full p-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 text-sm resize-none"
            />
          </div>

          {job.screeningQuestions && job.screeningQuestions.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-purple-500" />
                Employer Screening Questions{" "}
                <span className="text-rose-500">*</span>
              </h3>
              <div className="space-y-5 bg-purple-50/50 p-5 rounded-2xl border border-purple-100">
                {job.screeningQuestions.map((question, index) => (
                  <div key={index} className="space-y-2">
                    <label className="text-sm font-semibold text-slate-800">
                      <span className="text-purple-600 mr-1">{index + 1}.</span>{" "}
                      {question}
                    </label>
                    <input
                      type="text"
                      value={answers[index].answer}
                      onChange={(e) =>
                        handleAnswerChange(index, e.target.value)
                      }
                      placeholder="Type your answer..."
                      className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-200 text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-100 bg-white shrink-0 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-3 font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-200"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Send size={18} />
            )}
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
