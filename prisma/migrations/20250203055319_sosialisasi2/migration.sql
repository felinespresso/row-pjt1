/*
  Warnings:

  - Added the required column `identifikasiId` to the `Sosialisasi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sosialisasi" ADD COLUMN     "identifikasiId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Sosialisasi" ADD CONSTRAINT "Sosialisasi_identifikasiId_fkey" FOREIGN KEY ("identifikasiId") REFERENCES "Identifikasi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
