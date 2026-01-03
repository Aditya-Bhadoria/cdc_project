"use client";

import { useState } from "react";
import { updateProfile } from "../../actions/user";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface ProfileFormProps {
  initialName: string;
  email: string;
}

export function ProfileForm({ initialName, email }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { update } = useSession();

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    const newName = formData.get("name") as string; 
    
    const result = await updateProfile(formData);
    
    if (result.success) {
      await update({ name: newName });
      
      toast.success(result.message);
      router.refresh(); 
    } else {
      toast.error(result.message);
    }
    
    setIsLoading(false);
  };

  return (
    <form action={handleSubmit} className="grid gap-4 max-w-xl">
      <input type="hidden" name="currentEmail" value={email} />

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Display Name</label>
        <input 
          name="name"
          type="text" 
          defaultValue={initialName}
          required
          className="w-full p-2.5 border border-slate-700 bg-slate-950 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" 
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
        <input 
          name="email"
          type="email" 
          defaultValue={email}
          required
          className="w-full p-2.5 border border-slate-700 bg-slate-950 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" 
        />
        <p className="text-xs text-amber-500/80 mt-1">
          ⚠️ Changing this will require you to use the new email at next login.
        </p>
      </div>

      <div className="pt-2">
        <button 
          type="submit" 
          disabled={isLoading}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-500 transition-colors disabled:opacity-50 text-sm font-medium shadow-lg shadow-emerald-900/20"
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          Save Changes
        </button>
      </div>
    </form>
  );
}