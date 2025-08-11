-- CreateTable
CREATE TABLE "public"."Pack" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PackOutfit" (
    "id" TEXT NOT NULL,
    "packId" TEXT NOT NULL,
    "outfitId" TEXT NOT NULL,

    CONSTRAINT "PackOutfit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PackItem" (
    "id" TEXT NOT NULL,
    "packId" TEXT NOT NULL,
    "wardrobeItemId" TEXT NOT NULL,

    CONSTRAINT "PackItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Pack_userId_createdAt_idx" ON "public"."Pack"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "PackOutfit_packId_idx" ON "public"."PackOutfit"("packId");

-- CreateIndex
CREATE INDEX "PackOutfit_outfitId_idx" ON "public"."PackOutfit"("outfitId");

-- CreateIndex
CREATE UNIQUE INDEX "PackOutfit_packId_outfitId_key" ON "public"."PackOutfit"("packId", "outfitId");

-- CreateIndex
CREATE INDEX "PackItem_packId_idx" ON "public"."PackItem"("packId");

-- CreateIndex
CREATE INDEX "PackItem_wardrobeItemId_idx" ON "public"."PackItem"("wardrobeItemId");

-- CreateIndex
CREATE UNIQUE INDEX "PackItem_packId_wardrobeItemId_key" ON "public"."PackItem"("packId", "wardrobeItemId");

-- AddForeignKey
ALTER TABLE "public"."Pack" ADD CONSTRAINT "Pack_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PackOutfit" ADD CONSTRAINT "PackOutfit_packId_fkey" FOREIGN KEY ("packId") REFERENCES "public"."Pack"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PackOutfit" ADD CONSTRAINT "PackOutfit_outfitId_fkey" FOREIGN KEY ("outfitId") REFERENCES "public"."Outfit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PackItem" ADD CONSTRAINT "PackItem_packId_fkey" FOREIGN KEY ("packId") REFERENCES "public"."Pack"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PackItem" ADD CONSTRAINT "PackItem_wardrobeItemId_fkey" FOREIGN KEY ("wardrobeItemId") REFERENCES "public"."Wardrobe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
