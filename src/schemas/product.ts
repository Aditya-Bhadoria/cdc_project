import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  
  description: z.string().min(10, "Description must be at least 10 characters"),
  
  price: z.coerce.number()
    .min(0.01, "Price must be greater than 0")
    .positive("Price must be positive"),
    
  stock: z.coerce.number()
    .int("Stock must be a whole number")
    .min(0, "Stock cannot be negative"),
    
  category: z.string().min(1, "Please select a category"),
  
  imageUrl: z.string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal('')), 
  
  sku: z.string().min(3, "SKU is required"),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]),
});

export type ProductFormValues = z.infer<typeof productSchema>;