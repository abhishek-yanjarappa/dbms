-- AlterTable
ALTER TABLE "ChatItem" ADD COLUMN     "ticketId" INTEGER;

-- AddForeignKey
ALTER TABLE "ChatItem" ADD CONSTRAINT "ChatItem_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE SET NULL ON UPDATE CASCADE;
