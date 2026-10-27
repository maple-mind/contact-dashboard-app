-- CreateEnum
CREATE TYPE "InquiryEventType" AS ENUM ('STATUS_CHANGED', 'ASSIGNEE_CHANGED');

-- CreateTable
CREATE TABLE "InquiryEvent" (
    "id" TEXT NOT NULL,
    "type" "InquiryEventType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "inquiryId" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "fromStatus" "InquiryStatus",
    "toStatus" "InquiryStatus",
    "fromAssigneeId" TEXT,
    "toAssigneeId" TEXT,

    CONSTRAINT "InquiryEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InquiryEvent_inquiryId_createdAt_idx" ON "InquiryEvent"("inquiryId", "createdAt");

-- AddForeignKey
ALTER TABLE "InquiryEvent" ADD CONSTRAINT "InquiryEvent_inquiryId_fkey" FOREIGN KEY ("inquiryId") REFERENCES "Inquiry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InquiryEvent" ADD CONSTRAINT "InquiryEvent_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InquiryEvent" ADD CONSTRAINT "InquiryEvent_fromAssigneeId_fkey" FOREIGN KEY ("fromAssigneeId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InquiryEvent" ADD CONSTRAINT "InquiryEvent_toAssigneeId_fkey" FOREIGN KEY ("toAssigneeId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
