-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'SALES');

-- CreateEnum
CREATE TYPE "Segment" AS ENUM ('B2G', 'B2B');

-- CreateEnum
CREATE TYPE "ActivityStatus" AS ENUM ('NOT_VISITED', 'VISITED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'SALES',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entity" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "segment" "Segment" NOT NULL,
    "region" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Entity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "salesId" TEXT NOT NULL,
    "segment" "Segment" NOT NULL,
    "visitDate" DATE NOT NULL,
    "status" "ActivityStatus" NOT NULL DEFAULT 'NOT_VISITED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisitHistory" (
    "id" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "changedBy" TEXT NOT NULL,
    "oldStatus" "ActivityStatus" NOT NULL,
    "newStatus" "ActivityStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VisitHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Entity_name_idx" ON "Entity"("name");

-- CreateIndex
CREATE INDEX "Entity_segment_idx" ON "Entity"("segment");

-- CreateIndex
CREATE INDEX "Activity_visitDate_idx" ON "Activity"("visitDate");

-- CreateIndex
CREATE INDEX "Activity_status_segment_idx" ON "Activity"("status", "segment");

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "Entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_salesId_fkey" FOREIGN KEY ("salesId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisitHistory" ADD CONSTRAINT "VisitHistory_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisitHistory" ADD CONSTRAINT "VisitHistory_changedBy_fkey" FOREIGN KEY ("changedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
