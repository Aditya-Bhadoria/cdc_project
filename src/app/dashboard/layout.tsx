import { LogoutButton } from "../../components/dashboard/logout-button"; 
import { DashboardNav } from "../../components/dashboard/nav"; 
import { UserCircle } from "lucide-react";
import { Toaster } from 'sonner';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <Toaster position="top-right" richColors />
      <aside className="w-64 bg-white border-r fixed h-full z-10 hidden md:flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-blue-600">NexusStore</h1>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
           <DashboardNav />
        </div>

        <div className="p-4 border-t bg-gray-50">
          <LogoutButton />
        </div>
      </aside>

      <main className="flex-1 md:ml-64 p-8">
        <header className="flex justify-end items-center mb-8">
            <div className="flex items-center gap-2 text-gray-700">
                <span className="text-sm font-medium">Admin User</span>
                <UserCircle className="w-8 h-8 text-gray-400" />
            </div>
        </header>
        {children}
      </main>
    </div>
  );
}