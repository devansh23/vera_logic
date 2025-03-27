-- CreateTable
CREATE TABLE "ReturnHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" TEXT,
    "originalPrice" TEXT,
    "discount" TEXT,
    "image" TEXT,
    "productLink" TEXT,
    "size" TEXT,
    "color" TEXT,
    "returnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "returnReference" TEXT,
    "orderReference" TEXT,
    "returnReason" TEXT,
    "retailer" TEXT,
    "emailId" TEXT,

    CONSTRAINT "ReturnHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ReturnHistory_userId_idx" ON "ReturnHistory"("userId");

-- AddForeignKey
ALTER TABLE "ReturnHistory" ADD CONSTRAINT "ReturnHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
