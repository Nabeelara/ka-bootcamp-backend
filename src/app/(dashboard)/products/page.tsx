import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import prisma from "@/lib/prisma";
import Link from "next/link";
import DeleteProductButton from "@/components/ui/DeleteProductButton";


const ProductsPage = async () => {
    const products = await prisma.product.findMany({
        include: {
            category: true,
            colors: true
        }
    })
    console.log(products);
  return (
    <>
    <Breadcrumb pageName="Products" />      
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="px-4 py-6 md:px-6 xl:px-7.5">
        <div className="flex justify-between">
            <h4 className="text-xl font-semibold text-black dark:text-white">
              Top Products
            </h4>
            <Link 
            className="btn btn-primary px-4 py-2 font-semibold bg-primary text-white rounded-md shadow-2 hover:cursor-pointer hover:bg-primary/80"
            href="/products/create ">
                Add Product
            </Link>
        </div>
        
      </div>

      <div className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
        <div className="col-span-3 flex items-center">
          <p className="font-medium">Product Name</p>
        </div>
        <div className="col-span-2 hidden items-center sm:flex">
          <p className="font-medium">Category</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Price</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Sold</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Action</p>
        </div>
      </div>

      {products.map((product, key) => (
        <div
          className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
          key={key}
        >
          <div className="col-span-3 flex items-center">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="h-12.5 w-15 rounded-md">
                <Image
                  src={
                    `${process.env.SUPABASE_PUBLIC_IMAGE}/${(product.images as string[])[0]}`}
                  width={60}
                  height={50}
                  alt="Product"
                />
              </div>
              <p className="text-sm text-black dark:text-white">
                {product.name}
              </p>
            </div>
          </div>
          <div className="col-span-2 hidden items-center sm:flex">
            <p className="text-sm text-black dark:text-white">
              {product.category.name}
            </p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="text-sm text-black dark:text-white">
              ${product.price}
            </p>
          </div>
          <div className="col-span-1 flex items-center">
            <div className=" flex gap-2 text-sm text-black dark:text-white">{
                product.colors.map((color) => (
                    <div key={color.id}
                    style={{
                        backgroundColor: color.color,
                        height: 20,
                        width: 20,
                        borderRadius: "50%"
                    }}>

                    </div>
                ))}</div>
          </div>
          <div className="col-span-1 flex items-center gap-2">
            <Link href={`/products/${product.id}`}
            className="bg-primary text-white px-4 py-2 hover:cursor-pointer hover:bg-primary/80 rounded-md">
              Edit
            </Link>
            <DeleteProductButton productId={product.id}/>
          </div>
        </div>
      ))}
    </div>
    </>
  );
};

export default ProductsPage;
