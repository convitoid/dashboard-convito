-- AlterTable: Add bsuid column to Webhook table
ALTER TABLE "Webhook" ADD COLUMN IF NOT EXISTS "bsuid" TEXT;

-- CreateIndex: Index for bsuid lookup
CREATE INDEX IF NOT EXISTS "Webhook_bsuid_idx" ON "Webhook"("bsuid");

-- CreateIndex: Index for waId lookup (improve performance)
CREATE INDEX IF NOT EXISTS "Webhook_waId_idx" ON "Webhook"("waId");
