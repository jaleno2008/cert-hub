-- CreateTable
CREATE TABLE "BusinessDocument" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "documentType" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "contentType" TEXT,
    "fileSize" INTEGER,
    "certification" TEXT,
    "status" TEXT NOT NULL DEFAULT 'uploaded',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
