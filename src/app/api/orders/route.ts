import prisma from "@/lib/prisma";
import { verifyUser } from "@/lib/verify";
import { orderSchema } from "@/schema/order";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";
import { ZodError } from "zod";


type OrderPayload = {
 productId: number;
 colorId: number;
 quantity: number;
};


export async function POST(request: Request) {
 try {
   const user = await verifyUser(request);

   if (!user) {
     return new NextResponse("Unauthorized", { status: 401 });
   }


   const body = await request.json();

   orderSchema.parse(body);


   if (body.items.length === 0) {
     return new NextResponse("Please add at least 1 product", { status: 400 });
   }

   const order = await prisma.$transaction(async (ctx) => {
     // Loop through items and check stock availability
     for (const item of body.items as OrderPayload[]) {
       const color = await ctx.color.findFirstOrThrow({
         where: {
           id: item.colorId,
           productId: item.productId,
         },
       });


       if (item.quantity > color.quantity) {
         throw new Error(
           `Requested quantity (${item.quantity}) exceeds available stock (${color.quantity}) for productId ${item.productId}`,
         );
       }
     }


     // Create the order
     const createdOrder = await ctx.order.create({
       data: {
         status: "PENDING",
         userId: user.id,
         items: {
           create: (body.items as OrderPayload[]).map((item) => ({
             colorId: item.colorId,
             productId: item.productId,
             quantity: item.quantity,
           })),
         },
       },
       include: {
         user: {
           select: {
             name: true,
           },
         },
       },
     });


     // Update stock for each item
     for (const item of body.items as OrderPayload[]) {
       await prisma.color.update({
         where: {
           id: item.colorId,
         },
         data: {
           quantity: {
             decrement: item.quantity,
           },
         },
       });
     }


     return createdOrder;
   });


   return NextResponse.json(order, { status: 201 });
 } catch (error: any) {
   if (error instanceof ZodError) {
     return NextResponse.json(error.issues[0], { status: 400 });
   } else if (error instanceof PrismaClientKnownRequestError) {
     return new NextResponse(error.message, { status: 400 });
   } else if (error instanceof Error) {
     return new NextResponse(error.message, { status: 400 });
   } else {
     return new NextResponse("Internal server error", { status: 500 });
   }
 }
}