/*
  Warnings:

  - A unique constraint covering the columns `[imageUrl]` on the table `Image` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Image_imageUrl_key" ON "Image"("imageUrl");
