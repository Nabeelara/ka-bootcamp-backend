import prisma from "@/lib/prisma";
import { productSchema } from "@/schema/product";
import { NextResponse } from "next/server";
import { verifyUser } from "@/lib/verify";

export async function GET(
    request: Request,
    {params}: {params: { productId: string} },
) {
    try {
        const product = await prisma.product.findFirst({
            where: {
                id: Number(params.productId),
            },
            include: {
                category: true,
                flavours: true,
            }
        });

        if (!product) {
            return new NextResponse("Product not found", {status: 404});
        }
        return NextResponse.json(product, {status:200});
    } catch (err: any) {
        console.log(err);
        return new NextResponse("Internal server error", {status:500});
    }
}

export async function PATCH (
    request: Request,
    {params} : {params: {productId: string}},
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

    productSchema.parse(body);

    const product = await prisma.product.findFirst({
        where: {
            id: Number(params.productId),
        },
        include: {
            category: true,
            flavours: true,
        }
    });

    if (!product) {
        return new NextResponse("Product not found", {status: 404})
    }

    const updatedProduct = await prisma.product.update({
        where: {
            id: product.id,
        },
        data: {
            name: body.name,
        },
    });

    return NextResponse.json(updatedProduct, {status: 200});
    } catch (err: any) {
        console.log(err);
        return new NextResponse("Internal server error", {status: 500});
    }
}

export async function DELETE(
    request: Request,
    {params}: {params: { productId: string} },
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

        const product = await prisma.product.findFirst({
            where: {
                id: Number(params.productId),
            },
        });

        if (!product) {
            return new NextResponse("Product not found", {status: 404});
        }

        await prisma.product.delete({
            where: {
                id: Number(params.productId)
            }
        })
        return NextResponse.json(product, {status:200});
    } catch (err: any) {
        console.log(err);
        return new NextResponse("Internal server error", {status:500});
    }
}
