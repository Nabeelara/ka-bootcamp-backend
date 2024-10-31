import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { productSchema } from "@/schema/product";
import { ZodError } from "zod";
import prisma from "@/lib/prisma";

type Color ={
    color: string;
    quantity: number;
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
    
        productSchema.parse(body);
    
        const category = await prisma.category.findFirst({
          where: {
            id: body.categoryId,
          },
        });
    
        if (!category) {
          return NextResponse.json(
            {
              data: null,
              success: false,
              message: "Category not found",
            },
            {
              status: 404,
            },
          );
        }
    
        const product = await prisma.product.create({
          data: {
            name: body.name,
            price: body.price,
            company: body.company,
            images: body.images,
            categoryId: body.categoryId,
            description: body.description,
          },
        });
    
        await prisma.color.createMany({
          data: body.colors.map((color: Color) => ({
            color: color.color,
            quantity: color.quantity,
            productId: product.id,
          })),
        });
    
        return NextResponse.json(
          {
            data: product,
            success: true,
            message: "Create product success",
          },
          {
            status: 201,
          },
        );
      }  catch (err: any) {
      if (err instanceof ZodError) {
        return NextResponse.json(
          {
            data: null,
            success: false,
            message: err.issues[0],
          },
          {
            status: 400,
          },
        );
      } else {
        return NextResponse.json(
          {
            data: null,
            success: false,
            message: err?.message || "Internal server error",
          },
          {
            status: 500,
          },
        );
      }
    }
  }

export async function GET() {
    try {

        const products = await prisma.product.findMany();

        return NextResponse.json({
            data: products
        })
    } catch (err:any) {
        return NextResponse.json({
            data: null,
            success: false,
            message: err?.message || "Internal server error",
          });
    }
}