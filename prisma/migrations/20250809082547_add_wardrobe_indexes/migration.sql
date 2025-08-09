/*
  Warnings:

  - A unique constraint covering the columns `[userId,brand,name,size]` on the table `Wardrobe` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "Wardrobe_userId_dateAdded_idx" ON "public"."Wardrobe"("userId", "dateAdded");

-- CreateIndex
CREATE UNIQUE INDEX "Wardrobe_userId_brand_name_size_key" ON "public"."Wardrobe"("userId", "brand", "name", "size");
