"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod"; // Import z directly
import { productSchema } from "../schemas/product"; 
import { createProduct, updateProduct } from "../actions/products"; 
import { CheckCircle2, ChevronRight, ChevronLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import ImageUpload from "../components/image-upload";
import { toast } from "sonner";

// FIX 1: Infer the type strictly from the schema so they never mismatch
type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: any; 
  productId?: string; 
  categories?: string[];
}

const steps = [
  { id: 1, name: "Basics", fields: ["name", "description", "category"] },
  { id: 2, name: "Pricing", fields: ["price", "inventoryCount", "sku"] },
  { id: 3, name: "Media", fields: ["image"] }, 
  { id: 4, name: "Review", fields: ["status"] },
];

export default function ProductForm({ initialData, productId, categories = [] }: ProductFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const isEditMode = !!initialData; 

  // FIX 2: Removed <ProductFormValues> generic. 
  // We let the 'resolver' tell the form what the types are automatically.
  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      description: initialData.description,
      category: initialData.category,
      price: Number(initialData.price),
      inventoryCount: initialData.inventoryCount, 
      sku: initialData.sku,
      status: initialData.status,
      image: initialData.image || "", 
    } : {
      name: "",
      description: "",
      category: "",
      price: 0,
      inventoryCount: 0, 
      sku: "",
      status: "DRAFT",
      image: "", 
    },
  });

  const imageValue = watch("image");

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

  const onSubmit = async (data: any) => { // Type as 'any' to avoid strict checks on submission
    if (isLoading) return;
    setIsLoading(true);
    
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("price", data.price.toString());
    formData.append("inventoryCount", data.inventoryCount.toString()); 
    formData.append("sku", data.sku);
    formData.append("status", data.status);
    formData.append("image", data.image || ""); 

    let result: any;
    if (isEditMode && productId) {
      result = await updateProduct(productId, formData);
    } else {
      result = await createProduct(formData);
    }

    if (result?.success) { 
      toast.success("Inventory saved successfully!");
      router.push("/dashboard/inventory");
    } else {
      setIsLoading(false);
      const errorMessage = typeof result?.error === "string" 
        ? result.error 
        : "Failed to save product";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-sm border p-8">
      
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold text-gray-800">
            {isEditMode ? "Edit Inventory Item" : "Add New Inventory"}
        </h2>
      </div>

      <div className="flex justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${
                index <= currentStep
                  ? "bg-indigo-600 text-white" 
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
          toast.error("Please check previous steps for errors.");
        })} 
        className="space-y-6"
      >
        
        {currentStep === 0 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
              <input {...register("name")} className="w-full p-2 border rounded-md text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500" />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message as string}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea {...register("description")} className="w-full p-2 border rounded-md text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500" rows={3} />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message as string}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input 
                {...register("category")} 
                list="category-list" 
                className="w-full p-2 border rounded-md text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500" 
                placeholder="Select or type a new category..." 
                autoComplete="off"
              />
              <datalist id="category-list">
                {categories.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message as string}</p>}
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                <input type="number" step="0.01" {...register("price", { valueAsNumber: true })} className="w-full p-2 border rounded-md text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500" />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message as string}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Inventory Count</label>
                <input type="number" {...register("inventoryCount", { valueAsNumber: true })} className="w-full p-2 border rounded-md text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500" />
                {errors.inventoryCount && <p className="text-red-500 text-sm mt-1">{errors.inventoryCount.message as string}</p>}
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU (Stock Keeping Unit)</label>
                <input 
                  {...register("sku")} 
                  className="w-full p-2 border rounded-md uppercase text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500" 
                  placeholder="GEN-TSHIRT-001"
                />
                {errors.sku && <p className="text-red-500 text-sm mt-1">{errors.sku.message as string}</p>}
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">Product Image</label>
              
              <ImageUpload
                value={imageValue ? imageValue : ""}
                onChange={(url) => {
                    setValue("image", url); 
                    trigger("image"); 
                }}
                onRemove={() => setValue("image", "")}
              />
              
              {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message as string}</p>}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="bg-indigo-50 p-4 rounded-md border border-indigo-100 text-sm text-indigo-800">
              <p>You are about to {isEditMode ? "update this item" : "create a new inventory item"}.</p>
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
               <div className="flex gap-4">
                 {["DRAFT", "ACTIVE", "ARCHIVED"].map((status) => (
                    <label key={status} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" value={status} {...register("status")} className="text-indigo-600 focus:ring-indigo-500" /> 
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
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
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
              {isEditMode ? "Update Inventory" : "Save Inventory"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}