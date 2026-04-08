"use client";

import { useState } from "react";

export default function CertificationExplainer() {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-yellow-500/40 rounded-xl bg-black/40 p-5 mt-6">
      <div
        onClick={() => setOpen(!open)}
        className="cursor-pointer flex justify-between items-center"
      >
        <h2 className="text-yellow-400 text-lg font-semibold">
          What These Questions Mean (Click to Expand)
        </h2>
        <span className="text-yellow-400 text-xl">
          {open ? "−" : "+"}
        </span>
      </div>

      {open && (
        <div className="mt-4 space-y-4 text-gray-300 text-sm">

          <div>
            <strong className="text-white">Business Structure:</strong>
            <p>
              Defines how your business is legally organized. Certifications
              require a valid legal entity to verify ownership and control.
            </p>
          </div>

          <div>
            <strong className="text-white">State Registration:</strong>
            <p>
              Your business must be registered with the state to be eligible
              for certifications and government contracting.
            </p>
          </div>

          <div>
            <strong className="text-white">EIN:</strong>
            <p>
              Required for taxes, contracts, and certification applications.
              Think of it as your business Social Security number.
            </p>
          </div>

          <div>
            <strong className="text-white">Revenue:</strong>
            <p>
              Helps determine if your business is active and operational.
              Some certifications require proof of business activity.
            </p>
          </div>

          <div>
            <strong className="text-white">Employees:</strong>
            <p>
              Used to determine business size and eligibility for small business
              certifications.
            </p>
          </div>

        </div>
      )}
    </div>
  );
}