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
    // Increased container padding (px-4) and vertical spacing (space-y-3)
    <nav className="px-4 space-y-3">
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
            // SPACIOUS STYLING:
            // 1. px-4 py-3: Bigger click area
            // 2. gap-4: More space between icon and text
            // 3. text-base: Slightly larger text
            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
              isActive
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20 translate-x-1" // Active: Bright & slightly shifted right
                : "text-gray-300 hover:bg-slate-800 hover:text-white hover:translate-x-1" // Inactive: Light gray -> White on hover
            }`}
          >
            <Icon size={22} className={isActive ? "text-indigo-100" : "text-gray-400 group-hover:text-white transition-colors"} />
            <span className="font-medium text-base tracking-wide">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}