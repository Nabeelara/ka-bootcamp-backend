import { NextResponse, NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    if (request.nextUrl.pathname.includes("/api/")) {
        const res = NextResponse.next();
        res.headers.set("Access-Control-Allow-Origin", process.env.DOMAIN_NAME || "*");
        res.headers.set(
            "Access-Control-Allow-Methods",
            "GET, POST, PUT DELETE, OPTIONS"
        );
        res.headers.set(
            "Access-Control-Allow-Headers",
            "Content-Type, Authorization"
        );
        if(request.method === "OPTIONS") {
            return new NextResponse(null, { status: 204 });
        }
        return res;
    }
    const token = request.cookies.get("token")?.value;

    if (!token) {
        return NextResponse.redirect(new URL("/auth/signin", request.url));
    } else {
        return NextResponse.next();
    }
}

export const config = {
    matcher: [ "/", "/products/:path*",  "/categories/:path*", "/orders/:path*", "/users/:path*"],
};