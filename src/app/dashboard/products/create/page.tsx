export const dynamic = "force-dynamic";
import CreateProductForm from "../../../../components/create-product-form";
import { db } from "../../../../lib/db";

export default async function CreateProductPage() {
  const categoriesRaw = await db.product.findMany({
    distinct: ["category"],
    select: {
      category: true,
    },
    orderBy: {
      category: "asc",
    },
  });
  const categories = categoriesRaw.map((item) => item.category);
  return (
    <div className="max-w-4xl mx-auto py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
        <p className="text-gray-500 mt-2">Follow the steps to add your inventory to the store.</p>
      </div>
      <CreateProductForm categories={categories} />
    </div>
  );
}