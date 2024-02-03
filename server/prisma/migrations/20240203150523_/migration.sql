-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Property" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "zipcode" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "district" TEXT NOT NULL DEFAULT '',
    "city" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "propertyType" TEXT NOT NULL,
    "propertyNumber" INTEGER NOT NULL,
    "numBedroom" INTEGER NOT NULL,
    "numBathroom" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "numParkingSpots" INTEGER NOT NULL DEFAULT 0,
    "size" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "adType" TEXT NOT NULL DEFAULT 'sale',
    CONSTRAINT "Property_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Property" ("adType", "address", "available", "city", "createdAt", "description", "id", "name", "numBathroom", "numBedroom", "price", "propertyNumber", "propertyType", "state", "userId", "zipcode") SELECT "adType", "address", "available", "city", "createdAt", "description", "id", "name", "numBathroom", "numBedroom", "price", "propertyNumber", "propertyType", "state", "userId", "zipcode" FROM "Property";
DROP TABLE "Property";
ALTER TABLE "new_Property" RENAME TO "Property";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
