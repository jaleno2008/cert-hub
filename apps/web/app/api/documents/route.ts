import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET() {
  try {
    const documents = await prisma.businessDocument.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(documents)
  } catch (error) {
    console.error('GET DOCUMENTS ERROR:', error)

    return NextResponse.json(
      { error: 'Failed to fetch documents.' },
      { status: 500 }
    )
  }
}