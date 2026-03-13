
- Next.js App Router with thin API routes; shared Zod schemas to prevent contract drift.
- Prisma for DB; UUID PKs; explicit status machine on UserCertification.
- External object storage (S3-compatible) for documents; DB stores metadata only.
- Reminders are a simple table; later add a cron worker to batch-send emails.
- Start order: SAM.gov → SBA 8(a) → FDOT DBE / Miami-Dade MBE (seeded).
