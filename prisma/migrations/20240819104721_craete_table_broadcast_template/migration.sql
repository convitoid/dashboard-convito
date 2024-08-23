-- CreateTable
CREATE TABLE "BroadcastTemplate" (
    "id" SERIAL NOT NULL,
    "template_name" TEXT NOT NULL,
    "client_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BroadcastTemplate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BroadcastTemplate" ADD CONSTRAINT "BroadcastTemplate_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
