'use server'

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '../lib/db'; 
import { productSchema } from '../schemas/product'; 

export async function createProduct(formData: FormData) {
  console.log("Action Triggered: createProduct");
  
  // 1. Extract data using NEW names
  const rawData = {
    name: formData.get('name'),
    description: formData.get('description'),
    price: formData.get('price'),
    inventoryCount: formData.get('inventoryCount'), // RENAMED
    category: formData.get('category'),
    image: formData.get('image'),                   // RENAMED
    sku: formData.get('sku'),
    status: formData.get('status'),
  };

  // 2. Validate
  const validated = productSchema.safeParse(rawData);

  if (!validated.success) {
    console.error("Validation Failed:", validated.error.flatten().fieldErrors);
    return { 
      success: false, 
      errors: validated.error.flatten().fieldErrors 
    };
  }

  // 3. Save to Database
  try {
    await db.product.create({
      data: {
        name: validated.data.name,
        description: validated.data.description,
        price: validated.data.price, 
        inventoryCount: validated.data.inventoryCount, // RENAMED
        category: validated.data.category,
        image: validated.data.image || "",             // RENAMED
        status: validated.data.status,
        sku: validated.data.sku
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, message: "Failed to create product" };
  }

  // 4. Update the UI
  // Note: We changed this path to 'inventory' to match your new project structure
  revalidatePath('/dashboard/inventory');
  redirect('/dashboard/inventory');
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
    inventoryCount: formData.get('inventoryCount'), // RENAMED
    category: formData.get('category'),
    image: formData.get('image'),                   // RENAMED
    sku: formData.get('sku'),
    status: formData.get('status'), // Don't forget status in update!
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

  revalidatePath('/dashboard/inventory');
  redirect('/dashboard/inventory');
}

export async function deleteProduct(id: string) {
  try {
    await db.product.delete({
      where: { id },
    });
    
    revalidatePath('/dashboard/inventory');
    return { success: true };
  } catch (error) {
    return { success: false, message: "Failed to delete product" };
  }
}