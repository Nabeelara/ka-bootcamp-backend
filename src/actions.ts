"use server";

import prisma from "@/lib/prisma";
import { userSignIn } from "@/schema/user";
import { compareSync } from "bcrypt";
import { SignJWT } from "jose";
import { ZodError } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { categorySchema } from "./schema/category";

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
    cookies().set("token", token);

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
    cookies().delete("token");
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