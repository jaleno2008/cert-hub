"use client";

import { useEffect, useMemo, useState } from "react";
import ChubStageBanner from "../../components/chub-stage-banner";

type Answers = Record<number, string>;

type MissingItem = {
  title: string;
  description: string;
  priority: number;
  href: string;
  buttonLabel: string;
};

function buildMissingItems(answers: Answers): MissingItem[] {
  const missing: MissingItem[] = [];

  const registered = answers[1];
  const ein = answers[2];
  const bank = answers[3];
  const ownership = answers[7];
  const control = answers[10];
  const operations = answers[11];
  const naics = answers[18];
  const capability = answers[19];
  const pastPerformance = answers[20];
  const insurance = answers[21];
  const website = answers[23];
  const profile = answers[24];

  if (registered !== "yes") {
    missing.push({
      title: "Register your business with the state",
      description:
        "This is the first foundational step. Most certifications and vendor registrations require your business to be officially registered before you move forward.",
      priority: 1,
      href: "/documents",
      buttonLabel: "Fix This First",
    });
  }

  if (ein !== "yes") {
    missing.push({
      title: "Get your EIN (Tax ID)",
      description:
        "Your EIN is required for taxes, contracts, vendor registrations, and most certification paths. It is the Social Security number for your business.",
      priority: 2,
      href: "/documents",
      buttonLabel: "View Next Step",
    });
  }

  if (bank !== "yes") {
    missing.push({
      title: "Open a business bank account",
      description:
        "A separate business bank account helps prove your company is operating professionally and keeps business and personal funds separated.",
      priority: 3,
      href: "/documents",
      buttonLabel: "Prepare for This",
    });
  }

  if (ownership !== "yes") {
    missing.push({
      title: "Strengthen ownership eligibility",
      description:
        "Many certifications require at least 51% ownership by the qualifying individual or group. If that is not true yet, this may be a future opportunity.",
      priority: 4,
      href: "/results",
      buttonLabel: "Review Results",
    });
  }

  if (control !== "yes" || operations !== "yes") {
    missing.push({
      title: "Show real control of the business",
      description:
        "It is not enough to be named on paper. Programs want to see that you make major decisions and manage daily operations.",
      priority: 5,
      href: "/results",
      buttonLabel: "See Why This Matters",
    });
  }

  if (capability !== "yes") {
    missing.push({
      title: "Create a capability statement",
      description:
        "This is your business resume. It helps agencies and buyers quickly understand what you do, what you’ve done, and why they should consider your company.",
      priority: 6,
      href: "/documents",
      buttonLabel: "Build This",
    });
  }

  if (pastPerformance !== "yes") {
    missing.push({
      title: "Build past performance",
      description:
        "Past performance shows proof that you have done similar work before. Start documenting commercial, subcontract, or relevant project experience.",
      priority: 7,
      href: "/uploads",
      buttonLabel: "See How to Start",
    });
  }

  if (insurance !== "yes") {
    missing.push({
      title: "Get business insurance",
      description:
        "Many contracts require insurance before award. Getting covered early removes a common barrier later.",
      priority: 8,
      href: "/documents",
      buttonLabel: "Prepare for This",
    });
  }

  if (naics !== "yes") {
    missing.push({
      title: "Identify your NAICS code",
      description:
        "NAICS codes are how the government classifies your business. You need the right code to target the right certifications and opportunities.",
      priority: 9,
      href: "/documents",
      buttonLabel: "Find Your Code",
    });
  }

  if (website !== "yes" || profile !== "yes") {
    missing.push({
      title: "Strengthen your business profile",
      description:
        "A website and a strong business profile help validate your company and make you look more credible to agencies and primes.",
      priority: 10,
      href: "/uploads",
      buttonLabel: "Improve This",
    });
  }

  return missing.sort((a, b) => a.priority - b.priority);
}

export default function ReadinessPage() {
  const [answers, setAnswers] = useState<Answers>({});

  useEffect(() => {
    const storedAnswers = localStorage.getItem("chub_answers");
    if (storedAnswers) {
      setAnswers(JSON.parse(storedAnswers));
    }
  }, []);

  const missingItems = useMemo(() => buildMissingItems(answers), [answers]);
  const topThree = missingItems.slice(0, 3);
  const nextThree = missingItems.slice(3, 6);

  return (
    <div className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl space-y-10">
        <div className="rounded-3xl border border-yellow-500/30 bg-slate-950/80 p-8 shadow-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-400">
            Readiness Plan
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
            Your next best steps
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
            This page is not another assessment. It is your action plan based on
            the answers you already gave CHub.
          </p>
        </div>

        <ChubStageBanner
          stage="bid-ready"
          title="CHUB Stage: Bid-Ready"
          detail="This is the action stage. CHUB uses what you already answered to show whether you are ready to apply, ready to talk to buyers, or still need to tighten a few important pieces first."
        />

        <section className="space-y-4">
          <h2 className="text-3xl font-semibold tracking-tight text-yellow-400">
            Start with these first
          </h2>

          {topThree.length > 0 ? (
            <div className="space-y-4">
              {topThree.map((item, index) => (
                <div
                  key={`${item.title}-${index}`}
                  className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-6 shadow-xl"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-2xl font-semibold tracking-tight text-white">
                      {item.title}
                    </h3>
                    <span className="rounded-full bg-yellow-500/15 px-3 py-1 text-sm font-semibold text-yellow-400">
                      Priority {item.priority}
                    </span>
                  </div>

                  <p className="text-base leading-7 text-slate-400">
                    {item.description}
                  </p>

                  <a
                    href={item.href}
                    className="inline-block rounded-2xl bg-yellow-500 px-5 py-3 text-base font-semibold text-black transition hover:bg-yellow-400"
                  >
                    {item.buttonLabel}
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 text-slate-400">
              You do not have any major readiness gaps showing right now.
            </div>
          )}
        </section>

        <section className="space-y-4">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-300">
            Then work on these
          </h2>

          {nextThree.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {nextThree.map((item, index) => (
                <div
                  key={`${item.title}-next-${index}`}
                  className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6"
                >
                  <h3 className="text-xl font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-base leading-7 text-slate-400">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 text-slate-400">
              Nothing major is waiting in this layer right now.
            </div>
          )}
        </section>

        <div className="flex flex-wrap gap-3">
          <a
            href="/results"
            className="rounded-2xl border border-slate-700 px-5 py-3 text-base font-semibold text-white transition hover:border-yellow-400 hover:text-yellow-400"
          >
            Back to Results
          </a>

          <a
            href="/dashboard"
            className="rounded-2xl bg-yellow-500 px-5 py-3 text-base font-semibold text-black transition hover:bg-yellow-400"
          >
            Continue to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
