import { NextResponse } from "next/server"
import { prisma } from "../../../lib/prisma"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const email = String(body.email || "").trim().toLowerCase()

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    const tester = await prisma.tester.upsert({
      where: { email },
      update: {},
      create: { email }
    })

    return NextResponse.json({ tester })
  } catch (error) {
    console.error("Login API error:", error)

    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    )
  }
}