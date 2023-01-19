/*
  Warnings:

  - You are about to drop the column `enterprizeId` on the `Customer` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "TicketStatus" ADD VALUE 'TEMP';

-- DropForeignKey
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_enterprizeId_fkey";

-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "enterprizeId",
ADD COLUMN     "OTP" TEXT,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;
