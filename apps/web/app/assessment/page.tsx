"use client"

import { useState } from "react"

export default function AssessmentPage() {
  const [answers, setAnswers] = useState({
    registered: false,
    ein: false,
    bank: false,
    insurance: false,
    financials: false,
    capability: false,
    pastPerformance: false
  })

  const handleChange = (field: keyof typeof answers) => {
    setAnswers((prev) => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const calculateScore = () => {
    let score = 0

    if (answers.registered) score += 20
    if (answers.ein) score += 10
    if (answers.bank) score += 10
    if (answers.insurance) score += 20
    if (answers.financials) score += 20
    if (answers.capability) score += 10
    if (answers.pastPerformance) score += 10

    localStorage.setItem("readinessScore", score.toString())
    localStorage.setItem("readinessAnswers", JSON.stringify(answers))

    window.location.href = "/dashboard"
  }

  return (
    <div style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
      <h1>Certification Readiness Assessment</h1>

      <p>
        Answer the following questions to evaluate your certification readiness.
      </p>

      <div style={{ marginTop: "20px" }}>
        <label>
          <input
            type="checkbox"
            checked={answers.registered}
            onChange={() => handleChange("registered")}
          />{" "}
          Business is legally registered
        </label>

        <br />
        <br />

        <label>
          <input
            type="checkbox"
            checked={answers.ein}
            onChange={() => handleChange("ein")}
          />{" "}
          Business has an EIN
        </label>

        <br />
        <br />

        <label>
          <input
            type="checkbox"
            checked={answers.bank}
            onChange={() => handleChange("bank")}
          />{" "}
          Business has a business bank account
        </label>

        <br />
        <br />

        <label>
          <input
            type="checkbox"
            checked={answers.insurance}
            onChange={() => handleChange("insurance")}
          />{" "}
          Business has insurance coverage
        </label>

        <br />
        <br />

        <label>
          <input
            type="checkbox"
            checked={answers.financials}
            onChange={() => handleChange("financials")}
          />{" "}
          Business has financial statements
        </label>

        <br />
        <br />

        <label>
          <input
            type="checkbox"
            checked={answers.capability}
            onChange={() => handleChange("capability")}
          />{" "}
          Business has a capability statement
        </label>

        <br />
        <br />

        <label>
          <input
            type="checkbox"
            checked={answers.pastPerformance}
            onChange={() => handleChange("pastPerformance")}
          />{" "}
          Business has past performance
        </label>
      </div>

      <button
        onClick={calculateScore}
        style={{
          marginTop: "30px",
          padding: "12px 20px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer"
        }}
      >
        Calculate Readiness Score
      </button>
    </div>
  )
}