-- AlterTable
ALTER TABLE "User" ADD COLUMN     "gmailAccessToken" TEXT,
ADD COLUMN     "gmailConnected" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "gmailLastSynced" TIMESTAMP(3),
ADD COLUMN     "gmailRefreshToken" TEXT,
ADD COLUMN     "gmailTokenExpiry" TIMESTAMP(3);
