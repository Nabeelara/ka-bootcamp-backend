import prisma from "@/lib/prisma";
import { categorySchema } from "@/schema/category";
import { NextResponse } from "next/server";
import { verifyUser } from "@/lib/verify";

export async function GET(
    request: Request,
    {params}: {params: { categoryId: string} },
) {
    try {
        const category = await prisma.category.findFirst({
            where: {
                id: Number(params.categoryId),
            },
        });

        if (!category) {
            return new NextResponse("Category not found", {status: 404});
        }
        return NextResponse.json(category, {status:200});
    } catch (err: any) {
        console.log(err);
        return new NextResponse("Internal server error", {status:500});
    }
}

export async function PATCH (
    request: Request,
    {params} : {params: {categoryId: string}},
) {
    try {
        const user = await verifyUser(request);

      if (!user) {
        return NextResponse.json(
          {
            data: null,
            success: false,
            message: "Unauthorized"
          }, {status: 401});
      }

    const body = await request.json();

    categorySchema.parse(body);

    const category = await prisma.category.findFirst({
        where: {
            id: Number(params.categoryId),
        },
    });

    if (!category) {
        return new NextResponse("Category not found", {status: 404})
    }

    const updatedCategory = await prisma.category.update({
        where: {
            id: category.id,
        },
        data: {
            name: body.name,
        },
    });

    return NextResponse.json(updatedCategory, {status: 200});
    } catch (err: any) {
        console.log(err);
        return new NextResponse("Internal server error", {status: 500});
    }
}

export async function DELETE(
    request: Request,
    {params}: {params: { categoryId: string} },
) {
    try {
        const user = await verifyUser(request);

      if (!user) {
        return NextResponse.json(
          {
            data: null,
            success: false,
            message: "Unauthorized"
          }, {status: 401});
      }

        const category = await prisma.category.findFirst({
            where: {
                id: Number(params.categoryId),
            },
        });

        if (!category) {
            return new NextResponse("Category not found", {status: 404});
        }

        await prisma.category.delete({
            where: {
                id: Number(params.categoryId)
            }
        })
        return NextResponse.json(category, {status:200});
    } catch (err: any) {
        console.log(err);
        return new NextResponse("Internal server error", {status:500});
    }
}