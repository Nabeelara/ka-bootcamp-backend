import ECommerce from "@/components/Dashboard/E-commerce";
import prisma from "@/lib/prisma";
import { getProfit } from "@/lib/profit";

export default async function Home() {
const categories = await prisma.category.findMany({
  include: {
    products: true,
  }
});
const product = await prisma.product.findMany({
  include: {
    items: {
      include: {
        flavour: true,
      }
    },
    flavours: true,
    category: true
  }
});
const orders = await prisma.order.count();
const customer = await prisma.user.count({
  where: {
    roles: "CUSTOMER"
  }
});

const profits = await getProfit();
console.log("propit",profits);

 return (
    <ECommerce categories={categories} products={product} orders={orders} customers={customer} profits={profits} />
  );
}
