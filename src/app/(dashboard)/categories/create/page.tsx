import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { CategoryForm } from "../_components/form";

export default function CreateCategoryPage() {
   
    return (
        <>
            <Breadcrumb pageName="Create Category" />

             <CategoryForm />
        </>
    )
}