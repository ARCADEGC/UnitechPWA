import { z } from "zod";

export const registerFormSchema = z
    .object({
        username: z
            .string()
            .min(1, "Username must be provided")
            .max(50, "Username must be 50 characters up most"),
        email: z.string().email(),
        password: z.string().min(4, "Password must be at least 4 characters long"),
        passwordConfirm: z.string().min(4, "Password must be at least 4 characters long"),
    })
    .refine((data) => data.password === data.passwordConfirm, {
        message: "Passwords do not match",
        path: ["passwordConfirm"],
    });
