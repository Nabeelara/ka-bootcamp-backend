import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import FormOrder from "../_components/formOrder";

export default async function OrderDetail({
  params,
}: {
  params: { orderId: string };
}) {
  //code untuk menampilkan data get byId
  const order = await prisma.order.findUnique({
    where: {
      id: Number(params.orderId),
    },
    include: {
      items: {
        include: {
          product: {
            include: {
              flavours: true,
            },
          },
        },
      },
    },
  });
  if (!order) {
    return notFound();
  }
  
  return (
    <div>
      <Breadcrumb pageName="Product Detail" />
      {/* form order here */}
      <FormOrder order={order} />
      
    </div>
  );
}