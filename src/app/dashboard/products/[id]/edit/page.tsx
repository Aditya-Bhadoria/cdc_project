export const dynamic = "force-dynamic";
import { db } from "../../../../../lib/db";
import ProductForm from "../../../../../components/create-product-form"; 
import { notFound } from "next/navigation";

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage(props: EditProductPageProps) {
  const params = await props.params;
  const id = params.id;

  const product = await db.product.findUnique({
    where: {
      id: id,
    },
  });
  
  if (!product) {
    notFound();
  }
  const formattedProduct = {
    ...product,
    price: product.price.toNumber(), 
  };

  return (
    <div className="max-w-4xl mx-auto py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
        <p className="text-gray-500 mt-2">Update product details below.</p>
      </div>
      
      <ProductForm initialData={formattedProduct} productId={product.id} />
    </div>
  );
}