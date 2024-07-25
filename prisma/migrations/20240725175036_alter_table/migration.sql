/*
  Warnings:

  - Added the required column `cliendId` to the `LogTestMessage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LogTestMessage" ADD COLUMN     "cliendId" TEXT NOT NULL;
