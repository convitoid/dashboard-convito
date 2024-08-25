/*
  Warnings:

  - Added the required column `flag` to the `ClientImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ClientImage" ADD COLUMN     "flag" TEXT NOT NULL;
