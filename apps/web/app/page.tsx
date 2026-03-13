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
    <div style={{ minHeight: "100vh", padding: 40, fontFamily: "Arial, sans-serif" }}>
      <h1>CHub Tester Login</h1>

      <input
        type="email"
        placeholder="name@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          padding: 10,
          width: 320,
          fontSize: 16,
          border: "1px solid #cbd5e1",
          borderRadius: 8
        }}
      />

      <br />
      <br />

      <button
        onClick={handleLogin}
        disabled={loading}
        style={{
          padding: "10px 18px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: 8,
          cursor: "pointer"
        }}
      >
        {loading ? "Signing In..." : "Continue"}
      </button>

      {error ? <p style={{ color: "red" }}>{error}</p> : null}
    </div>
  )
}