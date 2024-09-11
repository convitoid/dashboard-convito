-- CreateTable
CREATE TABLE "QrBroadcastLogs" (
    "id" SERIAL NOT NULL,
    "QrGuestId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QrBroadcastLogs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "QrBroadcastLogs" ADD CONSTRAINT "QrBroadcastLogs_QrGuestId_fkey" FOREIGN KEY ("QrGuestId") REFERENCES "QrGuest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
