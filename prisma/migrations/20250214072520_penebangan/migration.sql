-- CreateTable
CREATE TABLE "Penebangan" (
    "id" TEXT NOT NULL,
    "identifikasiId" TEXT NOT NULL,
    "namaDesa" TEXT NOT NULL,
    "spanTower" TEXT NOT NULL,
    "bidangLahan" TEXT NOT NULL,
    "namaPemilik" TEXT NOT NULL,
    "tanggalPelaksanaan" TIMESTAMP(3) NOT NULL,
    "keterangan" TEXT NOT NULL DEFAULT '-',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Penebangan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvidencePenebangan" (
    "id" TEXT NOT NULL,
    "file" TEXT NOT NULL,
    "fileName" TEXT,
    "penebanganId" TEXT NOT NULL,

    CONSTRAINT "EvidencePenebangan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Penebangan_identifikasiId_idx" ON "Penebangan"("identifikasiId");

-- CreateIndex
CREATE INDEX "EvidencePenebangan_penebanganId_idx" ON "EvidencePenebangan"("penebanganId");

-- AddForeignKey
ALTER TABLE "Penebangan" ADD CONSTRAINT "Penebangan_identifikasiId_fkey" FOREIGN KEY ("identifikasiId") REFERENCES "Identifikasi"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvidencePenebangan" ADD CONSTRAINT "EvidencePenebangan_penebanganId_fkey" FOREIGN KEY ("penebanganId") REFERENCES "Penebangan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
