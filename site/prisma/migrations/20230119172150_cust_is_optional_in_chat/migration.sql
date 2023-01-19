-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_customerId_fkey";

-- AlterTable
ALTER TABLE "Chat" ALTER COLUMN "customerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
