'use client'

import UploadEngine from './UploadEngine'

const DOCUMENT_TYPES = [
  {
    key: 'articles_of_incorporation',
    label: 'Articles of Incorporation',
  },
  {
    key: 'ein_letter',
    label: 'EIN Letter',
  },
  {
    key: 'capability_statement',
    label: 'Capability Statement',
  },
  {
    key: 'insurance_certificate',
    label: 'Insurance Certificate',
  },
  {
    key: 'past_performance',
    label: 'Past Performance',
  },
]

export default function DocumentUploader() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Certification Documents</h1>

      {DOCUMENT_TYPES.map((doc) => (
        <div
          key={doc.key}
          className="rounded-xl border border-slate-700 bg-slate-900/60 p-6"
        >
          <h2 className="mb-4 text-xl font-semibold text-white">{doc.label}</h2>

          <UploadEngine
            documentType={doc.key}
            certification="MBE"
          />
        </div>
      ))}
    </div>
  )
}