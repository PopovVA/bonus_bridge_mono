-- DropForeignKey
ALTER TABLE "Offer" DROP CONSTRAINT IF EXISTS "Offer_countryId_fkey";

-- DropIndex
DROP INDEX IF EXISTS "Offer_countryId_idx";

-- AlterTable
ALTER TABLE "Offer" DROP COLUMN "countryId";

-- AlterTable
ALTER TABLE "Service" RENAME COLUMN "logoUrl" TO "logoSvg";

-- DropTable
DROP TABLE "Country";
