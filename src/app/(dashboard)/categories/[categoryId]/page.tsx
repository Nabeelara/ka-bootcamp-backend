import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import prisma from "@/lib/prisma";
import { CategoryFormEdit } from "../_components/form";

export default async function EditCategoryPage({
  params,
}: {
  params: { categoryId: string };
}) {
  const category = await prisma.category.findUnique({
    where: {
      id: parseInt(params.categoryId),
    },
  });

  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <>
      <Breadcrumb pageName="Edit Category" />
      <CategoryFormEdit category = {category} />
    </>
  );
}
