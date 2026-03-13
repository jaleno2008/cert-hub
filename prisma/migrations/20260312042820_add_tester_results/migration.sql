-- CreateTable
CREATE TABLE "Tester" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AssessmentResult" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "testerId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "registered" BOOLEAN NOT NULL DEFAULT false,
    "ein" BOOLEAN NOT NULL DEFAULT false,
    "bank" BOOLEAN NOT NULL DEFAULT false,
    "insurance" BOOLEAN NOT NULL DEFAULT false,
    "financials" BOOLEAN NOT NULL DEFAULT false,
    "capability" BOOLEAN NOT NULL DEFAULT false,
    "pastPerformance" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AssessmentResult_testerId_fkey" FOREIGN KEY ("testerId") REFERENCES "Tester" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Tester_email_key" ON "Tester"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AssessmentResult_testerId_key" ON "AssessmentResult"("testerId");
