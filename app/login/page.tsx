import { redirect } from "next/navigation";

import { validateSession } from "@/auth";

import { LoginForm } from "@/components/login/Login";

import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Typography } from "@/components/ui/Typography";

async function Home() {
    const { user } = await validateSession();

    if (user) return redirect("/dashboard");

    return (
        <div className="grid gap-2 py-12 [grid-column:content]">
            <Card className="mx-auto w-full max-w-[32ch]">
                <CardHeader>
                    <Typography variant="h2">Login</Typography>
                    <CardDescription>Log into your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <LoginForm />
                </CardContent>
            </Card>
        </div>
    );
}

export default Home;
