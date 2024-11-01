import {z} from "zod";

export const userSignUp = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
    phoneNumber: z.string(),
    roles: z.enum(["ADMIN", "CUSTOMER"]),
});

export const userSignIn = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long")
});
