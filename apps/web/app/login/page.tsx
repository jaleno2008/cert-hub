"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleContinue = () => {
    if (!email.trim()) {
      alert("Please enter your email address.");
      return;
    }

    localStorage.setItem("chubUserEmail", email.trim());

    // Clear any old session flags if needed
    // localStorage.removeItem("assessmentComplete");
    // localStorage.removeItem("assessmentAnswers");
    // localStorage.removeItem("applyAnswers");

    router.push("/assessment");
  };

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="relative overflow-hidden rounded-[32px] border border-yellow-500/20 bg-[#0b0b0f] p-8 shadow-2xl md:p-10">
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-br from-yellow-500/15 via-transparent to-transparent" />
          <div className="relative">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-yellow-400">
              Guided Entry
            </p>
            <h1 className="mt-4 max-w-2xl text-5xl font-bold leading-tight text-white md:text-6xl">
              Certification readiness, guided from the first click.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-300">
              Log in to move through the exact flow you approved: login,
              assessment, application, results, and documents.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { label: "5-question intake", value: "Stage first" },
                { label: "24-question apply", value: "Guided form" },
                { label: "Results to documents", value: "Connected flow" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-[24px] border border-zinc-800 bg-black/70 p-5"
                >
                  <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">
                    {item.label}
                  </p>
                  <p className="mt-3 text-xl font-semibold text-white">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-yellow-500/30 bg-zinc-950 p-8 shadow-2xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-yellow-400">
              Certification Hub
            </h2>
            <p className="mt-3 text-sm leading-7 text-zinc-300">
              Sign in to begin your guided certification readiness process.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-200">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-4 text-white outline-none transition focus:border-yellow-400"
              />
            </div>

            <button
              onClick={handleContinue}
              className="w-full rounded-xl bg-yellow-400 px-4 py-4 font-semibold text-black transition hover:bg-yellow-300"
            >
              Continue
            </button>
          </div>

          <div className="mt-6 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-yellow-300">
              Next up
            </p>
            <p className="mt-3 text-sm leading-7 text-yellow-100">
              You will first complete a short 5-question intake before moving to
              the full 24-question application.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
