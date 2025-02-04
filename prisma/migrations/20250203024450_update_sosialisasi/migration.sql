/*
  Warnings:

  - Added the required column `namaDesa` to the `Sosialisasi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spanTower` to the `Sosialisasi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sosialisasi" ADD COLUMN     "namaDesa" TEXT NOT NULL,
ADD COLUMN     "spanTower" TEXT NOT NULL;
