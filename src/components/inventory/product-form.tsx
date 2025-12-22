"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProduct, createProduct } from "../../actions/products";
import { Loader2, Save, X, ChevronLeft, Upload, Link as LinkIcon, FileImage } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface ProductFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export function ProductForm({ initialData, isEdit = false }: ProductFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [imageMode, setImageMode] = useState<"url" | "file">("url");
  
  // NEW: State to store the name of the file user picked
  const [fileName, setFileName] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);

    try {
      if (isEdit && initialData?.id) {
        await updateProduct(initialData.id, formData);
        toast.success("Product updated successfully");
      } else {
        await createProduct(formData);
        toast.success("Product created successfully");
      }
      router.push("/dashboard/inventory");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  // NEW: Helper to update file name when user picks a file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  return (
    <form onSubmit={onSubmit} className="max-w-4xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard/inventory"
            className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {isEdit ? "Edit Product" : "Create Product"}
            </h1>
            <p className="text-sm text-slate-400">
              {isEdit ? "Update existing inventory item" : "Add a new item to your store"}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard/inventory"
            className="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-sm font-medium"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-500 transition-colors flex items-center gap-2 text-sm font-medium shadow-lg shadow-emerald-900/20 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
            {isEdit ? "Save Changes" : "Create Item"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Basic Details */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-300">Product Name</label>
              <input 
                name="name" 
                defaultValue={initialData?.name} 
                required
                placeholder="e.g. Wireless Headphones"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500 outline-none placeholder:text-slate-600"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-300">Description</label>
              <textarea 
                name="description" 
                defaultValue={initialData?.description} 
                rows={4}
                placeholder="Product details..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500 outline-none placeholder:text-slate-600 resize-none"
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Pricing & Inventory</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-300">Price ($)</label>
                <input 
                  name="price" 
                  type="number" 
                  step="0.01"
                  defaultValue={initialData?.price} 
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-300">Current Stock</label>
                <input 
                  name="inventoryCount" 
                  type="number" 
                  defaultValue={initialData?.inventoryCount} 
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-300">SKU</label>
                <input 
                  name="sku" 
                  defaultValue={initialData?.sku} 
                  placeholder="Auto-generated if empty"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500 outline-none placeholder:text-slate-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          
          {/* Status */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Status</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-lg border border-slate-700 bg-slate-950 cursor-pointer hover:border-emerald-500 transition-colors">
                <span className="text-sm font-medium text-slate-200">Active</span>
                <input 
                  type="radio" 
                  name="status" 
                  value="ACTIVE" 
                  defaultChecked={initialData?.status === "ACTIVE" || !initialData}
                  className="accent-emerald-500 h-4 w-4" 
                />
              </label>
              <label className="flex items-center justify-between p-3 rounded-lg border border-slate-700 bg-slate-950 cursor-pointer hover:border-slate-500 transition-colors">
                <span className="text-sm font-medium text-slate-200">Draft</span>
                <input 
                  type="radio" 
                  name="status" 
                  value="DRAFT" 
                  defaultChecked={initialData?.status === "DRAFT"}
                  className="accent-slate-500 h-4 w-4" 
                />
              </label>
              <label className="flex items-center justify-between p-3 rounded-lg border border-slate-700 bg-slate-950 cursor-pointer hover:border-amber-500 transition-colors">
                <span className="text-sm font-medium text-slate-200">Archived</span>
                <input 
                  type="radio" 
                  name="status" 
                  value="ARCHIVED" 
                  defaultChecked={initialData?.status === "ARCHIVED"}
                  className="accent-amber-500 h-4 w-4" 
                />
              </label>
            </div>
          </div>

          {/* Category */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Category</h3>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-300">Product Category</label>
              <input
                list="categories"
                name="category"
                defaultValue={initialData?.category}
                placeholder="Type or select..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500 outline-none placeholder:text-slate-600"
              />
              <datalist id="categories">
                <option value="Electronics" />
                <option value="Furniture" />
                <option value="Clothing" />
                <option value="Groceries" />
                <option value="Fitness" />
                <option value="Wearables" />
                <option value="Accessories" />
              </datalist>
            </div>
          </div>
          
           {/* Image Card - FIXED: Custom File Input */}
           <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Product Image</h3>
            
            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button 
                type="button"
                onClick={() => setImageMode("url")}
                className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  imageMode === "url" ? "bg-slate-800 text-white shadow" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <LinkIcon size={14} /> Paste URL
              </button>
              <button 
                type="button"
                onClick={() => setImageMode("file")}
                className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  imageMode === "file" ? "bg-slate-800 text-white shadow" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Upload size={14} /> Upload File
              </button>
            </div>

            <div className="grid gap-2">
              {imageMode === "url" ? (
                <div className="space-y-2">
                   <label className="text-sm font-medium text-slate-300">Image URL</label>
                   <input 
                    name="image" 
                    defaultValue={initialData?.image} 
                    placeholder="https://..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                   />
                </div>
              ) : (
                <div className="space-y-2">
                   <label className="text-sm font-medium text-slate-300">Select File</label>
                   
                   {/* HIDDEN INPUT + CUSTOM LABEL */}
                   <div className="relative">
                     <input 
                       type="file" 
                       id="file-upload"
                       name="imageFile" 
                       accept="image/*"
                       className="hidden" // Hides the ugly default input
                       onChange={handleFileChange}
                     />
                     <label 
                       htmlFor="file-upload"
                       className="border-2 border-dashed border-slate-700 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:border-emerald-500 hover:bg-slate-800/50 transition-all cursor-pointer bg-slate-950/50 group"
                     >
                       {fileName ? (
                         // If file selected, show name + icon
                         <div className="flex flex-col items-center animate-in fade-in zoom-in duration-200">
                           <FileImage className="w-8 h-8 text-emerald-400 mb-2" />
                           <p className="text-sm font-medium text-emerald-400 break-all px-4">{fileName}</p>
                           <p className="text-xs text-slate-500 mt-1">Click to change</p>
                         </div>
                       ) : (
                         // Default State
                         <>
                           <Upload className="w-8 h-8 text-slate-500 mb-2 group-hover:text-emerald-400 transition-colors" />
                           <p className="text-sm font-medium text-slate-300">Click to upload</p>
                           <p className="text-xs text-slate-500 mt-1">SVG, PNG, JPG or GIF</p>
                         </>
                       )}
                     </label>
                   </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </form>
  );
}