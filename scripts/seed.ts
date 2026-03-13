import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const certs = [
    { slug: "sam-gov", name: "SAM.gov Registration", level: "FEDERAL", authority: "GSA", description: "Foundation for federal work", prerequisites: [] },
    { slug: "sba-8a", name: "SBA 8(a)", level: "FEDERAL", authority: "SBA", description: "For socially/economically disadvantaged businesses", prerequisites: ["sam-gov"] },
    { slug: "fl-fdot-dbe", name: "Florida DOT DBE", level: "STATE", authority: "FDOT", description: "Florida Disadvantaged Business Enterprise", prerequisites: ["sam-gov"] },
    { slug: "miami-dade-mbe", name: "Miami-Dade MBE", level: "LOCAL", authority: "Miami-Dade County", description: "Local Minority Business Enterprise", prerequisites: ["sam-gov"] }
  ];

  for (const c of certs) {
    await prisma.certification.upsert({
      where: { slug: c.slug },
      update: c as any,
      create: c as any
    });
  }
  console.log("Seeded certifications.");
}

main().finally(() => prisma.$disconnect());
