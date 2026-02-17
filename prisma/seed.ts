import { PrismaClient, PaymentMethod } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

const DEMO_USER_ID = "13c6f9e6-9487-4979-82b5-ac3c7ed45913";

async function main() {
  console.log("🌱 Seeding powerful demo dataset...");

  // =============================
  // CLEAN OLD DATA
  // =============================

  await prisma.saleItem.deleteMany({
    where: { sale: { userId: DEMO_USER_ID } },
  });

  await prisma.sale.deleteMany({
    where: { userId: DEMO_USER_ID },
  });

  await prisma.product.deleteMany({
    where: { userId: DEMO_USER_ID },
  });

  // =============================
  // CREATE PRODUCTS
  // =============================

  const products = [];

  for (let i = 0; i < 40; i++) {
    const price = faker.number.int({ min: 300, max: 5000 });

    let quantity = faker.number.int({ min: 10, max: 80 });

    // 🔥 Make some products low stock
    if (i < 5) {
      quantity = faker.number.int({ min: 1, max: 5 });
    }

    // 🔥 Make some products out of stock
    if (i >= 5 && i < 8) {
      quantity = 0;
    }

    const product = await prisma.product.create({
      data: {
        userId: DEMO_USER_ID,
        name: faker.commerce.productName(),
        sku: faker.string.uuid(),
        price,
        quantity,
        lowStock: 5,
      },
    });

    products.push(product);
  }

  console.log("✅ Products created");

  // =============================
  // CREATE SALES (Jan 2026 → Dec 2027)
  // =============================

  const startDate = new Date(2026, 0, 1); // Jan 1, 2026
  const endDate = new Date(2027, 11, 31); // Dec 31, 2027

  const totalSalesToGenerate = 600; // 500+ sales

  for (let i = 0; i < totalSalesToGenerate; i++) {
    const randomDate = faker.date.between({
      from: startDate,
      to: endDate,
    });

    const isPaid = faker.datatype.boolean({ probability: 0.75 });
    // 75% paid, 25% unpaid

    const paymentMethod = isPaid
      ? faker.helpers.weightedArrayElement([
          { value: PaymentMethod.BKash, weight: 40 },
          { value: PaymentMethod.Cash, weight: 30 },
          { value: PaymentMethod.Nagad, weight: 15 },
          { value: PaymentMethod.Rocket, weight: 10 },
          { value: PaymentMethod.BankTransfer, weight: 5 },
        ])
      : null;

    const sale = await prisma.sale.create({
      data: {
        userId: DEMO_USER_ID,
        buyerName: faker.person.fullName(),
        buyerPhone: `01${faker.number.int({ min: 300000000, max: 999999999 })}`,
        total: 0,
        isPaid,
        paymentMethod,
        createdAt: randomDate,
      },
    });

    let total = 0;

    const itemCount = faker.number.int({ min: 1, max: 5 });

    for (let j = 0; j < itemCount; j++) {
      const product =
        products[faker.number.int({ min: 0, max: products.length - 1 })];

      const qty = faker.number.int({ min: 1, max: 4 });

      await prisma.saleItem.create({
        data: {
          saleId: sale.id,
          productId: product.id,
          quantity: qty,
          price: product.price,
        },
      });

      total += Number(product.price) * qty;
    }

    await prisma.sale.update({
      where: { id: sale.id },
      data: { total },
    });
  }

  console.log("🚀 600 Sales generated successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
