import { jwtVerify } from "jose";
import db from "@/lib/prisma";

export async function verifyUser(request: Request) {
    try {
        const authHeader = request.headers.get("authorization");
        console.log(authHeader);
        const token = authHeader?.split(" ")[1];
        console.log(token);
        
        if (!token) {
            return null;
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);

        const user = await db.user.findFirstOrThrow({
            where: {
                id: payload.userId as number,
            },
        });

        // if (user.roles !== "ADMIN"){
        //     return null;
        // } else {
            return user;
        // }

    } catch (err: any) {
        return null;
    }
}