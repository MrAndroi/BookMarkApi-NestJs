/*
  Warnings:

  - Added the required column `action` to the `RoleHistory` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RoleAction" AS ENUM ('FROM_USER_TO_ADMIN', 'FROM_ADMIN_TO_USER');

-- AlterTable
ALTER TABLE "RoleHistory" ADD COLUMN     "action" "RoleAction" NOT NULL;
