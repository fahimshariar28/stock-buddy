-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('Cash', 'BKash', 'Nagad', 'Rocket', 'BankTransfer');

-- AlterTable
ALTER TABLE "Sale" ADD COLUMN     "isPaid" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "paymentMethod" "PaymentMethod";
