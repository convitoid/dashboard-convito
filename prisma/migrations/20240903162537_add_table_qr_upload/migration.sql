-- CreateTable
CREATE TABLE "QrFile" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "originalPath" TEXT NOT NULL,
    "clientId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QrFile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "QrFile" ADD CONSTRAINT "QrFile_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
