"use client";

import { useState } from "react";

export default function Home() {
  const [jobTitle, setJobTitle] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateQuestions = async () => {
    if (!jobTitle.trim()) {
      setError("Please enter a job title.");
      return;
    }

    setLoading(true);
    setError("");
    setQuestions([]);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobTitle }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setQuestions(data.questions);
    } catch (err: any) {
      setError(err.message || "Failed to generate questions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl">

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          AI Interview Question Generator
        </h1>

        <p className="text-gray-600 mb-6">
          Enter any job title and generate AI-powered interview questions.
        </p>

        {/* Input */}
        <div className="flex flex-col sm:flex-row gap-4 mb-3">
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g. Product Manager, DevOps Engineer"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
          />

          <button
            onClick={generateQuestions}
            disabled={loading}
            className="bg-black text-white px-6 py-3 rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>

        {/* Helper text */}
        <p className="text-xs text-gray-500 mb-6">
          Try roles like Product Manager, DevOps Engineer, or Sales Lead
        </p>

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Results */}
        {questions.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Interview Questions
            </h2>

            <ol className="list-decimal pl-5 space-y-3 text-gray-800">
              {questions.map((question, index) => (
                <li key={index}>{question}</li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </main>
  );
}