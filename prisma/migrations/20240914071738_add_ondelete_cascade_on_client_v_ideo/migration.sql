-- DropForeignKey
ALTER TABLE "ClientVideo" DROP CONSTRAINT "ClientVideo_clientId_fkey";

-- AddForeignKey
ALTER TABLE "ClientVideo" ADD CONSTRAINT "ClientVideo_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
