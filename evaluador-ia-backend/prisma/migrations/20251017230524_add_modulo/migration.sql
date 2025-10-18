-- CreateTable
CREATE TABLE "Modulo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "asignaturaId" TEXT NOT NULL,
    CONSTRAINT "Modulo_asignaturaId_fkey" FOREIGN KEY ("asignaturaId") REFERENCES "Asignatura" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Modulo_asignaturaId_idx" ON "Modulo"("asignaturaId");
