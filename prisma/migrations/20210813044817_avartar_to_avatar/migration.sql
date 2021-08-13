/*
  Warnings:

  - You are about to drop the column `avartar` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "avartar",
ADD COLUMN     "avatar" TEXT;
