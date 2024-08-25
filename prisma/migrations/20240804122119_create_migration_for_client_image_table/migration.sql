-- CreateTable
CREATE TABLE "ClientImage" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER NOT NULL,
    "imageName" TEXT NOT NULL,
    "imagePath" TEXT NOT NULL,
    "imageOriginalPath" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ClientImage" ADD CONSTRAINT "ClientImage_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
