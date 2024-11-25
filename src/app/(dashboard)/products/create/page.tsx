import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import FormProduct from "../_components/form";
import prisma from "@/lib/prisma";

export default async function CreateProductsPage() {
    const categories = await prisma.category.findMany({
        where: {
            isActive: true,
        }
    })
   
    return (
        <>
            <Breadcrumb pageName="Create Product" />
             <FormProduct categories={categories} />
        </>
    );
}