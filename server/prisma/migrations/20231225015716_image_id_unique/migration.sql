/*
  Warnings:

  - A unique constraint covering the columns `[imageId]` on the table `Image` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Image_imageId_key" ON "Image"("imageId");
