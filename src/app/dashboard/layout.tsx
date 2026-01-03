import { DashboardNav } from "../../components/dashboard/nav"; 
import { Leaf } from "lucide-react"; 
import { UserProfile } from "../../components/dashboard/user-profile";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      
      <header className="bg-slate-900/50 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 text-emerald-400">
              <Leaf className="w-6 h-6" />
              <span className="font-bold text-lg text-white tracking-wide">LeafStore</span>
            </div>

            <div className="hidden md:block">
              <DashboardNav />
            </div>
          </div>

          <UserProfile />

        </div>
      </header>

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}