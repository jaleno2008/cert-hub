"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AssessmentPage() {
  const router = useRouter()

  const [answers, setAnswers] = useState({
    registered: false,
    ein: false,
    bank: false,
    insurance: false,
    financials: false,
    capability: false,
    pastPerformance: false,
  })

  function handleChange(e: any) {
    setAnswers({
      ...answers,
      [e.target.name]: e.target.checked,
    })
  }

  async function calculateScore() {
    const values = Object.values(answers)
    const total = values.length
    const positive = values.filter(Boolean).length

    const score = Math.round((positive / total) * 100)

    await fetch("/api/results", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        answers,
        score,
      }),
    })

    router.push("/dashboard")
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Certification Readiness Assessment</h1>

      <label>
        <input type="checkbox" name="registered" onChange={handleChange} />
        Business is legally registered
      </label>

      <br />

      <label>
        <input type="checkbox" name="ein" onChange={handleChange} />
        Business has an EIN
      </label>

      <br />

      <label>
        <input type="checkbox" name="bank" onChange={handleChange} />
        Business bank account
      </label>

      <br />

      <label>
        <input type="checkbox" name="insurance" onChange={handleChange} />
        Insurance coverage
      </label>

      <br />

      <label>
        <input type="checkbox" name="financials" onChange={handleChange} />
        Financial statements
      </label>

      <br />

      <label>
        <input type="checkbox" name="capability" onChange={handleChange} />
        Capability statement
      </label>

      <br />

      <label>
        <input type="checkbox" name="pastPerformance" onChange={handleChange} />
        Past performance
      </label>

      <br />
      <br />

      <button onClick={calculateScore}>
        Calculate Readiness Score
      </button>
    </div>
  )
}