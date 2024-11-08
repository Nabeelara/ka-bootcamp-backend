import prisma from "@/lib/prisma";
import { verifyUser } from "@/lib/verify";
import { NextResponse } from "next/server";
import { categorySchema } from "@/schema/category";
import { ZodError } from "zod";

export async function POST(request: Request) {
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
  
      const category = await prisma.category.create({
        data: {
          name: body.name,
        },
      });
  
      return NextResponse.json({
        data: category,
        success: true,
        message: "Create category success",
      });
      
    } catch (err: any) {
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

        const categories = await prisma.category.findMany();

        return NextResponse.json({
            data:categories,
            success:true,
            message: "Get category success"
        })
    } catch (err:any) {
        return NextResponse.json({
            data: null,
            success: false,
            message: err?.message || "Internal server error",
          });
    }
}

