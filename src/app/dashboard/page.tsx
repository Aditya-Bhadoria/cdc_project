import Link from "next/link"; // Imported Link
import { db } from "../../lib/db";
import { SalesChart } from "../../components/dashboard/sales-chart";
import { 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  DollarSign, 
  CalendarDays,
  ArrowUpRight
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // 1. Fetch Real Data
  const totalItems = await db.product.count();
  
  const inventoryStats = await db.product.aggregate({
    _sum: { inventoryCount: true },
  });
  
  const lowStockCount = await db.product.count({
    where: { inventoryCount: { lt: 10 } },
  });

  const allProducts = await db.product.findMany({
    select: { price: true, inventoryCount: true, category: true },
  });

  const totalValue = allProducts.reduce((acc, item) => {
    return acc + (Number(item.price) * item.inventoryCount);
  }, 0);

  const categoryCount: Record<string, number> = {};
  allProducts.forEach((p) => {
    const cat = p.category || "Uncategorized";
    categoryCount[cat] = (categoryCount[cat] || 0) + 1;
  });

  // 2. UI Components
  return (
    <div className="space-y-8 bg-gradient-to-r from-gray-50 to-gray-200 p-8 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-gray-300 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-gray-600 mt-2 flex items-center gap-2">
            <CalendarDays className="w-4 h-4" />
            Here is what's happening with your inventory today.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white/80 backdrop-blur-sm text-gray-700 px-4 py-2 rounded-lg border shadow-sm text-sm font-medium hover:bg-white transition-colors">
            Download Report
          </button>
          
          {/* UPDATED: "Add New Item" is now a Link to the create page */}
          <Link
            href="/dashboard/inventory/create"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md shadow-indigo-200 text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center"
          >
            Add New Item
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Items" 
          value={totalItems.toString()} 
          icon={Package} 
          trend="+12%"
          theme="blue"
        />
        <StatCard 
          title="Total Purchases" 
          value={inventoryStats._sum.inventoryCount?.toString() || "0"} 
          icon={TrendingUp} 
          trend="+5.2%"
          theme="purple"
        />
        <StatCard 
          title="Low Stock Alerts" 
          value={lowStockCount.toString()} 
          icon={AlertTriangle} 
          trend="Requires Action"
          trendColor="text-rose-600"
          theme="rose"
        />
        <StatCard 
          title="Total Transaction" 
          value={`$${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
          icon={DollarSign} 
          trend="+2.4%"
          theme="emerald"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white/80 backdrop-blur-md rounded-2xl border shadow-sm p-6 flex flex-col">
          <h3 className="font-semibold text-gray-900 mb-6">Inventory by Category</h3>
          <div className="flex-1 flex flex-col justify-center space-y-5">
            {Object.entries(categoryCount).map(([cat, count], index) => {
               const percentage = Math.round((count / totalItems) * 100);
               const colors = ["bg-sky-400", "bg-violet-400", "bg-emerald-400", "bg-amber-400", "bg-rose-400"];
               const colorClass = colors[index % colors.length];

               return (
                 <div key={cat} className="group">
                   <div className="flex justify-between text-sm mb-1.5">
                     <span className="text-gray-700 font-medium capitalize">{cat}</span>
                     <span className="text-gray-500 text-xs">{count} items ({percentage}%)</span>
                   </div>
                   <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                     <div 
                        className={`h-full rounded-full ${colorClass} transition-all duration-500 ease-out`} 
                        style={{ width: `${percentage}%` }}
                     />
                   </div>
                 </div>
               )
            })}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border shadow-sm h-full">
             <SalesChart />
          </div>
        </div>
      </div>
    </div>
  );
}

// Stats Card Helper
function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  theme, 
  trendColor 
}: { 
  title: string; 
  value: string; 
  icon: any; 
  trend: string; 
  theme: "blue" | "purple" | "rose" | "emerald";
  trendColor?: string;
}) {
  const themes = {
    blue:    "bg-sky-50/80 border-sky-100 backdrop-blur-sm",
    purple:  "bg-violet-50/80 border-violet-100 backdrop-blur-sm",
    rose:    "bg-rose-50/80 border-rose-100 backdrop-blur-sm",
    emerald: "bg-emerald-50/80 border-emerald-100 backdrop-blur-sm",
  };

  const iconColors = {
    blue:    "bg-sky-200 text-sky-700",
    purple:  "bg-violet-200 text-violet-700",
    rose:    "bg-rose-200 text-rose-700",
    emerald:  "bg-emerald-200 text-emerald-700",
  };

  return (
    <div className={`p-6 rounded-2xl border transition-shadow hover:shadow-md ${themes[theme]}`}>
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-xl ${iconColors[theme]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className={`flex items-center text-xs font-bold ${trendColor || "text-emerald-700"} bg-white/60 px-2 py-1 rounded-full shadow-sm`}>
           {trend === "Requires Action" ? null : <ArrowUpRight className="w-3 h-3 mr-1" />}
           {trend}
        </div>
      </div>
      <div className="mt-4">
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
      </div>
    </div>
  );
}