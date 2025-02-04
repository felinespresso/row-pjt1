/*
  Warnings:

  - You are about to drop the column `identifikasiId` on the `Sosialisasi` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Sosialisasi" DROP CONSTRAINT "Sosialisasi_identifikasiId_fkey";

-- AlterTable
ALTER TABLE "Sosialisasi" DROP COLUMN "identifikasiId";
