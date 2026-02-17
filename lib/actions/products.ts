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

  // For single delete
  const singleId = formData.get("id");

  // For bulk delete
  const multipleIds = formData.getAll("ids") as string[];

  let ids: string[] = [];

  if (singleId) {
    ids = [String(singleId)];
  } else if (multipleIds.length > 0) {
    ids = multipleIds;
  }

  if (!ids.length) return;

  await prisma.product.deleteMany({
    where: {
      id: { in: ids },
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
  } catch (error) {
    console.error("Error adding product:", error);
    throw new Error("Failed to add product. Please try again.");
  }

  redirect("/inventory");
}

export async function updateProduct(id: string, formData: FormData) {
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
    await prisma.product.update({
      where: {
        id,
        userId: user.id,
      },
      data: parsed.data,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error("Failed to update product. Please try again.");
  }

  redirect("/inventory");
}
