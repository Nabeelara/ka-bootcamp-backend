"use server";

import prisma from "@/lib/prisma";
import { userSignIn } from "@/schema/user";
import { compareSync } from "bcrypt";
import { SignJWT } from "jose";
import { ZodError } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { categorySchema } from "../schema/category";
import { productSchema } from "@/schema/product";
import { Flavour } from "@prisma/client";

interface Color {
  color: string;
  quantity: number;
}

export async function signIn(formData: FormData) {
  try {
    // Tangkap data dari request
    const body = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    // Validasi data dari request
    userSignIn.parse(body);

    // Cari user berdasarkan email
    const user = await prisma.user.findUnique({
      where: {
        email: body.email as string,
      },
    });

    // Cek apakah user ada didalam database
    if (!user) {
      throw new Error("Email or password is wrong");
    }

    if (user?.roles !== "ADMIN") {
      throw new Error("You are not authorized to access this resource");
    }

    if (!compareSync(body.password as string, user.password)) {
      throw new Error("Email or password is wrong");
    }

    // Membuat secret
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({
      userId: user.id,
      email: user.email,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1d")
      .sign(secret);

    const { password, ...props } = user;

    //setting cookie
    (await cookies()).set("token", token);

    return { token };

  } catch (err: any) {
    console.log(err);
    if (err instanceof ZodError) {
      return { error: "Please insert a correct data" };
    } else {
      return { error: err?.message || "Internal server error" };
    }
  }
}

export async function logOut() {
    // console.log("logout");
    (await cookies()).delete("token");
    redirect("/auth/signin");
}

export async function createCategory(formData: FormData) {
  try {
    const body = {
      name: formData.get("name"),
      isActive: formData.get("isActive"),
      description: formData.get("description"),
    };
    categorySchema.parse(body);

    const category = await prisma.category.create({
      data: {
        name: body.name as string,
        isActive: body.isActive === "1" ? true : false,
      },
    });

    return { success: "Category created successfully", data: category };
  } catch (err: any) {
    console.log();
    if (err instanceof ZodError) {
        return { error: "Please insert a correct data" };
      } else {
        return { error: err?.message || "Internal server error" };
      }
  }
}

export async function updateCategory(categoryId: string, formData: FormData) {
  try {
    const body = {
      name: formData.get("name"),
      isActive: formData.get("isActive"),
      description: formData.get("description"),
    };
    categorySchema.parse(body);

    const category = await prisma.category.update({
      where: { id: parseInt(categoryId) },
      data: {
        name: body.name as string,
        isActive: body.isActive === "1" ? true : false,
        description: body.description as string,
      },
    });

    return { success: "Category updated successfully", data: category };
  } catch (err: any) {
    if (err instanceof ZodError) {
      return { error: "Please insert a correct data" };
    } else {
      return { error: err?.message || "Internal server error" };
    }
  }
}

export async function deleteCategory(categoryId: string) {
 try {
    await prisma.category.delete({
        where: {
            id: parseInt(categoryId),
        },
    });

    return { success: "Category deleted successfully" };
  } catch (err: any) {
    return { error: err?.message || "Internal server error" };
  }
}

export async function createProduct(
  formData: FormData,
  flavours: {
    name:string,
    color: string;
    quantity: number
  }[],
  images: string[],
) {
  try {
    const body = {
      name: formData.get("name"),
      description: formData.get("description"),
      categoryId: Number(formData.get("categoryId")),
      price: Number(formData.get("price")),
      company: formData.get("company"),
      images,
      flavours,
    };

    productSchema.parse(body);

    const product = await prisma.product.create({
      data: {
        name: body.name as string,
        description: body.description as string,
        categoryId: Number(body.categoryId),
        images: body.images,
        price: Number(body.price),
        company: body.company as string,
      },
    });

    for (const flavour of flavours) {
      await prisma.flavour.create({
        data: {
          color: flavour.color,
          quantity: flavour.quantity,
          productId: product.id,
          name: flavour.name
        },
      });
    }

    return {
      success: true,
      data: product,
    };
  } catch (err: any) {
    console.log(err);
    if (err instanceof ZodError) {
      return { success: false, error: "Please insert a correct data" };
    } else {
      return { success: false, error: err?.message || "Internal server error" };
    }
  }
}

export async function updateProduct(productId: number, formData: any, images: string[], flavours: {
  id?: number;
  color: string;
  quantity: number,
  name:string 
}[], idsFlavour: number[],) {
  try {
    // Ekstrak data dari formData
    const body = {
      name: formData.get("name"),
      description: formData.get("description"),
      categoryId: Number(formData.get("categoryId")),
      price: Number(formData.get("price")),
      company: formData.get("company"),
      images,
      flavours,
    };
    
    // console.log("delete", idsColor)
    
    // Validasi data dengan schema
    productSchema.parse(body);

    // Lakukan pembaruan di database
    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        name: body.name as string,
        description: body.description as string,
        categoryId: Number(body.categoryId),
        images: body.images,
        price: Number(body.price),
        company: body.company as string,
      },
    });

    for (const flavour of flavours) {
      if (flavour.id) {
        await prisma.flavour.update({
          where: {
            id: flavour.id
          },
          data: {
            color: flavour.color,
            quantity: flavour.quantity,
            name: flavour.name
          }
        })
      } else {
        await prisma.flavour.create({
          data: {
            color: flavour.color,
            quantity: flavour.quantity,
            productId: product.id,
            name: flavour.name
          }
        })
      }
    }

    for (const id of idsFlavour) {
      await prisma.flavour.delete({
        where: {
          id: id
        }
      })
    }

    // Return sukses
    return { success: "Product updated successfully", data: product };
  } catch (err: any) {
    console.log(err)
    
    // Tangani error validasi
    if (err instanceof ZodError) {
      return { error: "Please insert correct data" };
    }
    // Tangani error lainnya
    return { error: err?.message || "Internal server error" };
  }
}

export async function deleteProduct(productId: number) {
  try {
    // Periksa apakah record ada
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return { error: "Product not found." };
    }

    // Jika ada, hapus record
    await prisma.product.delete({
      where: { id: productId },
    });

    return { success: "Product deleted successfully." };
  } catch (err: any) {
    return { error: err?.message || "Failed to delete product." };
  }
}
