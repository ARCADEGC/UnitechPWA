import { validateSession } from "@/auth";
import { redirect } from "next/navigation";

import { Header } from "@/components/Header/Header";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user } = await validateSession();

    return !user ?
            redirect("/")
        :   <div className="grid grid-cols-[inherit] [grid-column:page]">
                <Header />
                <section className="py-8 [grid-column:content]">{children}</section>
            </div>;
}
