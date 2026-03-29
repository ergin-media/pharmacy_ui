import { LogOut } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { useAuth } from "../hooks/useAuth";
import { useLogoutMutation } from "../hooks/useLogoutMutation";

function getInitials(firstName?: string, lastName?: string) {
    const first = (firstName ?? "").trim().charAt(0);
    const last = (lastName ?? "").trim().charAt(0);

    const initials = `${first}${last}`.toUpperCase();
    return initials || "U";
}

function getDisplayName(firstName?: string, lastName?: string, email?: string) {
    const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();
    return fullName || email || "Unbekannter Nutzer";
}

export function AppUserMenu() {
    const auth = useAuth();
    const logoutMutation = useLogoutMutation();

    const user = auth.user;

    if (!user) return null;

    const displayName = getDisplayName(
        user.first_name,
        user.last_name,
        user.email,
    );

    const subtitle = user.email || "—";
    const initials = getInitials(user.first_name, user.last_name);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <button
                    type="button"
                    className="ml-auto flex items-center gap-3 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
                >
                    <Avatar className="size-9">
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>

                    <div className="min-w-0">
                        <div className="truncate text-sm font-medium text-foreground">
                            {displayName}
                        </div>
                        <div className="truncate text-xs text-muted-foreground">
                            {subtitle}
                        </div>
                    </div>
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem
                    onClick={() => logoutMutation.mutate()}
                    disabled={logoutMutation.isPending}
                >
                    <LogOut className="size-4" />
                    <span>Ausloggen</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}