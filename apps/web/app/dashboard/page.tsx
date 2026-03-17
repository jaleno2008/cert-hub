export default function DashboardPage() {
  return (
    <div className="space-y-6 text-white">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="mt-2 text-slate-400">
          Welcome to Certification Hub. Track your uploads, progress, and readiness.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm text-slate-400">Documents Uploaded</p>
          <p className="mt-3 text-3xl font-bold">0</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm text-slate-400">Certification Progress</p>
          <p className="mt-3 text-3xl font-bold">0%</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm text-slate-400">Readiness Status</p>
          <p className="mt-3 text-3xl font-bold text-cyan-300">In Progress</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-xl font-semibold">Next Action</h2>
        <p className="mt-2 text-slate-400">
          Upload missing documents and complete your readiness assessment.
        </p>
      </div>
    </div>
  )
}