/*
  Warnings:

  - You are about to drop the `parkings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `vehicles` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('park', 'Retrieve');

-- CreateEnum
CREATE TYPE "parkingStatus" AS ENUM ('pending', 'active', 'in_progress', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'manager', 'driver', 'admin');

-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('Car', 'Bike', 'Cycle', 'Jeep', 'Bus', 'Truck', 'Van', 'Scooter', 'Auto', 'Tractor', 'Ambulance', 'FireTruck', 'PoliceCar');

-- DropForeignKey
ALTER TABLE "parkings" DROP CONSTRAINT "parkings_assignedDriverId_fkey";

-- DropForeignKey
ALTER TABLE "parkings" DROP CONSTRAINT "parkings_userId_fkey";

-- DropForeignKey
ALTER TABLE "parkings" DROP CONSTRAINT "parkings_vehicleId_fkey";

-- DropForeignKey
ALTER TABLE "vehicles" DROP CONSTRAINT "vehicles_ownerId_fkey";

-- DropTable
DROP TABLE "parkings";

-- DropTable
DROP TABLE "users";

-- DropTable
DROP TABLE "vehicles";

-- DropEnum
DROP TYPE "approval_status";

-- DropEnum
DROP TYPE "parking_status";

-- DropEnum
DROP TYPE "task_types";

-- DropEnum
DROP TYPE "user_roles";

-- DropEnum
DROP TYPE "vehicle_types";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'user',
    "approvalStatus" "ApprovalStatus" DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" TEXT NOT NULL,
    "vehicleName" TEXT NOT NULL,
    "vehicleNumber" TEXT NOT NULL,
    "ownerName" TEXT NOT NULL,
    "ownerId" TEXT,
    "vehicleType" "VehicleType" NOT NULL DEFAULT 'Car',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parking" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "assignedDriverId" TEXT,
    "location" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "parkingSlot" TEXT,
    "taskType" "TaskType" NOT NULL DEFAULT 'park',
    "assignedAt" TIMESTAMP(3),
    "entryTime" TIMESTAMP(3) NOT NULL,
    "exitTime" TIMESTAMP(3),
    "baseRate" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "serviceFee" DOUBLE PRECISION NOT NULL DEFAULT 30,
    "gst" DOUBLE PRECISION NOT NULL DEFAULT 20,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "status" "parkingStatus" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_vehicleNumber_key" ON "Vehicle"("vehicleNumber");

-- CreateIndex
CREATE UNIQUE INDEX "parking_ticketId_key" ON "parking"("ticketId");

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parking" ADD CONSTRAINT "parking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parking" ADD CONSTRAINT "parking_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parking" ADD CONSTRAINT "parking_assignedDriverId_fkey" FOREIGN KEY ("assignedDriverId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
