import Link from "next/link";
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

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
          <p className="text-slate-400 mt-2 flex items-center gap-2">
            <CalendarDays className="w-4 h-4" />
            Overview of your store performance.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="bg-slate-800 text-slate-300 px-4 py-2 rounded-lg border border-slate-700 shadow-sm text-sm font-medium hover:bg-slate-700 transition-colors">
            Download Report
          </button>
          
          <Link
            href="/dashboard/inventory/create"
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg shadow-emerald-900/50 text-sm font-medium hover:bg-emerald-500 transition-colors flex items-center justify-center"
          >
            Add New Item
          </Link>
        </div>
      </div>

      {/* Dark Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Items" 
          value={totalItems.toString()} 
          icon={Package} 
          trend="+12%"
          theme="blue"
        />
        <StatCard 
          title="Total Inventory" 
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
          trendColor="text-rose-400"
          theme="rose"
        />
        <StatCard 
          title="Total Valuation" 
          value={`$${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
          icon={DollarSign} 
          trend="+2.4%"
          theme="emerald"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col">
          <h3 className="font-semibold text-white mb-6">Inventory by Category</h3>
          <div className="flex-1 flex flex-col justify-center space-y-5">
            {Object.entries(categoryCount).map(([cat, count], index) => {
               const percentage = Math.round((count / totalItems) * 100);
               const colors = ["bg-sky-500", "bg-violet-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500"];
               const colorClass = colors[index % colors.length];

               return (
                 <div key={cat} className="group">
                   <div className="flex justify-between text-sm mb-1.5">
                     <span className="text-slate-300 font-medium capitalize">{cat}</span>
                     <span className="text-slate-500 text-xs">{count} items ({percentage}%)</span>
                   </div>
                   <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                     <div 
                        className={`h-full rounded-full ${colorClass} transition-all duration-500 ease-out shadow-lg shadow-${colorClass}/50`} 
                        style={{ width: `${percentage}%` }}
                     />
                   </div>
                 </div>
               )
            })}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl h-full p-6">
             {/* Note: The SalesChart component itself is white inside. 
                 It will look like a "Card" on the dark background. 
                 If you want that dark too, we'd need to edit sales-chart.tsx 
                 but this usually looks fine as a contrast. */}
             <SalesChart />
          </div>
        </div>
      </div>
    </div>
  );
}

// Dark Mode Stat Card
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
    blue:    "bg-slate-900 border-slate-800",
    purple:  "bg-slate-900 border-slate-800",
    rose:    "bg-slate-900 border-slate-800",
    emerald: "bg-slate-900 border-slate-800",
  };

  const iconColors = {
    blue:    "bg-sky-500/10 text-sky-400",
    purple:  "bg-violet-500/10 text-violet-400",
    rose:    "bg-rose-500/10 text-rose-400",
    emerald:  "bg-emerald-500/10 text-emerald-400",
  };

  return (
    <div className={`p-6 rounded-2xl border transition-all hover:border-slate-700 ${themes[theme]}`}>
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-xl ${iconColors[theme]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className={`flex items-center text-xs font-bold ${trendColor || "text-emerald-400"} bg-slate-800 px-2 py-1 rounded-full border border-slate-700`}>
           {trend === "Requires Action" ? null : <ArrowUpRight className="w-3 h-3 mr-1" />}
           {trend}
        </div>
      </div>
      <div className="mt-4">
        <p className="text-slate-400 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
      </div>
    </div>
  );
}