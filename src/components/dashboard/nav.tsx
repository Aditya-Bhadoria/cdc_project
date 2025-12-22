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
    <nav className="px-3 space-y-1">
      {links.map((link) => {
        const Icon = link.icon;
        
        // Check if active
        const isActive = link.href === "/dashboard" 
          ? pathname === "/dashboard"
          : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
              isActive
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20" // Active: Bright Blue & White Text
                : "text-slate-400 hover:bg-slate-800 hover:text-white"      // Inactive: Light Gray -> White on hover
            }`}
          >
            {/* Icon color logic */}
            <Icon size={20} className={isActive ? "text-indigo-100" : "group-hover:text-white transition-colors"} />
            <span className="font-medium text-sm">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}