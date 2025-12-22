"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, LayoutDashboard, Settings } from "lucide-react";

export function DashboardNav() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/inventory", label: "Inventory", icon: Package },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  return (
    <nav className="flex items-center gap-2">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = link.href === "/dashboard" 
          ? pathname === "/dashboard"
          : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
              isActive
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/20"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Icon size={18} className={isActive ? "text-indigo-100" : "text-gray-400 group-hover:text-white"} />
            <span>{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}