-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "orderDate" TIMESTAMP(3),
    "processedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "retailer" TEXT NOT NULL,
    "totalAmount" DOUBLE PRECISION,
    "currency" TEXT,
    "status" TEXT NOT NULL,
    "paymentMethod" TEXT,
    "shippingAddress" TEXT,
    "trackingNumber" TEXT,
    "trackingUrl" TEXT,
    "emailId" TEXT,
    "items" JSONB NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Order_emailId_idx" ON "Order"("emailId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_userId_orderId_key" ON "Order"("userId", "orderId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
