import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { categorySchema } from "@/schema/category";
import { ZodError } from "zod";

export async function POST(request: Request) {
    try {
      const body = await request.json();
      categorySchema.parse(body);
  
      const db = new PrismaClient();
  
      const category = await db.category.create({
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

        const db = new PrismaClient();

        const categories = await db.category.findMany();

        return NextResponse.json({
            
        })
    } catch (err:any) {
        return NextResponse.json({
            data: null,
            success: false,
            message: err?.message || "Internal server error",
          });
    }
}