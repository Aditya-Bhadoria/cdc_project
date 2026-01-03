"use client";

import { useSession } from "next-auth/react";
import { User } from "lucide-react";

export function UserProfile() {
  const { data: session } = useSession();

  const name = session?.user?.name || "Admin User";
  const email = session?.user?.email || "admin@example.com";

  return (
    <div className="flex items-center gap-3">
      <div className="hidden sm:flex flex-col items-end">
        <span className="text-sm font-medium text-white">
          {name}
        </span>
        <span className="text-xs text-slate-400">
          {email}
        </span>
      </div>
      <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center text-white">
        <User size={16} />
      </div>
    </div>
  );
}