// FIXED: Importing from 'nav' instead of 'sidenav'
import { DashboardNav } from "../../components/dashboard/nav"; 
import { Store } from "lucide-react"; 

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* SIDEBAR - Dark Slate Background */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col fixed inset-y-0 z-50">
        
        {/* Logo Section */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <div className="flex items-center gap-2 text-indigo-400">
            <Store className="w-6 h-6" />
            <span className="font-bold text-lg text-white tracking-wide">NexusStore</span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-6">
          <DashboardNav />
        </div>

        {/* User Footer */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/50">
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold">
              AU
            </div>
            <div>
              <p className="text-sm font-medium text-white">Admin User</p>
              <p className="text-xs text-slate-400">admin@example.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 md:ml-64 bg-gray-50">
        {children}
      </main>
    </div>
  );
}