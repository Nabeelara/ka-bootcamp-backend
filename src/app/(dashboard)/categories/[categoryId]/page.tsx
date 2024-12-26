import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import prisma from "@/lib/prisma";
import Form from "../_components/form";

export default async function EditCategoryPage({
  params,
}: {
  params: { categoryId: string };
}) {
  const category = await prisma.category.findUnique({
    where: {
      id: Number(params.categoryId),
    },
  });

  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <>
      <Breadcrumb pageName="Edit Category" />
      <Form category = {category} />
    </>
  );
}
