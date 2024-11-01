import {userSignIn} from "@/schema/user";
import db from "@/lib/prisma";
import {SignJWT} from "jose";
import { NextResponse } from "next/server";
import { compareSync } from "bcrypt";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        userSignIn.parse(body);

        const user = await db.user.findFirst({
            where: {
                email: body.email,
            },
        });

        if (!user) {
            return new NextResponse("User not found", {status: 404});
        }

        if (user.roles !== "ADMIN") {
            return new NextResponse("User not admin", {status: 401});
        }

        const {password, ...props} = user;

        if (!compareSync(body.password, password)) {
            return new NextResponse("You are not authorized to access this route", {status: 401});
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const token = await new SignJWT({
            userId: user?.id,
            email: user?.email,
        })
        .setProtectedHeader({alg: "HS256"})
        .setIssuedAt()
        .setExpirationTime("1d")
        .sign(secret);

        return NextResponse.json({...props, token},  {status: 200});

    } catch (err: any) {
        console.log(err);

        return new NextResponse("Internal server error", {status: 500});
    }
}