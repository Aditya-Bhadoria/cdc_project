import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().min(10, "Description must be at least 10 chars"),
  category: z.string().min(1, "Category is required"),

  price: z.number().min(0.01, "Price must be positive"),
  stock: z.number().int().min(0, "Stock cannot be negative"),
  sku: z.string().min(3, "SKU is required"),

  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]),
  imageUrl: z.string()
    .url("Must be a valid URL")
    .or(z.literal('')),
});

export type ProductFormData = z.infer<typeof productSchema>;