"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, Files } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
    {
        href: "/chat",
        label: "Chat",
        icon: MessageSquare,
    },
    {
        href: "/documents",
        label: "Documents",
        icon: Files,
    },
];

export function Navigation({ className }: { className?: string }) {
    const pathname = usePathname();

    return (
        <nav className={cn("flex", className)}>
            {items.map((item) => {
                const isActive = pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-colors",
                            "hover:bg-zinc-800",
                            isActive ? "text-blue-500 bg-zinc-800/50" : "text-zinc-400",
                            className?.includes("flex-row") ? "flex-row gap-3 px-4 py-3 justify-start w-full" : "flex-1"
                        )}
                    >
                        <Icon size={24} className={cn(className?.includes("flex-row") ? "w-5 h-5" : "w-6 h-6")} />
                        <span className={cn("text-xs font-medium", className?.includes("flex-row") ? "text-sm" : "")}>
                            {item.label}
                        </span>
                    </Link>
                );
            })}
        </nav>
    );
}
