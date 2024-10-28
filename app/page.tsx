import { validateSession } from "@/auth";
import { redirect } from "next/navigation";

import { LoginRequest } from "@/app/LoginRequest";

async function Home() {
    const { user } = await validateSession();

    if (user) return redirect("/dashboard");

    return <LoginRequest />;
}

export default Home;
