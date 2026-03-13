"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async () => {
    setError("")

    if (!email.trim()) {
      setError("Enter an email address.")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Login failed")
      }

      localStorage.setItem("testerId", data.tester.id)
      localStorage.setItem("testerEmail", data.tester.email)

      router.push("/assessment")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8fafc",
        fontFamily: "Arial, sans-serif",
        padding: "24px"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "16px",
          padding: "32px"
        }}
      >
        <h1 style={{ marginTop: 0 }}>CHub Tester Login</h1>

        <p style={{ color: "#475569" }}>
          Enter your email to start or continue your certification readiness assessment.
        </p>

        <input
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            fontSize: "16px",
            border: "1px solid #cbd5e1",
            borderRadius: "8px",
            boxSizing: "border-box",
            marginTop: "16px"
          }}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            marginTop: "16px",
            width: "100%",
            padding: "12px 16px",
            background: "#2563eb",
            color: "#ffffff",
            border: "none",
            borderRadius: "8px",
            fontWeight: 700,
            cursor: "pointer"
          }}
        >
          {loading ? "Signing In..." : "Continue"}
        </button>

        {error ? (
          <p style={{ color: "red", marginTop: "12px" }}>{error}</p>
        ) : null}
      </div>
    </div>
  )
}