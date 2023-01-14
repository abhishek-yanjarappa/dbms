/*
  Warnings:

  - A unique constraint covering the columns `[googleId]` on the table `Agent` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Agent` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[googleId]` on the table `Enterprize` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Agent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `googleId` to the `Agent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `googleId` to the `Enterprize` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Agent" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "googleId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Enterprize" ADD COLUMN     "googleId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Agent_googleId_key" ON "Agent"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "Agent_email_key" ON "Agent"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Enterprize_googleId_key" ON "Enterprize"("googleId");
