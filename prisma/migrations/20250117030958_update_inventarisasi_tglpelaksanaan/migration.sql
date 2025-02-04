/*
  Warnings:

  - Added the required column `pelaksanaan` to the `inventarisasi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "inventarisasi" ADD COLUMN     "pelaksanaan" TIMESTAMP(3) NOT NULL;
