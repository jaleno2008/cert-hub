'use client'

import { useState } from 'react'

type UploadResponse = {
  success?: boolean
  id?: string
  documentType?: string
  certification?: string
  fileName?: string
  url?: string
  pathname?: string
  contentType?: string
  size?: number
  uploadedAt?: string
  error?: string
}

type UploadEngineProps = {
  documentType: string
  certification?: string
}

export default function UploadEngine({
  documentType,
  certification = 'MBE',
}: UploadEngineProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<UploadResponse | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setSelectedFile(file)
    setResult(null)
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setResult({ error: 'Please choose a file first.' })
      return
    }

    try {
      setUploading(true)
      setResult(null)

      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('documentType', documentType)
      formData.append('certification', certification)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        setResult({ error: data.error || 'Upload failed.' })
        return
      }

      setResult(data)
      setSelectedFile(null)

      const input = document.getElementById(
        `file-upload-${documentType}`
      ) as HTMLInputElement | null

      if (input) input.value = ''
    } catch (error) {
      console.error(error)
      setResult({ error: 'Something went wrong during upload.' })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-6 shadow-xl">
      <h2 className="mb-2 text-2xl font-bold text-white">Upload Documents</h2>
      <p className="mb-4 text-sm text-slate-300">
        Upload PDF, DOCX, PNG, JPG, or WEBP files up to 10MB.
      </p>

      <div className="space-y-4">
        <input
          id={`file-upload-${documentType}`}
          type="file"
          onChange={handleFileChange}
          className="block w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-sm text-white file:mr-4 file:rounded-md file:border-0 file:bg-cyan-600 file:px-4 file:py-2 file:text-white hover:file:bg-cyan-500"
        />

        {selectedFile && (
          <div className="rounded-lg bg-slate-800 p-3 text-sm text-slate-200">
            <p><strong>Name:</strong> {selectedFile.name}</p>
            <p><strong>Type:</strong> {selectedFile.type || 'Unknown'}</p>
            <p><strong>Size:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={uploading || !selectedFile}
          className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 font-semibold text-white transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Upload File'}
        </button>

        {result?.error && (
          <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">
            {result.error}
          </div>
        )}

        {result?.success && (
          <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm text-emerald-200">
            <p className="mb-2 font-semibold">Upload successful</p>
            <p><strong>Document Type:</strong> {result.documentType}</p>
            <p><strong>File:</strong> {result.fileName}</p>
            <p><strong>Path:</strong> {result.pathname}</p>
            {result.url && (
              <p className="mt-2">
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-300 underline"
                >
                  Open uploaded file
                </a>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}