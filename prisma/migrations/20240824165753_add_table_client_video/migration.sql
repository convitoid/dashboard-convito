-- CreateTable
CREATE TABLE "ClientVideo" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER NOT NULL,
    "flag" TEXT NOT NULL,
    "video" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientVideo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ClientVideo" ADD CONSTRAINT "ClientVideo_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
