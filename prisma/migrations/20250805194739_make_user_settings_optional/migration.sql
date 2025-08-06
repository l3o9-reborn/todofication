/*
  Warnings:

  - You are about to drop the column `Bio` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "Bio",
ADD COLUMN     "bio" TEXT;

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL,
    "ae" BOOLEAN NOT NULL DEFAULT false,
    "at" TEXT NOT NULL DEFAULT '12:00 PM',
    "ne" BOOLEAN NOT NULL DEFAULT false,
    "nt" TEXT NOT NULL DEFAULT '08:00 PM',
    "userId" TEXT NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Settings_userId_key" ON "Settings"("userId");

-- AddForeignKey
ALTER TABLE "Settings" ADD CONSTRAINT "Settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
