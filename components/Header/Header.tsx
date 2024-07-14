import Link from "next/link";
import { eq } from "drizzle-orm";

import { validateSession } from "@/auth";
import { db } from "@/db/migrate";

import { getInitials } from "@/lib/utils";

import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/button";

import { UserAvatar } from "@/components/Header/UserAvatar";
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
        <header className="flex justify-between pb-3 pt-4 [grid-column:content]">
            <Typography
                variant="h2"
                as="h1"
            >
                Unitech
            </Typography>

            <div className="flex gap-6">
                <nav>
                    <ul className="flex gap-x-6">
                        {!currentUser && (
                            <li>
                                <Button
                                    variant={"outline"}
                                    asChild
                                >
                                    <Link href={"/login"}>Login</Link>
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
                        role={currentUser.role}
                    />
                )}
            </div>
        </header>
    );
}

export { Header };
