"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  type ApplyAnswers,
  type AssessmentAnswers,
  STORAGE_KEYS,
  getAssessmentLabel,
  getDocumentsChecklist,
  normalizeApplyAnswers,
  normalizeAssessmentAnswers,
} from "../../lib/chub-flow";

type UploadedFile = {
  id: string;
  name: string;
  size: number;
  uploadedAt: string;
};

export default function DocumentsPage() {
  const router = useRouter();
  const [assessmentAnswers, setAssessmentAnswers] =
    useState<AssessmentAnswers | null>(null);
  const [applyAnswers, setApplyAnswers] = useState<ApplyAnswers | null>(null);
  const [files, setFiles] = useState<UploadedFile[]>([]);

  useEffect(() => {
    const email = localStorage.getItem(STORAGE_KEYS.email);
    const assessmentRaw = localStorage.getItem(STORAGE_KEYS.assessment);
    const applyRaw = localStorage.getItem(STORAGE_KEYS.apply);

    if (!email) {
      router.push("/login");
      return;
    }

    if (!assessmentRaw) {
      router.push("/assessment");
      return;
    }

    if (!applyRaw) {
      router.push("/apply");
      return;
    }

    try {
      setAssessmentAnswers(normalizeAssessmentAnswers(JSON.parse(assessmentRaw)));
      setApplyAnswers(normalizeApplyAnswers(JSON.parse(applyRaw)));
    } catch {
      router.push("/results");
    }
  }, [router]);

  const checklist = useMemo(() => {
    if (!applyAnswers) return [];
    return getDocumentsChecklist(applyAnswers);
  }, [applyAnswers]);

  function handleFiles(selected: FileList | null) {
    if (!selected) return;

    const nextFiles: UploadedFile[] = Array.from(selected).map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      name: file.name,
      size: file.size,
      uploadedAt: new Date().toLocaleString(),
    }));

    setFiles((prev) => [...prev, ...nextFiles]);
  }

  function formatBytes(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  function removeFile(id: string) {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  }

  if (!assessmentAnswers || !applyAnswers) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-xl">Loading documents...</div>
      </main>
    );
  }

  const targetCertification = getAssessmentLabel(
    "targetCertification",
    assessmentAnswers.targetCertification
  );

  return (
    <main className="min-h-screen bg-black px-6 py-8 text-white">
      <div className="mx-auto max-w-[1750px] space-y-6">
        <section className="rounded-[32px] border border-zinc-800 bg-[#0b0b0f] p-8 shadow-2xl">
          <div className="grid gap-6 xl:grid-cols-[1.12fr_0.88fr]">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-yellow-300">
                Step 4 of 4
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">
                Document Vault
              </h1>
              <p className="mt-4 text-lg leading-8 text-zinc-300">
                This page helps the applicant gather the main documents needed
                for their target path: <span className="font-semibold text-white">{targetCertification}</span>.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Business", value: applyAnswers.legalBusinessName || "—" },
                  {
                    label: "Upload status",
                    value:
                      applyAnswers.readyToUpload === "yes"
                        ? "Ready"
                        : applyAnswers.readyToUpload === "almost"
                          ? "Almost"
                          : "Still building",
                  },
                  { label: "Target path", value: targetCertification || "—" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[24px] border border-zinc-800 bg-black p-4"
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                      {item.label}
                    </p>
                    <p className="mt-3 text-sm font-semibold leading-6 text-white">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-zinc-800 bg-black p-6">
              <h2 className="text-2xl font-bold text-yellow-400">
                Current Profile Snapshot
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 text-sm text-zinc-300">
                {[
                  ["Business", applyAnswers.legalBusinessName || "—"],
                  ["Owner", applyAnswers.ownerName || "—"],
                  [
                    "Industry / NAICS",
                    [applyAnswers.industry, applyAnswers.naicsCodes]
                      .filter(Boolean)
                      .join(" / ") || "—",
                  ],
                  ["Markets", applyAnswers.targetMarkets.join(", ") || "—"],
                ].map(([label, value]) => (
                  <div key={label as string}>
                    <p className="font-semibold text-white">{label}</p>
                    <p className="mt-1">{value as string}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-[28px] border border-dashed border-yellow-400/40 bg-yellow-400/5 p-8">
            <label
              htmlFor="file-upload"
              className="flex cursor-pointer flex-col items-center justify-center rounded-[24px] border border-zinc-800 bg-black px-6 py-10 text-center transition hover:bg-zinc-950"
            >
              <span className="text-lg font-semibold text-white">
                Click to select documents
              </span>
              <span className="mt-2 text-sm text-zinc-400">
                PDF, PNG, JPG, DOC, and DOCX supported for workflow testing
              </span>
              <span className="mt-4 rounded-xl bg-yellow-400 px-4 py-3 text-sm font-bold text-black">
                Choose Files
              </span>
            </label>

            <input
              id="file-upload"
              type="file"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/results"
              className="rounded-2xl border border-zinc-700 bg-zinc-950 px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:bg-zinc-900"
            >
              Back to Results
            </Link>

            <Link
              href="/dashboard"
              className="rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-bold text-black transition hover:bg-emerald-400"
            >
              Go to Dashboard
            </Link>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[32px] border border-zinc-800 bg-[#0b0b0f] p-8 shadow-xl">
            <h2 className="text-3xl font-bold text-yellow-400">
              Recommended Upload Checklist
            </h2>
            <p className="mt-3 text-sm leading-7 text-zinc-300">
              Start with the basics first, then move into the extra items based
              on your answers.
            </p>

            <div className="mt-6 grid gap-4">
              {checklist.map((group) => (
                <div
                  key={group.title}
                  className="rounded-[24px] border border-zinc-800 bg-black p-5"
                >
                  <h3 className="text-xl font-semibold text-white">
                    {group.title}
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm text-zinc-200"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-zinc-800 bg-[#0b0b0f] p-8 shadow-xl">
            <h2 className="text-3xl font-bold text-yellow-400">Uploaded Files</h2>

            {files.length === 0 ? (
              <div className="mt-4 rounded-[24px] border border-zinc-800 bg-black p-6">
                <p className="text-zinc-400">
                  No files uploaded yet. Add files above to start building your
                  document folder.
                </p>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex flex-col gap-4 rounded-[24px] border border-zinc-800 bg-black p-5 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <p className="font-semibold text-white">{file.name}</p>
                      <p className="mt-1 text-sm text-zinc-400">
                        {formatBytes(file.size)} • Uploaded {file.uploadedAt}
                      </p>
                    </div>

                    <button
                      onClick={() => removeFile(file.id)}
                      className="rounded-xl bg-red-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-400"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
