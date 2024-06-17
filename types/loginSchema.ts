import { z } from "zod";

export const loginFormSchema = z.object({
    email: z.string().min(1, "Username must be provided").email(),
    password: z.string().min(1, "Password must be provided"),
});
