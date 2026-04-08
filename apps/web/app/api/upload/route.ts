import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { writeFile } from "fs/promises";
import { prisma } from "../../../lib/prisma";

function extractFirstName(email: string) {
  const raw = email.split("@")[0];
  const firstPart = raw.split(/[._0-9]/)[0] || "User";
  return firstPart.charAt(0).toUpperCase() + firstPart.slice(1).toLowerCase();
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File | null;
    const documentId = String(formData.get("documentId") || "");
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const name = String(formData.get("name") || "").trim();

    if (!file || !documentId || !email) {
      return NextResponse.json(
        { success: false, message: "Missing file, documentId, or email" },
        { status: 400 }
      );
    }

    const user = await prisma.user.upsert({
      where: { email },
      update: {
        name: name || extractFirstName(email),
      },
      create: {
        email,
        name: name || extractFirstName(email),
      },
    });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `${Date.now()}-${file.name}`;
    const uploadDir = path.join(process.cwd(), "uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    await prisma.uploadedDocument.create({
      data: {
        documentId,
        fileName: file.name,
        filePath,
        userId: user.id,
        status: "uploaded",
      },
    });

    return NextResponse.json({
      success: true,
      message: "File saved successfully",
      fileName: file.name,
      documentId,
    });
  } catch (error) {
    console.error("Upload error:", error);

    return NextResponse.json(
      { success: false, message: "Upload failed" },
      { status: 500 }
    );
  }
}