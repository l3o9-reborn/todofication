-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Completed', 'Due');

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'Due';
