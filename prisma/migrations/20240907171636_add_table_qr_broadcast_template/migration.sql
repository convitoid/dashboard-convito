-- CreateTable
CREATE TABLE "QrBroadcastTemplate" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "clientId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QrBroadcastTemplate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "QrBroadcastTemplate" ADD CONSTRAINT "QrBroadcastTemplate_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
