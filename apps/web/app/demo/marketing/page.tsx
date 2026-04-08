"use client";

import { type ReactNode, useEffect, useMemo, useState } from "react";

type DemoScene = {
  title: string;
  eyebrow: string;
  narration: string;
  cursor: { x: number; y: number };
  cta: string;
  screen:
    | "login"
    | "assessment"
    | "apply"
    | "results"
    | "federal"
    | "sam"
    | "sba"
    | "local"
    | "capability"
    | "finish";
};

const scenes: DemoScene[] = [
  {
    eyebrow: "Private CHUB Preview",
    title: "Start with one clean entry point",
    narration:
      "A business owner starts with a simple email login, not a pile of disconnected government portals.",
    cursor: { x: 30, y: 75 },
    cta: "Continue",
    screen: "login",
  },
  {
    eyebrow: "Clarify",
    title: "Five questions before the long form",
    narration:
      "CHUB slows the user down just enough to understand the business, certification goal, and likely starting point.",
    cursor: { x: 70, y: 76 },
    cta: "See my starting path",
    screen: "assessment",
  },
  {
    eyebrow: "Clarify",
    title: "The 24-question apply flow builds the profile",
    narration:
      "The same answers become reusable business profile data for federal, state, county, and city paths.",
    cursor: { x: 76, y: 72 },
    cta: "Save and continue",
    screen: "apply",
  },
  {
    eyebrow: "Unblock",
    title: "Results explain what to do next",
    narration:
      "Instead of dumping programs on the user, CHUB recommends the next practical path and explains why.",
    cursor: { x: 72, y: 38 },
    cta: "Start Federal Premium Prep",
    screen: "results",
  },
  {
    eyebrow: "Federal Premium",
    title: "SAM.gov and UEI come before SBA 8(a)",
    narration:
      "The federal branch starts where people get confused first: UEI, SAM.gov status, and registration basics.",
    cursor: { x: 63, y: 73 },
    cta: "Start SAM.gov / UEI Mirror",
    screen: "federal",
  },
  {
    eyebrow: "Federal Registration",
    title: "Mirror the confusing SAM.gov setup",
    narration:
      "CHUB explains EIN, UEI, SAM.gov, CAGE, and what to choose when the user is not sure.",
    cursor: { x: 74, y: 70 },
    cta: "Continue to SBA 8(a)",
    screen: "sam",
  },
  {
    eyebrow: "SBA 8(a)",
    title: "Walk through SBA areas in plain English",
    narration:
      "Eligibility, ownership, control, owner eligibility, financials, documents, review, and completion become guided steps.",
    cursor: { x: 58, y: 77 },
    cta: "Answer step-by-step",
    screen: "sba",
  },
  {
    eyebrow: "Local Agency Mirrors",
    title: "Bring Miami-Dade and City of Miami into the same roadmap",
    narration:
      "Vendor registration, SBE, DBE, and local procurement paths are shown as guided mirrors, not random outside links.",
    cursor: { x: 74, y: 54 },
    cta: "Open Miami-Dade Mirror",
    screen: "local",
  },
  {
    eyebrow: "Highlight",
    title: "Turn answers into a capability statement",
    narration:
      "CHUB creates a polished, buyer-ready one-page statement with branded colors the business can use in real outreach.",
    cursor: { x: 70, y: 40 },
    cta: "Polish My Statement",
    screen: "capability",
  },
  {
    eyebrow: "Bid-Ready",
    title: "Certify once, reuse everywhere",
    narration:
      "The bigger vision is one profile, one document vault, and guided certification mirrors across federal, state, county, and city agencies.",
    cursor: { x: 52, y: 72 },
    cta: "Ready for tester feedback",
    screen: "finish",
  },
];

function getSceneDuration(totalSeconds: number) {
  return Math.floor((totalSeconds * 1000) / scenes.length);
}

