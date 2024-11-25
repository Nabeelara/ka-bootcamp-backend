import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import prisma from "@/lib/prisma";
import FormProduct from "../_components/form";
import { notFound } from "next/navigation";

export default async function EditProductPage({
  params,
}: {
  params: { productId: string };
}) {
  const productId = parseInt(params.productId, 10);

  if (isNaN(productId)) {
    return <div>Invalid Product ID</div>;
  }

 
    // Ambil produk berdasarkan ID
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        colors: {
            orderBy: {
                createdAt: "asc",
            }
        }
    }
    });

    console.log(product)

    if (!product) {
        return notFound();
    }

    // Ambil semua kategori untuk dropdown
    const categories = await prisma.category.findMany({
      where: {
        isActive:true
      }
    });


  

  return (
    <>
      <Breadcrumb pageName="Edit Product" />
      <FormProduct product={product} categories={categories} />
    </>
  );
}
