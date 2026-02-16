"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "../auth";
import { prisma } from "../prisma";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  price: z.coerce.number().nonnegative("Price must be a non-negative number"),
  quantity: z.coerce
    .number()
    .int()
    .min(0, "Quantity must be a non-negative integer"),
  sku: z.string().optional(),
  lowStock: z.coerce.number().int().min(0).optional(),
});

export async function deleteProduct(formData: FormData) {
  const user = await getCurrentUser();

  const id = String(formData.get("id") || "");

  await prisma.product.deleteMany({
    where: {
      id,
      userId: user.id,
    },
  });
}

export async function addProduct(formData: FormData) {
  const user = await getCurrentUser();

  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    price: formData.get("price"),
    quantity: formData.get("quantity"),
    sku: formData.get("sku") || undefined,
    lowStock: formData.get("lowStock") || undefined,
  });

  if (!parsed.success) {
    throw new Error("Invalid product data: " + parsed.error.message);
  }

  try {
    await prisma.product.create({
      data: {
        ...parsed.data,
        userId: user.id,
      },
    });
    redirect("/inventory");
  } catch (error) {
    console.error("Error adding product:", error);
    throw new Error("Failed to add product. Please try again.");
  }
}
