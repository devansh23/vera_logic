/*
  Warnings:

  - You are about to drop the column `gmailAccessToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `gmailConnected` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `gmailLastSynced` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `gmailRefreshToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `gmailTokenExpiry` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `EmailProcessingHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EmailProcessingStatus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EmailProcessingHistory" DROP CONSTRAINT "EmailProcessingHistory_userId_fkey";

-- DropForeignKey
ALTER TABLE "EmailProcessingStatus" DROP CONSTRAINT "EmailProcessingStatus_userId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "gmailAccessToken",
DROP COLUMN "gmailConnected",
DROP COLUMN "gmailLastSynced",
DROP COLUMN "gmailRefreshToken",
DROP COLUMN "gmailTokenExpiry";

-- AlterTable
ALTER TABLE "Wardrobe" ADD COLUMN     "source" TEXT,
ADD COLUMN     "sourceEmailId" TEXT,
ADD COLUMN     "sourceOrderId" TEXT,
ADD COLUMN     "sourceRetailer" TEXT;

-- DropTable
DROP TABLE "EmailProcessingHistory";

-- DropTable
DROP TABLE "EmailProcessingStatus";

-- DropTable
DROP TABLE "Order";
