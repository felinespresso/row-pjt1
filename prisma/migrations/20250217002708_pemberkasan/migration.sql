-- CreateTable
CREATE TABLE "Pemberkasan" (
    "id" TEXT NOT NULL,
    "identifikasiId" TEXT NOT NULL,
    "namaDesa" TEXT NOT NULL,
    "spanTower" TEXT NOT NULL,
    "bidangLahan" TEXT NOT NULL,
    "namaPemilik" TEXT NOT NULL,
    "tanggalPelaksanaan" TIMESTAMP(3) NOT NULL,
    "keterangan" TEXT NOT NULL DEFAULT '-',
    "ktp" TEXT,
    "kartukeluarga" TEXT,
    "alashak" TEXT,
    "evidenceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pemberkasan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Pemberkasan_identifikasiId_idx" ON "Pemberkasan"("identifikasiId");

-- CreateIndex
CREATE INDEX "Pemberkasan_evidenceId_idx" ON "Pemberkasan"("evidenceId");

-- AddForeignKey
ALTER TABLE "Pemberkasan" ADD CONSTRAINT "Pemberkasan_identifikasiId_fkey" FOREIGN KEY ("identifikasiId") REFERENCES "Identifikasi"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pemberkasan" ADD CONSTRAINT "Pemberkasan_evidenceId_fkey" FOREIGN KEY ("evidenceId") REFERENCES "Evidences"("id") ON DELETE CASCADE ON UPDATE CASCADE;
