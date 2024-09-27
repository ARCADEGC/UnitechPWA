"use client";

import React, { memo } from "react";

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

const MemoizedAvatar = memo(Avatar);

const MemoizedDropdownMenuTrigger = memo(DropdownMenuTrigger);

const MemoizedDropdownMenu = memo(DropdownMenu);

function UserAvatar({
    avatarInitials,
    username,
    userRole = false,
}: {
    avatarInitials: string;
    username: string;
    userRole: boolean;
}) {
    return (
        <>
            <MemoizedDropdownMenu>
                <MemoizedDropdownMenuTrigger className="rounded-full">
                    <MemoizedAvatar>
                        <AvatarFallback>{avatarInitials}</AvatarFallback>
                    </MemoizedAvatar>
                </MemoizedDropdownMenuTrigger>

                <DropdownMenuContent>
                    <DropdownMenuLabel>Můj účet</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>{username}</DropdownMenuItem>
                    <DropdownMenuItem>{userRole ? "Administrátor" : "Montér"}</DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        className="flex items-center gap-1"
                        onClick={() => logOut()}
                    >
                        <LogOut className="size-4 stroke-muted-foreground" />
                        Odhlásit se
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </MemoizedDropdownMenu>
        </>
    );
}

export { UserAvatar };
