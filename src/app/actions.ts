"use server";

import { productSchema, ProductFormData } from "../lib/schemas";
import { db } from "../lib/db"; 
import { revalidatePath } from "next/cache";

export async function createProductAction(data: ProductFormData) {
  const result = productSchema.safeParse(data);
  
  if (!result.success) {
    console.error("abc");
    return { success: false, error: result.error.format() };
  }

  try {
    await db.product.create({
      data: result.data,
    });
    return { success: true };
  } catch (e) {
    console.log(e);
    return { success: false, error: "Database error" };
  }
}

export async function deleteProduct(id: string) {
  try {
    await db.product.delete({
      where: { id },
    });
    
    revalidatePath('/dashboard/products');
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete product:", error);
    return { success: false, message: "Failed to delete product" };
  }
}

export async function updateProductAction(id: string, data: ProductFormData) {
  const result = productSchema.safeParse(data);

  if (!result.success) {
    return { success: false, error: result.error.format() };
  }

  const { sku, ...productData } = result.data as any;

  try {
    await db.product.update({
      where: { id },
      data: {
        ...productData,
        imageUrl: productData.imageUrl || "",
      },
    });
  } catch (e: any) {
    return { success: false, error: "Database Error: Failed to Update Product" };
  }

  revalidatePath("/dashboard/products");
  revalidatePath(`/dashboard/products/${id}/edit`);
  return { success: true };
}