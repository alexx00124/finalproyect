/*
  Warnings:

  - You are about to drop the `Modulo` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `Asignatura` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Modulo";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Asignatura" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Asignatura" ("codigo", "createdAt", "id", "nombre") SELECT "codigo", "createdAt", "id", "nombre" FROM "Asignatura";
DROP TABLE "Asignatura";
ALTER TABLE "new_Asignatura" RENAME TO "Asignatura";
CREATE UNIQUE INDEX "Asignatura_codigo_key" ON "Asignatura"("codigo");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
