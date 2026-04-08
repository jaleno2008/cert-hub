"use client";

import { useEffect, useMemo, useState } from "react";

type DocumentStatus = "missing" | "uploaded" | "reviewing" | "approved";

type RequiredDocument = {
  id: string;
  name: string;
  description: string;
  required: boolean;
  acceptedFileTypes: string[];
  maxFiles: number;
  status: DocumentStatus;
};

type Props = {
  initialDocuments: RequiredDocument[];
};

export default function DocumentUploadClient({ initialDocuments }: Props) {
  const [documents, setDocuments] = useState<RequiredDocument[]>(initialDocuments);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, string>>({});
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("certhub_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const requiredCount = useMemo(
    () => documents.filter((doc) => doc.required).length,
    [documents]
  );

  const uploadedCount = useMemo(
    () =>
      documents.filter(
        (doc) =>
          doc.status === "uploaded" ||
          doc.status === "reviewing" ||
          doc.status === "approved"
      ).length,
    [documents]
  );

  async function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
    documentId: string
  ) {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setUploadingId(documentId);
    setMessages((prev) => ({ ...prev, [documentId]: "" }));

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("documentId", documentId);
      formData.append("email", user.email);
      formData.append("name", user.name);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Upload failed");
      }

      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === documentId ? { ...doc, status: "uploaded" } : doc
        )
      );

      setMessages((prev) => ({
        ...prev,
        [documentId]: `Uploaded: ${file.name}`,
      }));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Upload failed";

      setMessages((prev) => ({
        ...prev,
        [documentId]: message,
      }));
    } finally {
      setUploadingId(null);
      event.target.value = "";
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">
            Certification Hub
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
            Documents Upload
          </h1>

          <p className="mt-3 max-w-3xl text-base text-slate-600">
            Upload your business documents one at a time.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Total Documents</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {documents.length}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Required Documents</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {requiredCount}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Progress</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {uploadedCount}/{documents.length}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-5">
          {documents.map((doc) => (
            <section
              key={doc.id}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-3xl">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-semibold text-slate-900">
                      {doc.name}
                    </h2>

                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        doc.status === "approved"
                          ? "border border-green-200 bg-green-100 text-green-800"
                          : doc.status === "uploaded"
                          ? "border border-blue-200 bg-blue-100 text-blue-800"
                          : doc.status === "reviewing"
                          ? "border border-yellow-200 bg-yellow-100 text-yellow-800"
                          : "border border-red-200 bg-red-100 text-red-800"
                      }`}
                    >
                      {doc.status}
                    </span>

                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        doc.required
                          ? "bg-slate-900 text-white"
                          : "border border-slate-200 bg-slate-100 text-slate-700"
                      }`}
                    >
                      {doc.required ? "Required" : "Optional"}
                    </span>
                  </div>

                  <p className="mt-3 text-slate-600">{doc.description}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {doc.acceptedFileTypes.map((type) => (
                      <span
                        key={type}
                        className="rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700"
                      >
                        {type}
                      </span>
                    ))}
                  </div>

                  {messages[doc.id] && (
                    <p className="mt-4 text-sm text-slate-600">{messages[doc.id]}</p>
                  )}
                </div>

                <div className="min-w-[260px] rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Max Files</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">
                    {doc.maxFiles}
                  </p>

                  <label className="mt-4 block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">
                      Select file
                    </span>
                    <input
                      type="file"
                      onChange={(event) => handleFileChange(event, doc.id)}
                      disabled={uploadingId === doc.id || !user}
                      className="block w-full rounded-lg border border-slate-300 bg-white p-2 text-sm text-slate-700"
                    />
                  </label>

                  <div className="mt-3 text-sm text-slate-500">
                    {uploadingId === doc.id ? "Uploading..." : "Ready to upload"}
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}