/*
  Warnings:

  - Added the required column `clientName` to the `LogTestMessage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `LogTestQuestion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LogTestMessage" ADD COLUMN     "clientName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "LogTestQuestion" ADD COLUMN     "type" TEXT NOT NULL;
