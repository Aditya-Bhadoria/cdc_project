import { db } from "../../../../../lib/db"; 
import { notFound } from "next/navigation";
import { ProductForm } from "../../../../../components/inventory/product-form"; 

// FIXED: Define params as a Promise
interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({ params }: PageProps) {
  // FIXED: Await the params to get the ID
  const { id } = await params;

  const product = await db.product.findUnique({
    where: { id },
  });

  if (!product) {
    notFound();
  }

  const formattedProduct = {
    ...product,
    price: product.price.toNumber() 
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* We pass 'formattedProduct' instead of 'product' to avoid the error */}
      <ProductForm initialData={formattedProduct} isEdit={true} />
    </div>
  );
}