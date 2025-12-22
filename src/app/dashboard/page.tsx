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

  // Calculate total valuation
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
      {/* Header Section */}
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Items" 
          value={totalItems.toString()} 
          icon={Package} 
          trend="+12%"
          color="blue"
        />
        <StatCard 
          title="Total Inventory" 
          value={inventoryStats._sum.inventoryCount?.toString() || "0"} 
          icon={TrendingUp} 
          trend="+5.2%"
          color="indigo"
        />
        <StatCard 
          title="Low Stock Alerts" 
          value={lowStockCount.toString()} 
          icon={AlertTriangle} 
          trend="Requires Action"
          trendColor="text-red-600"
          color="red"
        />
        <StatCard 
          title="Total Valuation" 
          value={`$${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
          icon={DollarSign} 
          trend="+2.4%"
          color="green"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Chart */}
        <div className="lg:col-span-1 bg-white rounded-2xl border shadow-sm p-6 flex flex-col">
          <h3 className="font-semibold text-gray-900 mb-6">Inventory by Category</h3>
          <div className="flex-1 flex flex-col justify-center space-y-4">
            {Object.entries(categoryCount).map(([cat, count], index) => {
               // Calculate percentage
               const percentage = Math.round((count / totalItems) * 100);
               const colors = ["bg-blue-500", "bg-indigo-500", "bg-purple-500", "bg-pink-500", "bg-teal-500"];
               const colorClass = colors[index % colors.length];

               return (
                 <div key={cat} className="group">
                   <div className="flex justify-between text-sm mb-1">
                     <span className="text-gray-600 font-medium capitalize">{cat}</span>
                     <span className="text-gray-400">{count} items ({percentage}%)</span>
                   </div>
                   <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
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

        {/* Sales Performance (Mock Data visualized better) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-gray-900">Weekly Performance</h3>
            <select className="text-sm border-none bg-gray-50 rounded-md px-2 py-1 text-gray-500 focus:ring-0">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          
          <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 mt-8">
             {/* Mock Bars */}
             {[45, 78, 52, 34, 67, 89, 56].map((h, i) => {
               const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
               return (
                 <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                   <div className="relative w-full flex items-end justify-center h-full">
                      {/* Tooltip */}
                      <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                        ${h * 120} Sales
                      </div>
                      {/* Bar */}
                      <div 
                        className={`w-full max-w-[40px] rounded-t-lg transition-all duration-300 ${
                          i === 5 ? "bg-indigo-600 shadow-lg shadow-indigo-200" : "bg-indigo-100 hover:bg-indigo-300"
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

// 3. Reusable Stats Card Component
function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  color, 
  trendColor 
}: { 
  title: string; 
  value: string; 
  icon: any; 
  trend: string; 
  color: "blue" | "indigo" | "red" | "green";
  trendColor?: string;
}) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    indigo: "bg-indigo-50 text-indigo-600",
    red: "bg-red-50 text-red-600",
    green: "bg-green-50 text-green-600",
  };

  return (
    <div className="bg-white p-6 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-xl ${colors[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className={`flex items-center text-xs font-medium ${trendColor || "text-green-600"} bg-green-50 px-2 py-1 rounded-full`}>
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