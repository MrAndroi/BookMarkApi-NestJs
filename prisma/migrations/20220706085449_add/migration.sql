-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "role" "Role" NOT NULL DEFAULT E'USER';
