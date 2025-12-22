import { db } from "../../../../../lib/db"; 
import { notFound } from "next/navigation";
import { ProductForm } from "../../../../../components/inventory/product-form"; 

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({ params }: PageProps) {
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
      <ProductForm initialData={formattedProduct} isEdit={true} />
    </div>
  );
}