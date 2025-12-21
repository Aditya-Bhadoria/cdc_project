"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, ProductFormData } from "../lib/schemas";
import { createProductAction, updateProductAction } from "../app/actions"; 
import { CheckCircle2, ChevronRight, ChevronLeft, Loader2, Image as ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import ImageUpload from "../components/image-upload";
import { toast } from "sonner";

interface ProductFormProps {
  initialData?: any; 
  productId?: string; 
  categories?: string[];
}

const steps = [
  { id: 1, name: "Basics", fields: ["name", "description", "category"] },
  { id: 2, name: "Pricing", fields: ["price", "stock", "sku"] },
  { id: 3, name: "Media", fields: ["imageUrl"] },
  { id: 4, name: "Review", fields: ["status"] },
];

export default function ProductForm({ initialData, productId, categories = [] }: ProductFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const isEditMode = !!initialData; 

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      description: initialData.description,
      category: initialData.category,
      price: initialData.price,
      stock: initialData.stock,
      sku: initialData.sku,
      status: initialData.status,
      imageUrl: initialData.imageUrl || "",
    } : {
      name: "",
      description: "",
      category: "",
      price: 0,
      stock: 0,
      sku: "",
      status: "DRAFT",
      imageUrl: "",
    },
  });

  const imageUrlValue = watch("imageUrl");

  const next = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); 

    const fields = steps[currentStep].fields;
    const isValid = await trigger(fields as any);
    if (isValid) setCurrentStep((prev) => prev + 1);
  };

  const prev = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); 
    setCurrentStep((prev) => prev - 1);
  };

  const onSubmit = async (data: ProductFormData) => {
    if (isLoading) return;
    setIsLoading(true);
    
    let result;
    if (isEditMode && productId) {
      result = await updateProductAction(productId, data);
    } else {
      result = await createProductAction(data);
    }

    

    if (result.success) {
      toast.success("Product saved successfully!");
      router.push("/dashboard/products");
    } else {
      setIsLoading(false);
      const errorMessage =
      typeof result.error === "string"
        ? result.error
        : result.error?._errors?.[0] ?? "Failed to save product";
      toast.error(errorMessage);
    }
  };

  

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-sm border p-8">
      
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold text-gray-800">
            {isEditMode ? "Edit Product" : "Create New Product"}
        </h2>
      </div>

      <div className="flex justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${
                index <= currentStep
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {index < currentStep ? <CheckCircle2 className="w-5 h-5" /> : step.id}
            </div>
            <span className={`hidden sm:block text-sm ${index <= currentStep ? "text-gray-900" : "text-gray-400"}`}>
              {step.name}
            </span>
            {index < steps.length - 1 && <div className="w-6 sm:w-12 h-[1px] bg-gray-200 mx-2" />}
          </div>
        ))}
      </div>

      <form 
  onSubmit={handleSubmit(onSubmit, (errors) => {
    
    console.log("FORM VALIDATION FAILED:", errors);
    alert("Please check previous steps for errors.");
  })} 
  className="space-y-6"
>
        
        {currentStep === 0 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input {...register("name")} className="w-full p-2 border rounded-md text-gray-900 placeholder:text-gray-400" />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea {...register("description")} className="w-full p-2 border rounded-md text-gray-900 placeholder:text-gray-400" rows={3} />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input 
                {...register("category")} 
                list="category-list" 
                className="w-full p-2 border rounded-md text-gray-900 placeholder:text-gray-400" 
                placeholder="Select or type a new category..." 
                autoComplete="off"
              />
              <datalist id="category-list">
                {categories.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                <input type="number" step="0.01" {...register("price", { valueAsNumber: true })} className="w-full p-2 border rounded-md text-gray-900 placeholder:text-gray-400" />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                <input type="number" {...register("stock", { valueAsNumber: true })} className="w-full p-2 border rounded-md text-gray-900 placeholder:text-gray-400" />
                {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                <input 
                  {...register("sku")} 
                  className="w-full p-2 border rounded-md uppercase text-gray-900 placeholder:text-gray-400" 
                  placeholder="GEN-TSHIRT-001"
                />
                {errors.sku && <p className="text-red-500 text-sm mt-1">{errors.sku.message}</p>}
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">Product Image</label>
              
              <ImageUpload
                value={imageUrlValue ? imageUrlValue : ""}
                onChange={(url) => {
                    setValue("imageUrl", url); 
                    trigger("imageUrl"); 
                }}
                onRemove={() => setValue("imageUrl", "")}
              />
              
              {errors.imageUrl && <p className="text-red-500 text-sm mt-1">{errors.imageUrl.message}</p>}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="bg-blue-50 p-4 rounded-md border border-blue-100 text-sm text-blue-800">
              <p>You are about to {isEditMode ? "update this product" : "create a new product"}.</p>
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
               <div className="flex gap-4">
                 {["DRAFT", "ACTIVE", "ARCHIVED"].map((status) => (
                    <label key={status} className="flex items-center gap-2">
                        <input type="radio" value={status} {...register("status")} /> 
                        <span className="text-sm capitalize">{status.toLowerCase()}</span>
                    </label>
                 ))}
               </div>
            </div>
          </div>
        )}

        <div className="flex justify-between pt-4 border-t">
          <button
            type="button"
            onClick={prev}
            disabled={currentStep === 0}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4 inline mr-1" /> Back
          </button>
          
          {currentStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={next}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Next Step <ChevronRight className="w-4 h-4 inline ml-1" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 flex items-center gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEditMode ? "Update Product" : "Create Product"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}