import { db } from "../../lib/db";
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

  // Group by category for the chart
  const categoryCount: Record<string, number> = {};
  allProducts.forEach((p) => {
    const cat = p.category || "Uncategorized";
    categoryCount[cat] = (categoryCount[cat] || 0) + 1;
  });

  // 2. UI Components
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-gray-500 mt-2 flex items-center gap-2">
            <CalendarDays className="w-4 h-4" />
            Here is what's happening with your inventory today.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white text-gray-700 px-4 py-2 rounded-lg border shadow-sm text-sm font-medium hover:bg-gray-50 transition-colors">
            Download Report
          </button>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md shadow-indigo-200 text-sm font-medium hover:bg-indigo-700 transition-colors">
            Add New Item
          </button>
        </div>
      </div>

      {/* Stats Grid - NOW WITH LIGHT COLORED BOXES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Items" 
          value={totalItems.toString()} 
          icon={Package} 
          trend="+12%"
          theme="blue" // Light Blue Box
        />
        <StatCard 
          title="Total Inventory" 
          value={inventoryStats._sum.inventoryCount?.toString() || "0"} 
          icon={TrendingUp} 
          trend="+5.2%"
          theme="purple" // Light Purple Box
        />
        <StatCard 
          title="Low Stock Alerts" 
          value={lowStockCount.toString()} 
          icon={AlertTriangle} 
          trend="Requires Action"
          trendColor="text-rose-600"
          theme="rose" // Light Red/Rose Box
        />
        <StatCard 
          title="Total Valuation" 
          value={`$${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
          icon={DollarSign} 
          trend="+2.4%"
          theme="emerald" // Light Green Box
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Chart */}
        <div className="lg:col-span-1 bg-white rounded-2xl border shadow-sm p-6 flex flex-col">
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
                     <span className="text-gray-400 text-xs">{count} items ({percentage}%)</span>
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

        {/* Sales Performance - FIXED VISIBILITY */}
        <div className="lg:col-span-2 bg-white rounded-2xl border shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-gray-900">Weekly Performance</h3>
            <select className="text-sm border-none bg-gray-50 rounded-md px-2 py-1 text-gray-500 focus:ring-0 cursor-pointer hover:bg-gray-100">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          
          <div className="h-64 flex items-end justify-between gap-3 sm:gap-4 mt-8">
             {/* Render Bars */}
             {[45, 78, 52, 34, 67, 89, 56].map((h, i) => {
               const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
               const isPeak = i === 5; // Highlight Saturday as peak
               
               return (
                 <div key={i} className="flex-1 flex flex-col items-center gap-3 h-full justify-end group cursor-default">
                   <div className="relative w-full flex items-end justify-center h-full">
                      {/* Tooltip on Hover */}
                      <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded py-1.5 px-3 whitespace-nowrap z-10 pointer-events-none transform translate-y-2 group-hover:translate-y-0 duration-200">
                        ${h * 120} Sales
                        <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                      </div>
                      
                      {/* BAR - Using stronger colors (Sky-300/500) so they are visible */}
                      <div 
                        className={`w-full max-w-[44px] rounded-t-lg transition-all duration-300 ${
                          isPeak 
                            ? "bg-sky-500 shadow-md shadow-sky-200" // Darker blue for peak
                            : "bg-sky-200 hover:bg-sky-300"          // Lighter blue for others
                        }`}
                        style={{ height: `${h}%` }}
                      ></div>
                   </div>
                   <span className="text-xs text-gray-400 font-medium">{days[i]}</span>
                 </div>
               )
             })}
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. Updated StatCard with "Light Colored Box" Themes
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
  // Define themes for the entire card background
  const themes = {
    blue:    "bg-sky-50 border-sky-100",
    purple:  "bg-violet-50 border-violet-100",
    rose:    "bg-rose-50 border-rose-100",
    emerald: "bg-emerald-50 border-emerald-100",
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