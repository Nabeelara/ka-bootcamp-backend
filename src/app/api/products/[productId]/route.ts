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
            colors: true,
            category: true,
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

export async function POST(
    request: Request,
    {params}: {params: {productId: string}}
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

        const productId = Number(params.productId);

        //mengecek apakah product dengan ID yang diberikan ada
        const product = await prisma.product.findUnique({
            where: {
                id: productId,
            },
        });

        if (!product) {
            return new NextResponse("Product not found", {status: 404});
        }

        //menangkap warna dari body request
        const {color, quantity} = await request.json();

        //menambah warna baru ke product
        const newColor = await prisma.color.create({
            data: {
                color,
                quantity,
                productId: product.id, //menghubungkan dg product yang relevan
            }
        })

        return NextResponse.json(color, {status:201})
    } catch (err:any) {
        console.log(err);
        return new NextResponse("Internal server error", {status:500});
    }
}

export async function PACTH (
    request: Request,
    {params}: {params: {productId: string; colorId: string}}
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

        const productId = Number(params.productId);
        const colorId = Number(params.colorId);
        const {color, quantity} = await request.json();

        //mengecek apakah product dg ID yg diberikan ada
        const product = await prisma.product.findUnique({
            where: {
                id: productId,
            },
        });

        if (!product) {
            return new NextResponse("Product not found", {status: 404});
        }

        //mengecek apakahwarna yg terkait dg product ada
        const existingColor = await prisma.color.findFirst({
            where: {
                id: colorId,
                productId: productId, //memastikan warna tsb milik product yg sesuai
            },
        });

        if (!existingColor) {
            return new NextResponse("Color not found for this product", {status: 404})
        }

        //update data warna
        const updatedColor = await prisma.color.update({
            where: {
                id: colorId,
            },
            data: {
                color: color || existingColor.color, // mempertahankan nilai(jumlah product) lama jika color tidak tersedia
                quantity: quantity ?? existingColor.quantity, // mempertahankan nilai jika quantity tdk disediakan
            },
        });

        return NextResponse.json(updatedColor, {status: 200});

    } catch (err: any) {
        console.log(err);
        return new NextResponse("Internal server error", {status: 500})
    }
}