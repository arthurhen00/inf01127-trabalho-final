/*
  Warnings:

  - A unique constraint covering the columns `[matchId]` on the table `Contract` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Contract_matchId_key" ON "Contract"("matchId");
