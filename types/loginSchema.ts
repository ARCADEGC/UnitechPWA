import { z } from "zod";

export const loginFormSchema = z.object({
    email: z.string().min(1, "Email musí být vyplněn"),
    password: z.string().min(1, "Heslo musí být vyplněno")
});
