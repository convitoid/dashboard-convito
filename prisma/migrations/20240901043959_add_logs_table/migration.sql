-- CreateTable
CREATE TABLE "SendBlastingLogs" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL,
    "logs" TEXT NOT NULL,
    "guestId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SendBlastingLogs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SendBlastingLogs" ADD CONSTRAINT "SendBlastingLogs_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
