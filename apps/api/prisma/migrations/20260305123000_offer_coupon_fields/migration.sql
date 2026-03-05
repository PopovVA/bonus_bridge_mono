ALTER TABLE "Offer"
ADD COLUMN "previewText" TEXT,
ADD COLUMN "couponCode" TEXT;

UPDATE "Offer"
SET "previewText" = "title"
WHERE "previewText" IS NULL;

ALTER TABLE "Offer"
ALTER COLUMN "previewText" SET NOT NULL;
