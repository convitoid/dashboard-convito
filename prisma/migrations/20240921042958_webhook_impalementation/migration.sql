-- CreateTable
CREATE TABLE "Webhook" (
    "id" SERIAL NOT NULL,
    "guestId" INTEGER NOT NULL,
    "templateName" TEXT,
    "waId" TEXT,
    "recipientId" TEXT,
    "status" TEXT,
    "lastUpdateStatus" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Webhook_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Webhook" ADD CONSTRAINT "Webhook_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
