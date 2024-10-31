import { redirect } from "next/navigation";

import { validateSession } from "@/auth";

import { LoginCard } from "./LoginCard";

export const dynamic = "force-dynamic";

async function Home() {
    const { user } = await validateSession();

    if (user) return redirect("/dashboard");

    return <LoginCard />;
}

export default Home;
