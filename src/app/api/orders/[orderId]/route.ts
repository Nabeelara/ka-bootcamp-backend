import prisma from "@/lib/prisma";
import { verifyUser } from "@/lib/verify";
import { OrderStatus } from "@prisma/client";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { orderId: string } },
) {
  try {
    const user = await verifyUser(request);
    if (!user) {
      return NextResponse.json({
        data: null,
        message: "Unauthorized",
      });
    }

    const order = await prisma.order.findFirst({
      where: {
        id: Number(params.orderId),
        userId: user.id,
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                flavours: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        {
          data: null,
          message: "Order not found",
        },
        {
          status: 404,
        },
      );
    }

    const { status }: { status: OrderStatus } = await request.json();

    if (status === "CANCELED") {
      await prisma.$transaction(async (ctx) => {
        await ctx.order.update({
            where: {
                id: order.id,
            },
            data: {
                status: "CANCELED"
            },
        });

        for (const item of order.items) {
          const { colorId, productId, quantity, ...prop } = item;

          await ctx.flavour.update({
            where: {
              id: colorId,
              productId: productId,
            },
            data: {
              quantity: {
                increment: quantity,
              },
            },
          });
        }
      });
    } else if (status === "SENDING") {
      await prisma.order.update({
        where: {
          id: order.id,
        },
        data: {
          status: "SENDING",
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: null,
      message: "Order status updated",
    });
  } catch (err: any) {
    console.log(err);
    return NextResponse.json({
      data: null,
      message: err?.message || "Internal server error",
    });
  }
}

export async function GET (
    request: Request,
    { params } : { params: {orderId: string}},
) {
    try {
        const user = await verifyUser(request);
        if (!user) {
          return NextResponse.json({
            data: null,
            message: "Unauthorized",
          });
        }

        const order = await prisma.order.findFirst({
            where: {
                id: Number(params.orderId),
                userId: user.id,
            },
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                flavours: true,
                            }
                        }
                    }
                }
            }
            
        });

        if (!order) {
            return NextResponse.json(
              {
                data: null,
                message: "Order not found",
              },
              {
                status: 404,
              },
            );
          }
        
          const { status } : { status: OrderStatus } = await request.json();

          if (!status || (status !== "CANCELED" && status !== "SENDING")) {
            return NextResponse.json(
              { data: null, message: "Invalid or missing status" },
              { status: 400 }
            );
          }          

          if (status === "CANCELED") {
            await prisma.$transaction(async (ctx) => {
              await ctx.order.update({
                where: { id: order.id },
                data: { status: "CANCELED" },
              });
      
              for (const item of order.items) {
                await ctx.flavour.update({
                  where: { id: item.colorId },
                  data: { quantity: { increment: item.quantity } },
                });
              }
            });
          } else if (status === "SENDING") {
            await prisma.order.update({
              where: { id: order.id },
              data: { status: "SENDING" },
            });
          }
      
          return NextResponse.json({
            success: true,
            data: null,
            message: "Order status updated",
          });

    } catch (err: any) {
        console.log(err);
        return NextResponse.json({
            data: null,
            message: err?.message || "Internal server error",
          });
    }
}

export async function DELETE (
    request: Request,
    {params} : {params: {orderId: string}},
) {
    try {
        const user = await verifyUser(request);
        if (!user) {
          return NextResponse.json({
            data: null,
            message: "Unauthorized",
          });
        }

        const order = await prisma.order.findFirst({
          where: {
            id: Number(params.orderId),
            userId: user.id,
          },
          include: {
            items: {
              include: {
                product: {
                  include: {
                    flavours: true,
                  },
                },
              },
            },
          },
        });

        if (!order) {
          return NextResponse.json(
            {
              data: null,
              message: "Order not found",
            },
            {
              status: 404,
            },
          );
        }

        const { status }: { status: OrderStatus } = await request.json();
        if (status === "completed") {
            return NextResponse.json(
              { data: null, message: "Cannot delete a completed order" },
              { status: 400 }
            );
          }
          
        await prisma.order.delete({
            where: {
                id: Number(params.orderId)
            }
        })
        return NextResponse.json(
            { data: order, message: "Order deleted successfully" },
            { status: 200 }
          );          

    } catch (err: any) {
        console.log(err);
        return new NextResponse("Internal server error", {status: 500});
    }
}