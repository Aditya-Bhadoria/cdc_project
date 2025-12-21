"use client";

import { CldUploadWidget } from "next-cloudinary";
import { ImagePlus, Trash } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
}

export default function ImageUpload({
  value,
  onChange,
  onRemove,
}: ImageUploadProps) {
  
  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {value && (
          <div className="relative w-[200px] h-[200px] rounded-md overflow-hidden border">
            <div className="z-10 absolute top-2 right-2">
              <button
                type="button"
                onClick={() => onRemove(value)}
                className="bg-red-500 text-white p-1 rounded-md shadow-sm hover:bg-red-600"
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>
             {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="object-cover w-full h-full" alt="Image" src={value} />
          </div>
        )}
      </div>
      
      <CldUploadWidget 
        onSuccess={onUpload} 
        uploadPreset="ecommerce_preset" 
      > 
        {({ open }) => {
          return (
            <button
              type="button"
              onClick={() => open()} 
              className="flex items-center gap-2 bg-gray-100 text-gray-600 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-200 transition"
            >
              <ImagePlus className="w-4 h-4" />
              Upload an Image
            </button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
}