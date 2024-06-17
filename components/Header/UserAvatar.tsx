"use client";

import { LogOut } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { logOut } from "@/actions/auth.actions";

import type { TUser } from "@/types/dbSchemas";

function UserAvatar({
    avatarInitials,
    username,
    role,
}: {
    avatarInitials: string;
    username: TUser["name"];
    role?: TUser["role"];
}) {
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger className="rounded-full">
                    <Avatar>
                        <AvatarFallback>{avatarInitials}</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>{username}</DropdownMenuItem>
                    {role && <DropdownMenuItem>{role}</DropdownMenuItem>}

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        className="flex items-center gap-1"
                        onClick={() => logOut()}
                    >
                        <LogOut className="size-4 stroke-muted-foreground" />
                        Log Out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}

export { UserAvatar };
