"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PaymentMethod } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createSale(formData: FormData) {
  const user = await getCurrentUser();

  const buyerName = String(formData.get("buyerName"));
  const buyerPhoneRaw = formData.get("buyerPhone");

  const buyerPhone =
    buyerPhoneRaw && String(buyerPhoneRaw).trim() !== ""
      ? String(buyerPhoneRaw)
      : null;

  const isPayLater = formData.get("payLater") === "on";

  const paymentMethodRaw = formData.get("paymentMethod");

  let paymentMethod: PaymentMethod | null = null;

  if (!isPayLater && paymentMethodRaw) {
    paymentMethod = paymentMethodRaw as PaymentMethod;
  }

  const itemsRaw = JSON.parse(String(formData.get("items") || "[]"));

  if (!itemsRaw.length) {
    throw new Error("Cart is empty");
  }

  await prisma.$transaction(async (tx) => {
    let total = 0;

    const sale = await tx.sale.create({
      data: {
        userId: user.id,
        buyerName,
        buyerPhone,
        total: 0,
        isPaid: !isPayLater,
        paymentMethod,
      },
    });

    for (const item of itemsRaw) {
      const product = await tx.product.findUnique({
        where: { id: item.productId },
      });

      if (!product || product.quantity < item.quantity) {
        throw new Error("Insufficient stock");
      }

      const itemTotal = Number(product.price) * Number(item.quantity);

      total += itemTotal;

      await tx.saleItem.create({
        data: {
          saleId: sale.id,
          productId: product.id,
          quantity: Number(item.quantity),
          price: product.price,
        },
      });

      await tx.product.update({
        where: { id: product.id },
        data: {
          quantity: {
            decrement: Number(item.quantity),
          },
        },
      });
    }

    await tx.sale.update({
      where: { id: sale.id },
      data: { total },
    });
  });

  redirect("/sales");
}

export async function markAsPaid(formData: FormData) {
  const id = String(formData.get("id"));
  const paymentMethodRaw = formData.get("paymentMethod");

  await prisma.sale.update({
    where: { id },
    data: {
      isPaid: true,
      paymentMethod: paymentMethodRaw
        ? (paymentMethodRaw as PaymentMethod)
        : null,
    },
  });

  revalidatePath("/sales");
}
