"use client"

import { useEffect, useMemo, useState } from "react"

type Answers = {
  registered: boolean
  ein: boolean
  bank: boolean
  insurance: boolean
  financials: boolean
  capability: boolean
  pastPerformance: boolean
}

const defaultAnswers: Answers = {
  registered: false,
  ein: false,
  bank: false,
  insurance: false,
  financials: false,
  capability: false,
  pastPerformance: false
}

export default function DashboardPage() {
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState<Answers>(defaultAnswers)
  const [fixItem, setFixItem] = useState<string | null>(null)

  useEffect(() => {
    const savedScore = localStorage.getItem("readinessScore")
    const savedAnswers = localStorage.getItem("readinessAnswers")

    if (savedScore) {
      setScore(parseInt(savedScore, 10))
    }

    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers))
    }
  }, [])

  const statusColor = useMemo(() => {
    if (score >= 80) return "#166534"
    if (score >= 50) return "#a16207"
    return "#b91c1c"
  }, [score])

  const statusBg = useMemo(() => {
    if (score >= 80) return "#dcfce7"
    if (score >= 50) return "#fef9c3"
    return "#fee2e2"
  }, [score])

  const progressColor = useMemo(() => {
    if (score >= 80) return "#16a34a"
    if (score >= 50) return "#eab308"
    return "#2563eb"
  }, [score])

  const status = useMemo(() => {
    if (score >= 80) return "Certification Ready"
    if (score >= 50) return "Moderately Ready"
    return "Not Ready"
  }, [score])

  const message = useMemo(() => {
    if (score >= 80) return "Your business appears ready for certification."
    if (score >= 50) return "Your business needs some preparation before applying."
    return "Your business needs structural preparation before certification."
  }, [score])

  const nextPriority = useMemo(() => {
    if (!answers.registered) return "Complete your business registration."
    if (!answers.ein) return "Obtain your EIN."
    if (!answers.bank) return "Open a business bank account."
    if (!answers.insurance) return "Secure business insurance coverage."
    if (!answers.financials) return "Prepare your financial statements."
    if (!answers.capability) return "Create your capability statement."
    if (!answers.pastPerformance) return "Document your past performance."
    return "Review your documents and begin your certification application."
  }, [answers])

  const completedCount = Object.values(answers).filter(Boolean).length

  const missingItems = [
    !answers.registered && "Registered Business",
    !answers.ein && "EIN",
    !answers.bank && "Business Bank Account",
    !answers.insurance && "Insurance Coverage",
    !answers.financials && "Financial Statements",
    !answers.capability && "Capability Statement",
    !answers.pastPerformance && "Past Performance"
  ].filter(Boolean) as string[]

  const fixGuide = (item: string) => {
    switch (item) {
      case "registered":
        return "Register your business entity with your state before applying for certification."
      case "ein":
        return "Apply for an EIN through the IRS so your business can be identified for tax and banking purposes."
      case "bank":
        return "Open a business bank account using your EIN and business registration documents."
      case "insurance":
        return "Obtain general liability insurance. Many certification and contracting opportunities require active coverage."
      case "financials":
        return "Prepare your financial statements, including profit and loss statements and balance sheets."
      case "capability":
        return "Create a one-page capability statement describing services, NAICS codes, and experience."
      case "pastPerformance":
        return "Document previous projects, clients, or contracts that show your experience and performance."
      default:
        return "Complete this requirement before certification."
    }
  }

  const StepCard = ({
    stepNumber,
    title,
    description,
    complete,
    children
  }: {
    stepNumber: number
    title: string
    description: string
    complete: boolean
    children: React.ReactNode
  }) => {
    return (
      <div
        style={{
          border: "1px solid #e2e8f0",
          borderRadius: "16px",
          padding: "20px",
          background: complete ? "#f0fdf4" : "#ffffff"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "12px"
          }}
        >
          <div>
            <p style={{ margin: 0, color: "#64748b", fontSize: "13px", fontWeight: 700 }}>
              STEP {stepNumber}
            </p>
            <h3 style={{ margin: "6px 0 4px 0" }}>{title}</h3>
            <p style={{ margin: 0, color: "#475569" }}>{description}</p>
          </div>

          <div
            style={{
              background: complete ? "#dcfce7" : "#fee2e2",
              color: complete ? "#166534" : "#b91c1c",
              padding: "8px 12px",
              borderRadius: "999px",
              fontWeight: 700,
              whiteSpace: "nowrap"
            }}
          >
            {complete ? "Complete" : "In Progress"}
          </div>
        </div>

        <div style={{ marginTop: "14px" }}>{children}</div>
      </div>
    )
  }

  const Item = ({
    label,
    field
  }: {
    label: string
    field: keyof Answers
  }) => {
    const complete = answers[field]

    return (
      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          padding: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
          background: complete ? "#ecfdf5" : "#fff"
        }}
      >
        <div>
          <strong>{label}</strong>
          <div style={{ fontSize: "14px", color: "#6b7280" }}>
            {complete ? "Complete" : "Missing"}
          </div>
        </div>

        {complete ? (
          <span style={{ color: "green", fontWeight: "bold" }}>✔</span>
        ) : (
          <button
            onClick={() => setFixItem(field)}
            style={{
              background: "#2563eb",
              color: "white",
              border: "none",
              padding: "8px 14px",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            Fix This
          </button>
        )}
      </div>
    )
  }

  const StepItem = ({
    label,
    complete
  }: {
    label: string
    complete: boolean
  }) => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 14px",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          marginBottom: "10px",
          background: complete ? "#f0fdf4" : "#fff"
        }}
      >
        <span style={{ fontWeight: 600 }}>{label}</span>
        <span
          style={{
            fontWeight: 700,
            color: complete ? "#166534" : "#b91c1c"
          }}
        >
          {complete ? "✔ Complete" : "✖ Missing"}
        </span>
      </div>
    )
  }

  const step1Complete = answers.registered && answers.ein
  const step2Complete = answers.bank && answers.insurance && answers.financials
  const step3Complete = answers.capability && answers.pastPerformance
  const step4Complete = step1Complete && step2Complete && step3Complete

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        fontFamily: "Arial, sans-serif",
        color: "#0f172a"
      }}
    >
      <div
        style={{
          borderBottom: "1px solid #e2e8f0",
          background: "#ffffff",
          padding: "18px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: "32px" }}>Certification Hub Dashboard</h1>
          <p style={{ margin: "6px 0 0 0", color: "#475569" }}>
            Readiness results and next-step guidance
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <a
            href="/assessment"
            style={{
              textDecoration: "none",
              padding: "10px 16px",
              borderRadius: "10px",
              background: "#2563eb",
              color: "white",
              fontWeight: 600
            }}
          >
            Retake Assessment
          </a>
        </div>
      </div>

      <div style={{ padding: "32px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "20px",
            marginBottom: "24px"
          }}
        >
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "16px",
              padding: "24px"
            }}
          >
            <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>Current Score</p>
            <h2 style={{ margin: "12px 0 0 0", fontSize: "44px" }}>{score}%</h2>
          </div>

          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "16px",
              padding: "24px"
            }}
          >
            <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>Certification Status</p>
            <div
              style={{
                display: "inline-block",
                marginTop: "14px",
                background: statusBg,
                color: statusColor,
                padding: "10px 14px",
                borderRadius: "999px",
                fontWeight: 700
              }}
            >
              {status}
            </div>
          </div>

          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "16px",
              padding: "24px"
            }}
          >
            <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>Items Completed</p>
            <h2 style={{ margin: "12px 0 0 0", fontSize: "44px" }}>{completedCount}/7</h2>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "20px"
          }}
        >
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "16px",
              padding: "28px"
            }}
          >
            <h2 style={{ marginTop: 0 }}>Your Readiness Score</h2>

            <div
              style={{
                width: "100%",
                height: "22px",
                background: "#e2e8f0",
                borderRadius: "999px",
                overflow: "hidden",
                marginBottom: "18px"
              }}
            >
              <div
                style={{
                  width: `${score}%`,
                  height: "100%",
                  background: progressColor,
                  borderRadius: "999px",
                  transition: "width 0.3s ease"
                }}
              />
            </div>

            <div style={{ fontSize: "56px", fontWeight: 700, marginBottom: "10px" }}>
              {score}%
            </div>

            <p style={{ fontSize: "20px", fontWeight: 700, margin: "0 0 10px 0" }}>{status}</p>
            <p style={{ margin: 0, color: "#334155", fontSize: "18px" }}>{message}</p>

            <div
              style={{
                marginTop: "26px",
                padding: "18px",
                background: "#eff6ff",
                border: "1px solid #bfdbfe",
                borderRadius: "14px"
              }}
            >
              <p style={{ margin: "0 0 8px 0", fontWeight: 700 }}>Next Priority</p>
              <p style={{ margin: 0, color: "#1e3a8a" }}>{nextPriority}</p>
            </div>
          </div>

          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "16px",
              padding: "28px"
            }}
          >
            <h2 style={{ marginTop: 0 }}>Missing Items</h2>

            {missingItems.length === 0 ? (
              <div
                style={{
                  background: "#dcfce7",
                  color: "#166534",
                  borderRadius: "12px",
                  padding: "16px",
                  fontWeight: 700
                }}
              >
                All major readiness items are complete.
              </div>
            ) : (
              <ul style={{ paddingLeft: "22px", lineHeight: "32px", marginBottom: 0 }}>
                {missingItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div
          style={{
            marginTop: "20px",
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            padding: "28px"
          }}
        >
          <h2 style={{ marginTop: 0 }}>Readiness Breakdown</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "16px"
            }}
          >
            <Item label="Registered Business" field="registered" />
            <Item label="EIN" field="ein" />
            <Item label="Business Bank Account" field="bank" />
            <Item label="Insurance Coverage" field="insurance" />
            <Item label="Financial Statements" field="financials" />
            <Item label="Capability Statement" field="capability" />
            <Item label="Past Performance" field="pastPerformance" />
          </div>

          {fixItem && (
            <div
              style={{
                marginTop: "24px",
                padding: "20px",
                border: "1px solid #2563eb",
                borderRadius: "14px",
                background: "#eff6ff"
              }}
            >
              <h3 style={{ marginTop: 0 }}>How to Fix This</h3>
              <p style={{ fontSize: "18px", color: "#1e293b" }}>{fixGuide(fixItem)}</p>

              <button
                onClick={() => setFixItem(null)}
                style={{
                  marginTop: "10px",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#2563eb",
                  color: "white",
                  cursor: "pointer"
                }}
              >
                Close
              </button>
            </div>
          )}
        </div>

        <div
          style={{
            marginTop: "20px",
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            padding: "28px"
          }}
        >
          <h2 style={{ marginTop: 0 }}>Certification Pathway</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "18px"
            }}
          >
            <StepCard
              stepNumber={1}
              title="Business Setup"
              description="Establish your business foundation before certification."
              complete={step1Complete}
            >
              <StepItem label="Registered Business" complete={answers.registered} />
              <StepItem label="EIN" complete={answers.ein} />
            </StepCard>

            <StepCard
              stepNumber={2}
              title="Compliance & Financial Readiness"
              description="Make sure your business can meet vendor and certification requirements."
              complete={step2Complete}
            >
              <StepItem label="Business Bank Account" complete={answers.bank} />
              <StepItem label="Insurance Coverage" complete={answers.insurance} />
              <StepItem label="Financial Statements" complete={answers.financials} />
            </StepCard>

            <StepCard
              stepNumber={3}
              title="Capability Positioning"
              description="Show buyers and agencies that your company is prepared and credible."
              complete={step3Complete}
            >
              <StepItem label="Capability Statement" complete={answers.capability} />
              <StepItem label="Past Performance" complete={answers.pastPerformance} />
            </StepCard>

            <StepCard
              stepNumber={4}
              title="Certification Application"
              description="Move into application once the readiness foundation is complete."
              complete={step4Complete}
            >
              <StepItem label="Business Setup Complete" complete={step1Complete} />
              <StepItem label="Compliance Complete" complete={step2Complete} />
              <StepItem label="Positioning Complete" complete={step3Complete} />
            </StepCard>
          </div>
        </div>
      </div>
    </div>
  )
}