export default function MarketingDemoPage() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [fullLength, setFullLength] = useState(true);
  const [sceneProgress, setSceneProgress] = useState(0);

  const totalSeconds = fullLength ? 600 : 120;
  const sceneDuration = useMemo(() => getSceneDuration(totalSeconds), [totalSeconds]);
  const scene = scenes[sceneIndex];
  const totalProgress = ((sceneIndex + sceneProgress) / scenes.length) * 100;

  useEffect(() => {
    if (!playing) return;

    const startedAt = Date.now();
    const timer = window.setInterval(() => {
      const progress = Math.min((Date.now() - startedAt) / sceneDuration, 1);
      setSceneProgress(progress);

      if (progress >= 1) {
        setSceneIndex((current) => (current + 1) % scenes.length);
        setSceneProgress(0);
      }
    }, 120);

    return () => window.clearInterval(timer);
  }, [playing, sceneDuration, sceneIndex]);

  function restart() {
    setSceneIndex(0);
    setSceneProgress(0);
    setPlaying(true);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#eef4f8] text-slate-950">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-5">
        <header className="mb-4 flex flex-col gap-4 rounded-[30px] border border-slate-200 bg-white/90 p-4 shadow-[0_18px_70px_rgba(15,23,42,0.13)] backdrop-blur lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.32em] text-cyan-700">
              CHUB Demo Studio
            </p>
            <h1 className="mt-1 text-2xl font-black tracking-tight md:text-4xl">
              Supademo-style walkthrough for your marketing video
            </h1>
            <p className="mt-2 max-w-4xl text-sm leading-7 text-slate-600">
              Clean click-through scenes, a moving cursor, hotspots, progress,
              and a floating guide card. Record this page for the marketing demo.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setPlaying((current) => !current)}
              className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white shadow-lg"
            >
              {playing ? "Pause" : "Play"}
            </button>
            <button
              onClick={restart}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-900 shadow-sm"
            >
              Restart
            </button>
            <button
              onClick={() => {
                setFullLength((current) => !current);
                restart();
              }}
              className="rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm font-bold text-cyan-900 shadow-sm"
            >
              {fullLength ? "10 min mode" : "2 min preview"}
            </button>
          </div>
        </header>

        <section className="relative flex-1 rounded-[38px] border border-slate-200 bg-white p-4 shadow-[0_30px_110px_rgba(15,23,42,0.18)]">
          <div className="relative h-full min-h-[720px] overflow-hidden rounded-[30px] border border-slate-200 bg-slate-100">
            <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-5 py-3">
              <div className="flex gap-2">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-yellow-300" />
                <span className="h-3 w-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-center text-xs font-bold text-slate-500">
                qa.certificationhub.online/demo/marketing
              </div>
              <div className="rounded-full bg-cyan-100 px-3 py-2 text-xs font-black text-cyan-900">
                Auto demo
              </div>
            </div>

            <div className="relative min-h-[660px] bg-[radial-gradient(circle_at_18%_10%,rgba(14,165,233,0.22),transparent_28%),linear-gradient(135deg,#f8fafc,#e8f3f6)] p-6">
              <div className="absolute left-6 top-6 z-10 rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-slate-600 shadow-lg">
                Step {sceneIndex + 1} / {scenes.length}: {scene.eyebrow}
              </div>

              <DemoScreen scene={scene} />

              <div
                className="pointer-events-none absolute z-30 transition-all duration-700 ease-out"
                style={{
                  left: `${scene.cursor.x}%`,
                  top: `${scene.cursor.y}%`,
                  transform: "translate(-10px, -10px)",
                }}
              >
                <div className="relative">
                  <div className="absolute left-5 top-5 h-12 w-12 animate-ping rounded-full bg-cyan-400/35" />
                  <div className="absolute left-4 top-4 h-5 w-5 rounded-full bg-cyan-400/40" />
                  <div className="h-0 w-0 border-l-[22px] border-r-[8px] border-t-[34px] border-l-slate-950 border-r-transparent border-t-transparent drop-shadow-[0_5px_10px_rgba(15,23,42,0.5)]" />
                </div>
              </div>

              <div
                className="absolute z-20 w-[min(420px,calc(100%-48px))] rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_24px_80px_rgba(15,23,42,0.22)] transition-all duration-700"
                style={{
                  left: scene.cursor.x > 58 ? "32px" : "auto",
                  right: scene.cursor.x > 58 ? "auto" : "32px",
                  bottom: "32px",
                }}
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-xs font-black uppercase tracking-[0.26em] text-cyan-700">
                    {scene.eyebrow}
                  </p>
                  <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-black text-white">
                    {Math.round(totalProgress)}%
                  </span>
                </div>
                <h2 className="text-2xl font-black tracking-tight">{scene.title}</h2>
                <p className="mt-3 text-base leading-7 text-slate-600">{scene.narration}</p>
                <div className="mt-4 flex items-center justify-between rounded-2xl bg-cyan-50 p-3">
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-cyan-800">
                    Action
                  </span>
                  <span className="font-black text-cyan-950">{scene.cta}</span>
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 border-t border-slate-200 bg-white/95 p-4 backdrop-blur">
              <div className="mb-3 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-cyan-500 transition-all duration-200"
                  style={{ width: `${totalProgress}%` }}
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {scenes.map((item, index) => (
                  <button
                    key={item.title}
                    onClick={() => {
                      setSceneIndex(index);
                      setSceneProgress(0);
                    }}
                    className={`shrink-0 rounded-full border px-4 py-2 text-xs font-black transition ${
                      index === sceneIndex
                        ? "border-cyan-400 bg-cyan-100 text-cyan-950"
                        : "border-slate-200 bg-white text-slate-500"
                    }`}
                  >
                    {index + 1}. {item.eyebrow}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function DemoScreen({ scene }: { scene: DemoScene }) {
  if (scene.screen === "login") return <LoginMock />;
  if (scene.screen === "assessment") return <AssessmentMock />;
  if (scene.screen === "apply") return <ApplyMock />;
  if (scene.screen === "results") return <ResultsMock />;
  if (scene.screen === "federal") return <FederalMock />;
  if (scene.screen === "sam") return <SamMock />;
  if (scene.screen === "sba") return <SbaMock />;
  if (scene.screen === "local") return <LocalMock />;
  if (scene.screen === "capability") return <CapabilityMock />;
  return <FinishMock />;
}

function Shell({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return (
    <div className="mx-auto mt-12 max-w-5xl rounded-[34px] border border-slate-200 bg-slate-950 p-8 text-white shadow-[0_30px_90px_rgba(15,23,42,0.28)]">
      <p className="text-xs font-black uppercase tracking-[0.35em] text-cyan-200">{eyebrow}</p>
      <h3 className="mt-3 max-w-4xl text-4xl font-black tracking-tight md:text-6xl">
        {title}
      </h3>
      <div className="mt-8">{children}</div>
    </div>
  );
}

function LoginMock() {
  return (
    <Shell eyebrow="Guided Entry" title="Certification readiness, guided from the first click.">
      <div className="grid gap-5 md:grid-cols-3">
        {["5-question intake", "24-question apply", "Results to documents"].map((item) => (
          <div key={item} className="rounded-3xl border border-white/10 bg-slate-950 p-5">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">{item}</p>
            <p className="mt-3 text-xl font-black">Connected flow</p>
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-3xl border border-amber-300/20 bg-amber-300/10 p-6">
        <p className="text-xl font-black text-amber-300">Certification Hub</p>
        <div className="mt-4 max-w-lg rounded-2xl border border-slate-700 bg-black px-4 py-4 text-slate-400">
          Email address
        </div>
      </div>
    </Shell>
  );
}

function AssessmentMock() {
  return (
    <Shell eyebrow="Clarify" title="First, CHUB finds the right starting lane.">
      <div className="grid gap-4 md:grid-cols-2">
        {["What certification are you exploring?", "How old is the business?", "Who are you trying to sell to?", "Do you already have key documents?"].map((item) => (
          <div key={item} className="rounded-3xl border border-cyan-300/15 bg-slate-950 p-5">
            <p className="font-bold">{item}</p>
            <div className="mt-4 flex gap-2">
              <span className="rounded-full bg-cyan-300 px-4 py-2 text-sm font-black text-black">Yes</span>
              <span className="rounded-full border border-slate-700 px-4 py-2 text-sm font-black">Not sure</span>
            </div>
          </div>
        ))}
      </div>
    </Shell>
  );
}

function ApplyMock() {
  return (
    <Shell eyebrow="Profile Builder" title="The 24-question apply flow becomes reusable data.">
      <div className="grid gap-5 md:grid-cols-2">
        {["Business identity", "Ownership", "Industry and NAICS", "Revenue and employees", "Target buyers", "Documents"].map((item) => (
          <div key={item} className="rounded-3xl border border-white/10 bg-slate-950 p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-amber-200">Saved answer</p>
            <p className="mt-2 text-2xl font-black">{item}</p>
          </div>
        ))}
      </div>
    </Shell>
  );
}

function ResultsMock() {
  return (
    <Shell eyebrow="Recommended Next Step" title="CHUB turns answers into a clear path.">
      <div className="grid gap-5 lg:grid-cols-2">
        <ResultCard title="Federal Premium Prep" detail="Recommended because the user selected federal/SBA signals." />
        <ResultCard title="Local Agency Mirrors" detail="Miami-Dade, City of Miami, SBE, DBE, and vendor registration." />
        <ResultCard title="One-Page Capability Statement" detail="Create a buyer-ready marketing document from the same profile." />
        <ResultCard title="Document Readiness" detail="Reuse the same files across multiple agencies." />
      </div>
    </Shell>
  );
}

function ResultCard({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-3xl border border-amber-300/20 bg-black p-5">
      <p className="text-2xl font-black text-amber-300">{title}</p>
      <p className="mt-3 text-slate-300">{detail}</p>
    </div>
  );
}

function FederalMock() {
  return (
    <Shell eyebrow="Federal Premium" title="Start with federal registration basics first.">
      <div className="rounded-3xl border border-cyan-300/15 bg-cyan-300/10 p-6">
        <p className="text-2xl font-black">SAM.gov / UEI Mirror</p>
        <p className="mt-3 text-slate-200">The user gets plain-English guidance before moving into SBA 8(a).</p>
      </div>
    </Shell>
  );
}

function SamMock() {
  return (
    <Shell eyebrow="SAM.gov / UEI" title="Explain the confusing federal identity step.">
      <div className="grid gap-4 md:grid-cols-2">
        {["EIN", "UEI", "SAM.gov status", "CAGE code"].map((item) => (
          <div key={item} className="rounded-3xl border border-white/10 bg-slate-950 p-5">
            <p className="text-3xl font-black text-cyan-200">{item}</p>
            <p className="mt-3 text-slate-300">Definition, example, and Not sure guidance.</p>
          </div>
        ))}
      </div>
    </Shell>
  );
}

function SbaMock() {
  return (
    <Shell eyebrow="SBA 8(a)" title="Mirror the application without sounding like government paperwork.">
      <div className="grid gap-3 md:grid-cols-3">
        {["Eligibility", "Ownership", "Control", "Owner Eligibility", "Financials", "Documents", "Review"].map((item) => (
          <div key={item} className="rounded-2xl border border-white/10 bg-slate-950 p-4 text-center font-black">
            {item}
          </div>
        ))}
      </div>
    </Shell>
  );
}

function LocalMock() {
  return (
    <Shell eyebrow="South Florida Local" title="Miami-Dade and City of Miami paths live beside federal.">
      <div className="grid gap-5 md:grid-cols-2">
        <ResultCard title="Miami-Dade Vendor" detail="Guided vendor registration mirror." />
        <ResultCard title="City of Miami Vendor" detail="Supplier registration and procurement readiness." />
        <ResultCard title="Miami-Dade SBE" detail="Category-based local small business path." />
        <ResultCard title="Florida UCP / DBE" detail="DBE handoff with document reuse." />
      </div>
    </Shell>
  );
}

function CapabilityMock() {
  return (
    <Shell eyebrow="Capability Statement" title="A polished one-page marketing asset, not a plain text export.">
      <div className="rounded-[32px] bg-white p-8 text-slate-950">
        <div className="h-3 rounded-full bg-[#143642]" />
        <div className="mt-6 grid gap-6 md:grid-cols-[1fr_250px]">
          <div>
            <h4 className="text-4xl font-black">ABC Florida</h4>
            <p className="mt-3 text-slate-600">Professional transportation and logistics support for public-sector and local-agency buyers.</p>
          </div>
          <div className="rounded-2xl border bg-slate-50 p-4 text-sm">
            Owner, phone, email, website, address
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {["Core Competencies", "Differentiators", "Past Performance"].map((item) => (
            <div key={item} className="rounded-2xl border bg-slate-50 p-4">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#e26d5c]">{item}</p>
              <p className="mt-3 text-sm text-slate-600">Polished buyer-ready bullets.</p>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}

function FinishMock() {
  return (
    <Shell eyebrow="The Platform Vision" title="One business profile. One document vault. Many certification paths.">
      <div className="grid gap-5 md:grid-cols-4">
        {["Federal", "State", "County", "Municipal"].map((item) => (
          <div key={item} className="rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-6 text-center">
            <p className="text-2xl font-black">{item}</p>
          </div>
        ))}
      </div>
    </Shell>
  );
}
