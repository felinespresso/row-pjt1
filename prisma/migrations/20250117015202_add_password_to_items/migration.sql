/*
  Warnings:

  - Added the required column `password` to the `item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "item" ADD COLUMN     "password" TEXT NOT NULL;
