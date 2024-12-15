import { verifyUser } from "@/lib/verify";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try { 
        const user = await verifyUser(request);

        if (!user) {
            return NextResponse.json({
                data: null,
                success: false,
                message: "Unauthorized",
              }, {status: 401});
        }
        const {password, ...props} = user;

        return NextResponse.json({
            data: props,
            success: true,
            message: "Get current user success",
          }, {status: 200});

    } catch (err: any) {
        return NextResponse.json({
            data: null,
            success: false,
            message: err?.message || "Internal server error",
          }, {status: 500});
    }
}