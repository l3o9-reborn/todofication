/*
  Warnings:

  - You are about to drop the column `at` on the `Settings` table. All the data in the column will be lost.
  - You are about to drop the column `nt` on the `Settings` table. All the data in the column will be lost.
  - You are about to drop the column `timezone` on the `Settings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Settings" DROP COLUMN "at",
DROP COLUMN "nt",
DROP COLUMN "timezone";
