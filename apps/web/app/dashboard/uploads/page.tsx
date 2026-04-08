"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type UploadTarget = {
  id: string;
  name: string;
};

type UploadedDocument = {
  id: string;
  name: string;
  fileName: string;
  uploadedAt: string;
};

const STORAGE_KEY = "chub_uploaded_documents";

export default function UploadPage() {
  const router = useRouter();

  const [target, setTarget] = useState<UploadTarget | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("chub_upload_target");
    if (raw) {
      setTarget(JSON.parse(raw));
    }
  }, []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  }

  function handleUpload() {
    if (!file || !target) return;

    setUploading(true);

    const existingRaw = sessionStorage.getItem(STORAGE_KEY);
    const existing: UploadedDocument[] = existingRaw
      ? JSON.parse(existingRaw)
      : [];

    const updated = [
      ...existing.filter((doc) => doc.id !== target.id),
      {
        id: target.id,
        name: target.name,
        fileName: file.name,
        uploadedAt: new Date().toISOString(),
      },
    ];

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    setTimeout(() => {
      setUploading(false);
      router.push("/documents");
    }, 800);
  }

  if (!target) {
    return (
      <div className="p-10">
        <h1 className="text-2xl font-bold">No document selected</h1>
        <button
          onClick={() => router.push("/documents")}
          className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded"
        >
          Back to Documents
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="bg-white rounded-3xl p-10 shadow-lg max-w-xl w-full">
        <h1 className="text-3xl font-bold text-slate-900">
          Upload Document
        </h1>

        <p className="mt-2 text-slate-600">
          {target.name}
        </p>

        <div className="mt-6">
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => router.push("/documents")}
            className="border px-5 py-3 rounded-xl"
          >
            Cancel
          </button>

          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="bg-emerald-600 text-white px-6 py-3 rounded-xl disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </main>
  );
}