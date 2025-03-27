-- CreateTable
CREATE TABLE "EmailProcessingStatus" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "retailer" TEXT,
    "searchQuery" TEXT,
    "daysBack" INTEGER NOT NULL DEFAULT 30,
    "maxEmails" INTEGER NOT NULL DEFAULT 10,
    "onlyUnread" BOOLEAN NOT NULL DEFAULT true,
    "emailsFound" INTEGER,
    "emailsProcessed" INTEGER,
    "ordersCreated" INTEGER,
    "failedEmails" INTEGER,
    "errorMessage" TEXT,
    "lastProcessedId" TEXT,
    "markAsRead" BOOLEAN NOT NULL DEFAULT true,
    "isAutomated" BOOLEAN NOT NULL DEFAULT false,
    "nextScheduledRun" TIMESTAMP(3),

    CONSTRAINT "EmailProcessingStatus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EmailProcessingStatus_userId_status_idx" ON "EmailProcessingStatus"("userId", "status");

-- CreateIndex
CREATE INDEX "EmailProcessingStatus_userId_startedAt_idx" ON "EmailProcessingStatus"("userId", "startedAt");

-- CreateIndex
CREATE INDEX "EmailProcessingStatus_userId_retailer_idx" ON "EmailProcessingStatus"("userId", "retailer");

-- AddForeignKey
ALTER TABLE "EmailProcessingStatus" ADD CONSTRAINT "EmailProcessingStatus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
