/*
  Warnings:

  - The values [PENDING] on the enum `BookingStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `eventTypeId` on the `Availability` table. All the data in the column will be lost.
  - You are about to drop the column `bufferAfterMin` on the `EventType` table. All the data in the column will be lost.
  - You are about to drop the column `bufferBeforeMin` on the `EventType` table. All the data in the column will be lost.
  - You are about to drop the column `maxNoticeDays` on the `EventType` table. All the data in the column will be lost.
  - You are about to drop the column `minNoticeMinutes` on the `EventType` table. All the data in the column will be lost.
  - You are about to drop the column `visibility` on the `EventType` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BookingStatus_new" AS ENUM ('CONFIRMED', 'CANCELED');
ALTER TABLE "public"."Booking" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Booking" ALTER COLUMN "status" TYPE "BookingStatus_new" USING ("status"::text::"BookingStatus_new");
ALTER TYPE "BookingStatus" RENAME TO "BookingStatus_old";
ALTER TYPE "BookingStatus_new" RENAME TO "BookingStatus";
DROP TYPE "public"."BookingStatus_old";
ALTER TABLE "Booking" ALTER COLUMN "status" SET DEFAULT 'CONFIRMED';
COMMIT;

-- DropForeignKey
ALTER TABLE "Availability" DROP CONSTRAINT "Availability_eventTypeId_fkey";

-- DropIndex
DROP INDEX "Availability_userId_dayOfWeek_idx";

-- DropIndex
DROP INDEX "Booking_eventTypeId_startTime_idx";

-- DropIndex
DROP INDEX "Booking_guestEmail_startTime_idx";

-- DropIndex
DROP INDEX "Booking_hostId_startTime_idx";

-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
ALTER TABLE "Availability" DROP COLUMN "eventTypeId";

-- AlterTable
ALTER TABLE "EventType" DROP COLUMN "bufferAfterMin",
DROP COLUMN "bufferBeforeMin",
DROP COLUMN "maxNoticeDays",
DROP COLUMN "minNoticeMinutes",
DROP COLUMN "visibility";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "username",
ALTER COLUMN "timeZone" SET DEFAULT 'UTC';

-- DropEnum
DROP TYPE "EventTypeVisibility";
