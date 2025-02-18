-- CreateTable
CREATE TABLE "Pembayaran" (
    "id" TEXT NOT NULL,
    "identifikasiId" TEXT NOT NULL,
    "namaDesa" TEXT NOT NULL,
    "spanTower" TEXT NOT NULL,
    "bidangLahan" TEXT NOT NULL,
    "namaPemilik" TEXT NOT NULL,
    "tanggalPelaksanaan" TIMESTAMP(3) NOT NULL,
    "keterangan" TEXT NOT NULL DEFAULT '-',
    "evidenceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pembayaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvidencePembayaran" (
    "id" TEXT NOT NULL,
    "file" TEXT NOT NULL,
    "fileName" TEXT,
    "pembayaranId" TEXT NOT NULL,

    CONSTRAINT "EvidencePembayaran_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Pembayaran_identifikasiId_idx" ON "Pembayaran"("identifikasiId");

-- CreateIndex
CREATE INDEX "Pembayaran_evidenceId_idx" ON "Pembayaran"("evidenceId");

-- CreateIndex
CREATE INDEX "EvidencePembayaran_pembayaranId_idx" ON "EvidencePembayaran"("pembayaranId");

-- AddForeignKey
ALTER TABLE "Pembayaran" ADD CONSTRAINT "Pembayaran_identifikasiId_fkey" FOREIGN KEY ("identifikasiId") REFERENCES "Identifikasi"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pembayaran" ADD CONSTRAINT "Pembayaran_evidenceId_fkey" FOREIGN KEY ("evidenceId") REFERENCES "Evidences"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvidencePembayaran" ADD CONSTRAINT "EvidencePembayaran_pembayaranId_fkey" FOREIGN KEY ("pembayaranId") REFERENCES "Pembayaran"("id") ON DELETE CASCADE ON UPDATE CASCADE;
