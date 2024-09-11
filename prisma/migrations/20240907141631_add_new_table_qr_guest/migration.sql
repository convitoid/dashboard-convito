-- CreateTable
CREATE TABLE "QrGuest" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "qr_code" TEXT NOT NULL,
    "clientId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QrGuest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "QrGuest" ADD CONSTRAINT "QrGuest_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
