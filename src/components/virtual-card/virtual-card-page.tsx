import React from "react";
import CardFlip from "./card-flip";
import WaitlistForm from "./waitlist-form";

const VirtualCard = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-pink-100/30 flex flex-col items-center justify-center px-4 py-12">
      <div className="relative z-10 max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-4 font-sans text-balance">
            A New Way
            <br />
            <span className="text-slate-950 font-black">To Spend Money</span>
          </h1>
          <p className="text-lg text-slate-700 max-w-2xl mx-auto font-sans text-pretty mt-6">
            Get your virtual card now. Crypto to fiat, seamlessly. Experience
            the future of payments with 2settle.
          </p>
        </div>

        {/* Main content - Card and Form */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          {/* Card flip component */}
          <div className="flex justify-center">
            <CardFlip />
          </div>

          {/* Waitlist form */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-3 font-sans">
                Coming Soon...
              </h2>
              <p className="text-slate-600 font-sans text-lg">
                Join our waitlist to be among the first to experience the
                revolution in digital payments. We're building something
                amazing.
              </p>
            </div>
            <WaitlistForm />

            {/* Features list */}
            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-500 flex-shrink-0 mt-1" />
                <p className="text-slate-700 font-sans">
                  Instant virtual card generation
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-500 flex-shrink-0 mt-1" />
                <p className="text-slate-700 font-sans">
                  Convert crypto to fiat seamlessly
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-500 flex-shrink-0 mt-1" />
                <p className="text-slate-700 font-sans">
                  Receive payments in minutes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default VirtualCard;
