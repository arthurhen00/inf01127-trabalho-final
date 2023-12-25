/*
  Warnings:

  - You are about to drop the column `imageId` on the `Image` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Image" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "imageUrl" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    CONSTRAINT "Image_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Image" ("id", "imageUrl", "propertyId") SELECT "id", "imageUrl", "propertyId" FROM "Image";
DROP TABLE "Image";
ALTER TABLE "new_Image" RENAME TO "Image";
CREATE UNIQUE INDEX "Image_imageUrl_key" ON "Image"("imageUrl");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
