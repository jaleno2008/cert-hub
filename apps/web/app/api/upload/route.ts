import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

const MAX_FILE_SIZE = 10 * 1024 * 1024

const ALLOWED_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const documentType = formData.get('documentType') as string | null
    const certification = formData.get('certification') as string | null

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { error: 'Missing BLOB_READ_WRITE_TOKEN in apps/web/.env.local' },
        { status: 500 }
      )
    }

    if (!file) {
      return NextResponse.json({ error: 'No file was uploaded.' }, { status: 400 })
    }

    if (!documentType) {
      return NextResponse.json({ error: 'Document type is required.' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type.' },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File is too large. Maximum size is 10MB.' },
        { status: 400 }
      )
    }

    const timestamp = Date.now()
    const safeName = file.name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9._-]/g, '')
    const pathname = `chub-uploads/${documentType}/${timestamp}-${safeName}`

    const blob = await put(pathname, file, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    const savedDocument = await prisma.businessDocument.create({
      data: {
        documentType,
        certification: certification || 'MBE',
        fileName: file.name,
        fileUrl: blob.url,
        filePath: blob.pathname,
        contentType: file.type,
        fileSize: file.size,
        status: 'uploaded',
      },
    })

    return NextResponse.json({
      success: true,
      id: savedDocument.id,
      documentType: savedDocument.documentType,
      certification: savedDocument.certification,
      fileName: savedDocument.fileName,
      url: savedDocument.fileUrl,
      pathname: savedDocument.filePath,
      contentType: savedDocument.contentType,
      size: savedDocument.fileSize,
      uploadedAt: savedDocument.createdAt,
    })
  } catch (error) {
    console.error('UPLOAD ERROR:', error)

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Upload failed.',
      },
      { status: 500 }
    )
  }
}