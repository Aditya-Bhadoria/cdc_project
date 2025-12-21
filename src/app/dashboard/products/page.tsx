export const dynamic = "force-dynamic";
import Link from "next/link";
import { db } from "../../../lib/db";
import { ProductSearch } from "../../../components/dashboard/product-search"; 
import { DeleteButton } from "../../../components/delete-button"; 
import { Plus, MoreHorizontal, Edit, PackageX } from "lucide-react";
import Image from "next/image";
import { Metadata } from "next";

interface ProductsPageProps {
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
}
export const metadata: Metadata = {
  title: "Product Management | NexusStore",
  description: "View and manage store inventory.",
};
export default async function ProductsPage( props : ProductsPageProps) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const itemsPerPage = 10;

  const products = await db.product.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { sku: { contains: query, mode: "insensitive" } },
      ],
    },
    take: itemsPerPage,
    skip: (currentPage - 1) * itemsPerPage,
    orderBy: { createdAt: "desc" },
  });

  const totalItems = await db.product.count({
    where: {
      name: { contains: query, mode: "insensitive" },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your inventory ({totalItems} total)
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <ProductSearch />
          <Link
            href="/dashboard/products/create"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Add Product
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700 font-medium border-b">
              <tr>
                <th className="px-6 py-4">Product Info</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <PackageX className="w-8 h-8 text-gray-300" />
                      <p>No products found matching "{query}"</p>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-gray-100 border flex items-center justify-center overflow-hidden">
                          {product.imageUrl ? (
                             // eslint-disable-next-line @next/next/no-img-element
                            <div className="relative w-10 h-10 rounded-md overflow-hidden border">
                              <Image 
                                  src={product.imageUrl} 
                                  alt={product.name} 
                                  fill 
                                  className="object-cover"
                                  sizes="40px"
                              />
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">Img</span>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{product.name}</div>
                          <div className="text-xs text-gray-500 uppercase">{product.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={product.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span>{product.stock}</span>
                        {product.stock < 10 && (
                          <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" title="Low Stock" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-700">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-gray-600 capitalize">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <Link
                          href={`/dashboard/products/${product.id}/edit`}
                          className="p-2 text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <DeleteButton id={product.id} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {products.length > 0 && (
           <div className="p-4 border-t bg-gray-50 flex justify-between items-center text-sm text-gray-500">
             <span>Page {currentPage}</span>
             <div className="flex gap-2">
               {currentPage > 1 && (
                  <Link href={`?page=${currentPage - 1}&query=${query}`} className="px-3 py-1 border rounded bg-white hover:bg-gray-50">Previous</Link>
               )}
               {products.length === itemsPerPage && (
                  <Link href={`?page=${currentPage + 1}&query=${query}`} className="px-3 py-1 border rounded bg-white hover:bg-gray-50">Next</Link>
               )}
             </div>
           </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    ACTIVE: "bg-green-100 text-green-700 border-green-200",
    DRAFT: "bg-gray-100 text-gray-700 border-gray-200",
    ARCHIVED: "bg-yellow-50 text-yellow-700 border-yellow-200",
  };

  const defaultStyle = "bg-gray-100 text-gray-700";

  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
        styles[status] || defaultStyle
      }`}
    >
      {status}
    </span>
  );
}