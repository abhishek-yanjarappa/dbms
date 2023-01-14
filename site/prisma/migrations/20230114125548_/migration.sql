/*
  Warnings:

  - You are about to drop the column `googleId` on the `Enterprize` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[telegramToken]` on the table `Enterprize` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Enterprize_googleId_key";

-- AlterTable
ALTER TABLE "Agent" ADD COLUMN     "photo" TEXT;

-- AlterTable
ALTER TABLE "Enterprize" DROP COLUMN "googleId",
ADD COLUMN     "photo" TEXT,
ADD COLUMN     "telegramToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Enterprize_telegramToken_key" ON "Enterprize"("telegramToken");
