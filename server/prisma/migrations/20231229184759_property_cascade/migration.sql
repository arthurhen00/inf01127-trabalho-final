-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MatchRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "requesterId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "propertyId" TEXT NOT NULL,
    CONSTRAINT "MatchRequest_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_MatchRequest" ("createdAt", "id", "propertyId", "receiverId", "requesterId") SELECT "createdAt", "id", "propertyId", "receiverId", "requesterId" FROM "MatchRequest";
DROP TABLE "MatchRequest";
ALTER TABLE "new_MatchRequest" RENAME TO "MatchRequest";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
