import Link from "next/link";
import { Plus, Pencil, Trash2, Package } from "lucide-react";
import { db } from "../../../lib/db"; 
import { deleteProduct } from "../../../actions/products";

export const dynamic = "force-dynamic";

export default async function InventoryPage() {
  const products = await db.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex justify-between items-center bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white">Inventory Items</h1>
          <p className="text-sm text-slate-400">Manage your inventory ({products.length} total)</p>
        </div>
        <div className="flex gap-3">
          <input 
             type="text" 
             placeholder="Search products..." 
             className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm w-64 text-white focus:ring-2 focus:ring-emerald-500 outline-none hidden sm:block placeholder:text-slate-600"
          />
          <Link
            href="/dashboard/inventory/create"
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-900/20 text-sm font-medium"
          >
            <Plus size={18} /> Add Item
          </Link>
        </div>
      </div>

      {/* Dark Table */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-950 text-slate-400 font-medium border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Item Details</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Inventory</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 flex-shrink-0 rounded-lg overflow-hidden border border-slate-700 bg-slate-800">
                        {product.image ? (
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <Package className="w-5 h-5 text-slate-600" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-slate-200">{product.name}</p>
                        {/* FIXED: Now using the REAL sku from database */}
                        <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">
                          {product.sku}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        product.status === "ARCHIVED"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : product.status === "DRAFT"
                          ? "bg-slate-700/50 text-slate-400 border-slate-600"
                          : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      }`}
                    >
                      {product.status || "ACTIVE"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-300">{product.inventoryCount}</span>
                      {product.inventoryCount < 15 && (
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-lg shadow-rose-500/50" title="Low Stock" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-grey-400">
                    {product.category || "Uncategorized"}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-200">
                    ${Number(product.price).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/dashboard/inventory/${product.id}/edit`}
                        className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                      >
                        <Pencil size={18} />
                      </Link>
                      <form action={deleteProduct.bind(null, product.id)}>
                        <button className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <Package className="w-12 h-12 mx-auto text-slate-700 mb-3" />
                    <p>No products found. Add your first item!</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}