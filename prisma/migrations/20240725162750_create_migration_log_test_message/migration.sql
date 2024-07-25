-- CreateTable
CREATE TABLE "LogTestMessage" (
    "id" SERIAL NOT NULL,
    "phoneNumber" INTEGER NOT NULL,
    "eventName" TEXT NOT NULL,
    "senderName" TEXT NOT NULL,
    "invitationLink" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LogTestMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LogTestQuestion" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "idLogTestMessage" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LogTestQuestion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LogTestQuestion" ADD CONSTRAINT "LogTestQuestion_idLogTestMessage_fkey" FOREIGN KEY ("idLogTestMessage") REFERENCES "LogTestMessage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
