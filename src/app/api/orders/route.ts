import prisma from "@/lib/prisma";
import { verifyUser } from "@/lib/verify";
import { orderSchema } from "@/schema/order";
import { NextResponse } from "next/server";
import { ZodError } from "zod";


type OrderPayload = {
 productId: number;
 colorId: number;
 quantity: number;
};


export async function POST(request: Request) {
  try {
    const user = await verifyUser(request)

    if (!user) {
      return NextResponse.json({
        data: null,
        message: "Unauthorized",
        success:false
      }, {
        status:401
      })
    }
    
    const body = await request.json();

    orderSchema.parse(body);

    if (body.items.length === 0) {
      return new NextResponse("Please add minimum 1 product", { status: 400 });
    }

    for (const item of body.items as OrderPayload[]) {
      const color = await prisma.flavour.findFirstOrThrow({
        where: {
          id: item.colorId,
          productId: item.productId,
        },
      });

      if (item.quantity > color.quantity) {
        return new NextResponse(
          `Requested quantity (${item.quantity}) exceeds available stock (${color.quantity}) for productId ${item.productId}`,
          { status: 400 },
        );
      }
    }

    const order = await prisma.order.create({
      data: {
        status: "PENDING",
        userId: user.id,
        address: body.address,
        postalCode: body.postalCode,
        country: body.country,
        city: body.city,
        items: {
          create: (body.items as OrderPayload[]).map((item) => ({
            colorId: item.colorId,
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        user: true,
      },
    });

    for (const item of body.items as OrderPayload[]) {
      const color = await prisma.flavour.findFirstOrThrow({
        where: {
          id: item.colorId,
          productId: item.productId,
        },
      });

      await prisma.flavour.update({
        where: {
          id: color.id,
        },
        data: {
          quantity: color.quantity - item.quantity,
        },
      });
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    console.log(error);
    if (error instanceof ZodError) {
      return NextResponse.json(error.issues[0], { status: 400 });
    } else {
      return new NextResponse("Internal server error", {
        status: 500,
      });
    }
  }
}

export async function GET(request: Request) {
  try {
    // Verifikasi pengguna
    const user = await verifyUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ambil daftar pesanan
    const orders = await prisma.order.findMany({
      where: {
        userId: user.id, // Hanya pesanan milik pengguna yang sedang login
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true, // Kategori produk
                flavours: true,   // Warna produk
              },
            },
            flavour: true,
          },
        },
      },
    });

    // Kembalikan data pesanan dalam format JSON
    return NextResponse.json({ orders }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}