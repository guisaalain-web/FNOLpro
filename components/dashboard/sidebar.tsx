"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    FileText,
    Home,
    LayoutDashboard,
    LogOut,
    Settings,
    ShieldCheck,
    User,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname();
    const { data: session } = useSession();
    const isAdmin = (session?.user as any)?.role === "ADMIN";

    const routes = [
        {
            label: "Overview",
            icon: LayoutDashboard,
            href: "/dashboard",
            active: pathname === "/dashboard",
        },
        {
            label: "My Claims",
            icon: FileText,
            href: "/dashboard/claims",
            active: pathname.startsWith("/dashboard/claims") && pathname !== "/dashboard/claims/new",
        },
        {
            label: "New Claim",
            icon: ShieldCheck,
            href: "/dashboard/claims/new",
            active: pathname === "/dashboard/claims/new",
        },
    ];

    if (isAdmin) {
        routes.push({
            label: "Admin Panel",
            icon: Settings,
            href: "/admin",
            active: pathname.startsWith("/admin"),
        });
    }

    return (
        <div className={cn("pb-12 h-screen border-r bg-card", className)}>
            <div className="space-y-4 py-4 flex flex-col h-full">
                <div className="px-3 py-2 flex-1">
                    <Link href="/dashboard" className="flex items-center pl-3 mb-14">
                        <h1 className="text-2xl font-bold tracking-tight text-primary">
                            FNOL <span className="text-foreground">Pro</span>
                        </h1>
                    </Link>
                    <div className="space-y-1">
                        {routes.map((route) => (
                            <Link
                                key={route.href}
                                href={route.href}
                                className={cn(
                                    "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
                                    route.active ? "text-primary bg-primary/10" : "text-muted-foreground"
                                )}
                            >
                                <div className="flex items-center flex-1">
                                    <route.icon className={cn("h-5 w-5 mr-3", route.active ? "text-primary" : "text-muted-foreground")} />
                                    {route.label}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="px-3 py-2">
                    <div className="flex items-center gap-x-2 px-3 py-2 text-sm text-muted-foreground font-medium border-t pt-4">
                        <User className="h-4 w-4" />
                        <div className="truncate shrink max-w-[150px]">
                            {session?.user?.email}
                        </div>
                    </div>
                    <button
                        onClick={() => signOut({ callbackUrl: "/auth/login" })}
                        className="mt-2 text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-destructive hover:bg-destructive/10 rounded-lg transition text-muted-foreground"
                    >
                        <div className="flex items-center flex-1">
                            <LogOut className="h-5 w-5 mr-3 group-hover:text-destructive" />
                            Logout
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
