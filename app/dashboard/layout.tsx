import { validateSession } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user } = await validateSession();

    return !user ? redirect("/") : children;
}
