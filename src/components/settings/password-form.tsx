"use client";

import { useState, useRef } from "react";
import { updatePassword } from "../../actions/user";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface PasswordFormProps {
  email: string;
}

export function PasswordForm({ email }: PasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    const result = await updatePassword(email, formData);
    
    if (result.success) {
      toast.success(result.message);
      formRef.current?.reset(); // Clear inputs on success
    } else {
      toast.error(result.message);
    }
    setIsLoading(false);
  };

  return (
    <form ref={formRef} action={handleSubmit} className="grid gap-4 max-w-xl">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
        <input 
          name="currentPassword"
          type="password" 
          required
          className="w-full p-2 border rounded-md text-gray-900 focus:ring-2 focus:ring-red-500 outline-none" 
          placeholder="Enter current password"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <input 
            name="newPassword"
            type="password" 
            required
            className="w-full p-2 border rounded-md text-gray-900 focus:ring-2 focus:ring-red-500 outline-none" 
            placeholder="Min 6 chars"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
          <input 
            name="confirmPassword"
            type="password" 
            required
            className="w-full p-2 border rounded-md text-gray-900 focus:ring-2 focus:ring-red-500 outline-none" 
            placeholder="Retype password"
          />
        </div>
      </div>

      <div className="pt-2">
        <button 
          type="submit" 
          disabled={isLoading}
          className="flex items-center gap-2 border border-red-200 bg-red-50 text-red-700 px-4 py-2 rounded-md hover:bg-red-100 transition-colors disabled:opacity-50 text-sm font-medium"
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          Update Password
        </button>
      </div>
    </form>
  );
}