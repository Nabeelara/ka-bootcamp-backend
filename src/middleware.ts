import { NextResponse } from "next/server";

export async function middleware(request: NextResponse){
    const token = request.cookies.get("token")?.value;

    if (!token) {
        return NextResponse.redirect(new URL("/auth/sign-in", request.url))
    }

    return NextResponse.next();
};

export const config = {
    matcher: ["/", "/products/:path*", "/categories/:path*"],
};