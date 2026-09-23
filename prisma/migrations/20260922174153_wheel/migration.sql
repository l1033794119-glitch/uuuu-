/*
  Warnings:

  - You are about to drop the column `prize` on the `Registration` table. All the data in the column will be lost.
  - You are about to drop the column `won` on the `Registration` table. All the data in the column will be lost.
  - Added the required column `email` to the `Registration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zipcode` to the `Registration` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "DrawRecord" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "registrationId" INTEGER NOT NULL,
    "prize" TEXT NOT NULL,
    "won" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DrawRecord_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES "Registration" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Registration" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "zipcode" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'zh',
    "drawsUsed" INTEGER NOT NULL DEFAULT 0,
    "drawsMax" INTEGER NOT NULL DEFAULT 10,
    "iphoneStreak" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Registration" ("address", "createdAt", "id", "language", "name", "phone") SELECT "address", "createdAt", "id", "language", "name", "phone" FROM "Registration";
DROP TABLE "Registration";
ALTER TABLE "new_Registration" RENAME TO "Registration";
CREATE INDEX "Registration_phone_idx" ON "Registration"("phone");
CREATE INDEX "Registration_createdAt_idx" ON "Registration"("createdAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "DrawRecord_registrationId_idx" ON "DrawRecord"("registrationId");
