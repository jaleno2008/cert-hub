import { NextResponse } from "next/server"
import { prisma } from "../../../lib/prisma"
export async function POST(req: Request) {
  try {
    const body = await req.json()

    const result = await prisma.result.create({
      data: {
        score: body.score,
        answers: JSON.stringify(body.answers),
      },
    })

    return NextResponse.json({ result })

  } catch (error) {
    console.error("Result API error:", error)

    return NextResponse.json(
      { error: "Result save failed" },
      { status: 500 }
    )
  }
}