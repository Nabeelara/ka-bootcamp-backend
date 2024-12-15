import { BRAND } from "@/types/brand";
import { Category, Flavour, OrderItems, Product } from "@prisma/client";
import Image from "next/image";
import { ppid } from "process";

type TableOne = {
  products: (Product & {
    items: (OrderItems & { flavour: Flavour })[];
    quantity: number;
    flavours: Flavour[];
    category: Category;
  })[];
};

const TableOne = ({products}:TableOne) => {
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Top Products
      </h4>

      <div className="flex flex-col">
        <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Name
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Flavour
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Price
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Quantity
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Category
            </h5>
          </div>
        </div>

        {products.map((product, key) => (
          <div
            className={`grid grid-cols-3 sm:grid-cols-5 ${
              key === products.length - 1
                ? ""
                : "border-b border-stroke dark:border-strokedark"
            }`}
            key={key}
          >
            <div className="flex items-center gap-3 p-2.5 xl:p-5">
              <div className="flex-shrink-0">
                <Image src={`${process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_IMAGE}/${(product.images as string[])[0]}`} alt={product.name} width={48} height={48} />
              </div>
              <p className="hidden text-black dark:text-white sm:block">
                {product.name}
              </p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              {/* <p className="text-black dark:text-white">{product.flavour}K</p> */}
              {product.flavours.map((flavour) => (
                <div
                key={flavour.id}
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  backgroundColor: `${flavour.color}`,
                  marginRight: "5px",
                }}
                />
              ))}
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-meta-3">${product.price}</p>
            </div>

            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-black dark:text-white">{product.quantity}</p>
            </div>

            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-meta-5">{product.category.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableOne;
