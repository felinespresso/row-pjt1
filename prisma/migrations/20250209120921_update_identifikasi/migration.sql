/*
  Warnings:

  - You are about to drop the column `bibit` on the `jenistanaman` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Evidences" ADD COLUMN     "bidangLahan" TEXT;

-- AlterTable
ALTER TABLE "inventarisasi" ADD COLUMN     "pekerjaan" TEXT NOT NULL DEFAULT '-';

-- AlterTable
ALTER TABLE "jenistanaman" DROP COLUMN "bibit";
