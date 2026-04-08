import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json({
      documents: [
        {
          name: "Business License.pdf",
          type: "business_license",
        },
        {
          name: "EIN Letter.pdf",
          type: "ein_letter",
        },
        {
          name: "Articles of Organization.pdf",
          type: "articles",
        },
        {
          name: "Ownership Documents.pdf",
          type: "ownership",
        },
        {
          name: "2024 Tax Return.pdf",
          type: "tax_return",
        },
        {
          name: "Owner Resume.pdf",
          type: "resume",
        },
      ],
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to load documents.",
      },
      { status: 500 }
    );
  }
}