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
      formRef.current?.reset();
    } else {
      toast.error(result.message);
    }
    setIsLoading(false);
  };

  return (
    <form ref={formRef} action={handleSubmit} className="grid gap-4 max-w-xl">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Current Password</label>
        <input 
          name="currentPassword"
          type="password" 
          required
          className="w-full p-2.5 border border-slate-700 bg-slate-950 rounded-lg text-white placeholder-slate-600 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
          placeholder="Enter current password"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">New Password</label>
          <input 
            name="newPassword"
            type="password" 
            required
            className="w-full p-2.5 border border-slate-700 bg-slate-950 rounded-lg text-white placeholder-slate-600 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
            placeholder="Min 6 chars"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Confirm New Password</label>
          <input 
            name="confirmPassword"
            type="password" 
            required
            className="w-full p-2.5 border border-slate-700 bg-slate-950 rounded-lg text-white placeholder-slate-600 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
            placeholder="Retype password"
          />
        </div>
      </div>

      <div className="pt-2">
        <button 
          type="submit" 
          disabled={isLoading}
          className="flex items-center gap-2 border border-rose-900/50 bg-rose-500/10 text-rose-400 px-4 py-2 rounded-lg hover:bg-rose-500/20 transition-colors disabled:opacity-50 text-sm font-medium"
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          Update Password
        </button>
      </div>
    </form>
  );
}