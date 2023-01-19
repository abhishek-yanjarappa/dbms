/*
  Warnings:

  - Added the required column `author` to the `ChatItem` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AuthorType" AS ENUM ('AGENT', 'CUSTOMER');

-- AlterTable
ALTER TABLE "ChatItem" ADD COLUMN     "author" "AuthorType" NOT NULL;
