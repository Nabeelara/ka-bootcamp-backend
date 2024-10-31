import {z} from "zod";

export const userSignUp = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
    phoneNumber: z.string(),
    roles: z.enum(["ADMIN", "CUSTOMER"]),
});