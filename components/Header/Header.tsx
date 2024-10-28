import { validateSession } from "@/auth";
import { getInitials } from "@/lib/utils";
import { eq } from "drizzle-orm";
import Link from "next/link";

import { db } from "@/db/migrate";

import { UserAvatar } from "@/components/Header/UserAvatar";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";

async function Header() {
    const { user } = await validateSession();

    const currentUser =
        user ?
            await db.query.User.findFirst({
                where: (table) => eq(table.id, user.id),
            })
        :   null;

    return (
        <div className="grid w-full grid-cols-[inherit] border-b [grid-column:page] print:hidden">
            <header className="flex justify-between pb-3 pt-4 [grid-column:content]">
                <Link href={"/dashboard"}>
                    <Typography
                        variant="h2"
                        as="h1"
                    >
                        Unitech
                    </Typography>
                </Link>

                <div className="flex gap-6">
                    <nav>
                        <ul className="flex gap-x-6">
                            {!currentUser && (
                                <li>
                                    <Button
                                        variant={"outline"}
                                        asChild
                                    >
                                        <Link href={"/login"}>Přihlásit se</Link>
                                    </Button>
                                </li>
                            )}
                        </ul>
                    </nav>

                    <ModeToggle />

                    {currentUser && (
                        <UserAvatar
                            avatarInitials={getInitials(currentUser.name)}
                            username={currentUser.name}
                            userRole={currentUser?.role ?? false}
                        />
                    )}
                </div>
            </header>
        </div>
    );
}

export { Header };
