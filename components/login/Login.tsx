"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { hash } from "bcryptjs";
import { loginFunction } from "@/actions/auth.actions";

import { getUserSaltByEmail } from "@/db/db";

import { loginFormSchema } from "@/types/loginSchema";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

function LoginForm() {
    const router = useRouter();
    const form = useForm<z.infer<typeof loginFormSchema>>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: z.infer<typeof loginFormSchema>) {
        try {
            const userSalt = await getUserSaltByEmail(values.email);

            if (!userSalt) throw new Error("Neplatné uživatelské jméno nebo heslo");

            const passwordHash = await hash(values.password, userSalt[0]?.salt);

            const response = await loginFunction({
                email: values.email,
                password: passwordHash,
            });

            if (response.success) {
                toast.success("Úspěšně jste se přihlásili");
                router.push("/");
            } else {
                throw new Error("Nastala chyba při přihlášení");
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Neočekávaná chyba");
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="max-w-prose space-y-4"
            >
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    autoComplete="email"
                                    placeholder="email@email.com"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Heslo</FormLabel>
                            <FormControl>
                                <Input
                                    type="password"
                                    placeholder="········"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="!mt-8 flex justify-between gap-8 *:w-24">
                    <Button
                        variant={"outline"}
                        asChild
                    >
                        <Link href="/">Jít zpět</Link>
                    </Button>

                    <Button type="submit">Přihlásit se</Button>
                </div>
            </form>
        </Form>
    );
}
export { LoginForm };
