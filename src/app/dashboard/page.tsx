export const dynamic = "force-dynamic";
import { db } from "../../lib/db";
import { OverviewCharts } from "../../components/dashboard/overview-charts";
import { Package, DollarSign, TrendingUp, AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const [totalProducts, totalStockResult, lowStockCount, recentProducts] = await Promise.all([
    db.product.count(),
    db.product.aggregate({
      _sum: { stock: true, price: true }, 
    }),
    db.product.count({
      where: { stock: { lt: 10 } }, 
    }),
    db.product.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const productsByCategory = await db.product.groupBy({
    by: ['category'],
    _count: {
      category: true,
    },
  });

  const chartData = productsByCategory.map((item) => ({
    name: item.category,
    value: item._count.category,
  }));

  const totalStock = totalStockResult._sum.stock || 0;

  const products = await db.product.findMany({
    select: { price: true, stock: true }
  });

  const totalInventoryValue = products.reduce((acc, item) => {
    return acc + (Number(item.price) * item.stock);
  }, 0);

  const totalStockCount = products.reduce((acc, item) => acc + item.stock, 0);
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-2">Welcome back. Here is what is happening with your store today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Products" 
          value={totalProducts} 
          icon={<Package className="text-blue-600" />} 
          trend="+12% from last month"
          trendColor="text-green-600"
        />
        <StatCard 
          title="Total Inventory" 
          value={totalStock} 
          icon={<TrendingUp className="text-purple-600" />} 
          trend="Items in stock"
          trendColor="text-gray-600"
        />
        <StatCard 
          title="Low Stock Alerts" 
          value={lowStockCount} 
          icon={<AlertTriangle className="text-red-600" />} 
          trend="Requires attention"
          trendColor="text-red-600"
        />
        <StatCard 
          title="Total Inventory Value" 
          value={`$${totalInventoryValue.toLocaleString()}`} 
          icon={<DollarSign className="text-green-600" />} 
          trend={`${totalStockCount} items in stock`} 
          trendColor="text-gray-600"
        />
      </div>

      <OverviewCharts categoryData={chartData} />

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Recently Added Products</h3>
          <Link href="/dashboard/products" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
            View All <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-medium">
              <tr>
                <th className="px-6 py-4">Product Name</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4 text-right">Added</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {recentProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : product.status === "DRAFT"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">${product.price.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right text-gray-500">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, trendColor }: any) {
  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
        </div>
        <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
      </div>
      <p className={`text-xs font-medium ${trendColor}`}>{trend}</p>
    </div>
  );
}