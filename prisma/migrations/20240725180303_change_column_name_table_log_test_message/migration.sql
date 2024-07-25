/*
  Warnings:

  - You are about to drop the column `cliendId` on the `LogTestMessage` table. All the data in the column will be lost.
  - Added the required column `clientId` to the `LogTestMessage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LogTestMessage" DROP COLUMN "cliendId",
ADD COLUMN     "clientId" TEXT NOT NULL;
