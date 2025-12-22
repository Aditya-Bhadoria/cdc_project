"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, LayoutDashboard, Settings } from "lucide-react";

export function DashboardNav() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    // FIXED: Changed path to '/inventory' and label to 'Inventory'
    { href: "/dashboard/inventory", label: "Inventory", icon: Package },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  return (
    <nav className="px-4 space-y-2">
      {links.map((link) => {
        const Icon = link.icon;
        // Logic to determine if this tab is active
        const isActive = link.href === "/dashboard" 
          ? pathname === "/dashboard"
          : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive
                ? "bg-indigo-50 text-indigo-600" // Updated color to match your new theme
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <Icon size={20} />
            <span className="font-medium">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}