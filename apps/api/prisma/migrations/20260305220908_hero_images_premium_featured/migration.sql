/*
  Warnings:

  - You are about to drop the `HeroSlide` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "HeroSlide";

-- CreateTable
CREATE TABLE "HeroImage" (
    "id" UUID NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HeroImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PremiumBanner" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priceText" TEXT NOT NULL,
    "priceNote" TEXT,
    "ctaText" TEXT NOT NULL,
    "ctaHref" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PremiumBanner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeaturedStore" (
    "id" UUID NOT NULL,
    "storeId" UUID NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeaturedStore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeaturedOffer" (
    "id" UUID NOT NULL,
    "offerId" UUID NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeaturedOffer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HeroImage_sortOrder_idx" ON "HeroImage"("sortOrder");

-- CreateIndex
CREATE INDEX "FeaturedStore_sortOrder_idx" ON "FeaturedStore"("sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "FeaturedStore_storeId_key" ON "FeaturedStore"("storeId");

-- CreateIndex
CREATE INDEX "FeaturedOffer_sortOrder_idx" ON "FeaturedOffer"("sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "FeaturedOffer_offerId_key" ON "FeaturedOffer"("offerId");

-- AddForeignKey
ALTER TABLE "FeaturedStore" ADD CONSTRAINT "FeaturedStore_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeaturedOffer" ADD CONSTRAINT "FeaturedOffer_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
