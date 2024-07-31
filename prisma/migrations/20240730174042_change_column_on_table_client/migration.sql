/*
  Warnings:

  - You are about to drop the column `event_location` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `location_type` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `photos` on the `Client` table. All the data in the column will be lost.
  - Added the required column `event_name` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `event_type` to the `Client` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Client" DROP COLUMN "event_location",
DROP COLUMN "location_type",
DROP COLUMN "photos",
ADD COLUMN     "event_name" TEXT NOT NULL,
ADD COLUMN     "event_type" TEXT NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL;
