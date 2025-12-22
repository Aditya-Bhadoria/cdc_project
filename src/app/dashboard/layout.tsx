import { DashboardNav } from "../../components/dashboard/nav"; 
import { Store, User } from "lucide-react"; 

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // CHANGED: flex-col makes the layout vertical (Header Top, Content Bottom)
    <div className="min-h-screen flex flex-col bg-gray-50">
      
      {/* TOP NAVIGATION BAR */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Left: Logo & Nav Links */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <div className="flex items-center gap-2 text-indigo-400">
              <Store className="w-6 h-6" />
              <span className="font-bold text-lg text-white tracking-wide">NexusStore</span>
            </div>

            {/* Navigation Links (Hidden on very small screens if needed) */}
            <div className="hidden md:block">
              <DashboardNav />
            </div>
          </div>

          {/* Right: User Profile (Compact Version) */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end hidden sm:block">
              <span className="text-sm font-medium text-white">Admin User</span>
              <span className="text-xs text-slate-400">admin@example.com</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white">
              <User size={16} />
            </div>
          </div>

        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      {/* Centered container with padding */}
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}