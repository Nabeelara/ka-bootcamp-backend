"use client";

import { createCategory, updateCategory } from '@/app/actions';
import { Category } from '@prisma/client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import Swal from 'sweetalert2';

export default function Form({category}: {category? : Category}) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    
    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true);
        const res = category
            ? await updateCategory(category.id.toString(), formData)
            : await createCategory(formData);
        console.log(res);

        if (!res.success) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: res.error || "Something went wrong",
            });
        } else {
            Swal.fire({
                icon: "success",
                title: "Success",
                text: res.success || "Category created successfully",
            });

            router.push("/categories");
        }
        setIsLoading(false);
    }
    
  return (
    <div className="grid grid-cols-2">
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mt-4 ">
<div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
  <h3 className="font-medium text-black dark:text-white">
    {category ? "Edit Category Form" : "Create Category Form"}
  </h3>
</div>
<form action={handleSubmit}>
  <div className="p-6.5">
    <div className="mb-4.5">
      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
        Name
      </label>
      <input
        defaultValue={category?.name}
        type="text"
        required
        name="name"
        placeholder="Enter your category name"
        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
      />
    </div>

    <div>
      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
        Status
      </label>

      <div className="relative z-20 bg-white dark:bg-form-input mb-4">

        <select name="isActive"
          className={"relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"}>
        
          <option value={1} className="text-body dark:text-bodydark">
            Active
          </option>
          <option value={0} className="text-body dark:text-bodydark">
            Not Active
          </option>

        </select>

        <span className="absolute right-4 top-1/2 z-10 -translate-y-1/2">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g opacity="0.8">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                fill="#637381"
              ></path>
            </g>
          </svg>
        </span>
      </div>
    </div>

    <div className="mb-6">
      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
        Description
      </label>
      <textarea
      name="description"
        rows={6}
        placeholder="Type your description"
        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
      ></textarea>
    </div>
    <button type="submit" className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 mt-4">
      Submit
    </button>
  </div>
</form>
    </div>
 </div>
  )
}
