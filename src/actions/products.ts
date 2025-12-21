'use server'

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '../lib/db'; 
import { productSchema } from '../schemas/product'; 

export async function createProduct(formData: FormData) {
    console.log("Action Triggered: createProduct");
  const rawData = {
    name: formData.get('name'),
    description: formData.get('description'),
    price: formData.get('price'),
    stock: formData.get('stock'),
    category: formData.get('category'),
    imageUrl: formData.get('imageUrl'),
    sku: formData.get('sku'),
    status: formData.get('status'),
  };

  const validated = productSchema.safeParse(rawData);

  if (!validated.success) {
    console.error("Validation Failed:", validated.error.flatten().fieldErrors);
    return { 
      success: false, 
      errors: validated.error.flatten().fieldErrors 
    };
  }

  try {
    await db.product.create({
      data: {
        name: validated.data.name,
        description: validated.data.description,
        price: validated.data.price, 
        stock: validated.data.stock, 
        category: validated.data.category,
        imageUrl: validated.data.imageUrl || "",
        status: validated.data.status,
        sku: validated.data.sku
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, message: "Failed to create product" };
  }


  revalidatePath('/dashboard/products');
  redirect('/dashboard/products');
}

export async function getProducts() {
  try {
    const products = await db.product.findMany({
      orderBy: { createdAt: 'desc' }, 
    });
    return products;
  } catch (error) {
    console.error("Fetch Error:", error);
    return [];
  }
}

export async function getProductById(id: string) {
  try {
    const product = await db.product.findUnique({
      where: { id },
    });
    return product;
  } catch (error) {
    return null;
  }
}

export async function updateProduct(id: string, formData: FormData) {
  const rawData = {
    name: formData.get('name'),
    description: formData.get('description'),
    price: formData.get('price'),
    stock: formData.get('stock'),
    category: formData.get('category'),
    imageUrl: formData.get('imageUrl'),
    sku: formData.get('sku')
  };

  const validated = productSchema.safeParse(rawData);

  if (!validated.success) {
    return { success: false, errors: validated.error.flatten().fieldErrors };
  }

  try {
    await db.product.update({
      where: { id },
      data: validated.data,
    });
  } catch (error) {
    return { success: false, message: "Failed to update product" };
  }

  revalidatePath('/dashboard/products');
  redirect('/dashboard/products');
}

export async function deleteProduct(id: string) {
  try {
    await db.product.delete({
      where: { id },
    });
    
    revalidatePath('/dashboard/products');
    return { success: true };
  } catch (error) {
    return { success: false, message: "Failed to delete product" };
  }
}