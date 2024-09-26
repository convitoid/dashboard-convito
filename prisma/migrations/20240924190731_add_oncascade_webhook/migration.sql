-- DropForeignKey
ALTER TABLE "Webhook" DROP CONSTRAINT "Webhook_clientId_fkey";

-- AddForeignKey
ALTER TABLE "Webhook" ADD CONSTRAINT "Webhook_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
