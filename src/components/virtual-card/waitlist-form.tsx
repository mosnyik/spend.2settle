"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    // setIsLoading(true);

    // Simple email validation
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    // try {
    //   // Simulated API call - replace with your actual endpoint
    //   await new Promise((resolve) => setTimeout(resolve, 500));
    //   setSubmitted(true);
    //   setEmail("");
    //   setTimeout(() => {
    //     setSubmitted(false);
    //   }, 3000);
    // } catch (err) {
    //   setError("Something went wrong. Please try again.");
    // } finally {
    //   setIsLoading(false);
    // }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          className="flex-1 px-4 py-3 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-sans disabled:opacity-50"
        />
        <Button
          type="submit"
          disabled={isLoading || !email}
          className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-sans"
        >
          {isLoading ? "Joining..." : "Join Now"}
        </Button>
      </div>

      {/* Status messages */}
      {submitted && (
        <div className="p-3 bg-green-100 border border-green-300 rounded-lg text-green-800 text-sm font-sans">
          ✓ Thanks for joining! Check your email for updates.
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-100 border border-red-300 rounded-lg text-red-800 text-sm font-sans">
          {error}
        </div>
      )}
    </form>
  );
}
