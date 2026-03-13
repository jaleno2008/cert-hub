import { prisma } from "@/lib/db";

export async function GET() {
  const data = await prisma.certification.findMany({ orderBy: { name: "asc" } });
  return Response.json(data);
}
