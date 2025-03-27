-- AlterTable
ALTER TABLE "User" ADD COLUMN     "gmailAccessToken" TEXT,
ADD COLUMN     "gmailConnected" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "gmailLastSynced" TIMESTAMP(3),
ADD COLUMN     "gmailRefreshToken" TEXT,
ADD COLUMN     "gmailTokenExpiry" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "EmailProcessingHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "emailId" TEXT NOT NULL,
    "subject" TEXT,
    "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "success" BOOLEAN NOT NULL DEFAULT true,
    "errorMessage" TEXT,
    "itemsAdded" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "EmailProcessingHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailProcessingHistory_userId_emailId_key" ON "EmailProcessingHistory"("userId", "emailId");

-- AddForeignKey
ALTER TABLE "EmailProcessingHistory" ADD CONSTRAINT "EmailProcessingHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
