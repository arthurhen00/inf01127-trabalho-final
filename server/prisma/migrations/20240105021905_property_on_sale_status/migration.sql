-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Property" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "zipcode" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "propertyType" TEXT NOT NULL,
    "propertyNumber" INTEGER NOT NULL,
    "numBedroom" INTEGER NOT NULL,
    "numBathroom" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "onSale" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Property_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Property" ("address", "city", "createdAt", "description", "id", "name", "numBathroom", "numBedroom", "price", "propertyNumber", "propertyType", "state", "userId", "zipcode") SELECT "address", "city", "createdAt", "description", "id", "name", "numBathroom", "numBedroom", "price", "propertyNumber", "propertyType", "state", "userId", "zipcode" FROM "Property";
DROP TABLE "Property";
ALTER TABLE "new_Property" RENAME TO "Property";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
