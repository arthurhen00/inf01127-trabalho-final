-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Image" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "imageId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    CONSTRAINT "Image_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Image" ("id", "imageId", "imageUrl", "propertyId") SELECT "id", "imageId", "imageUrl", "propertyId" FROM "Image";
DROP TABLE "Image";
ALTER TABLE "new_Image" RENAME TO "Image";
CREATE UNIQUE INDEX "Image_imageId_key" ON "Image"("imageId");
CREATE UNIQUE INDEX "Image_imageUrl_key" ON "Image"("imageUrl");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
