"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Files } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
    {
        href: "/documents",
        label: "Documents",
        icon: Files,
    },
];

export function Navigation({ className, onItemClick }: { className?: string; onItemClick?: () => void }) {
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
                        onClick={onItemClick}
                        className={cn(
                            "flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl transition-all",
                            "hover:bg-muted/50 active:scale-[0.98]",
                            isActive ? "text-primary bg-primary/10 shadow-sm border border-primary/5" : "text-muted-foreground/60",
                            className?.includes("flex-row") ? "flex-row gap-4 px-5 py-4 justify-start w-full border border-transparent" : "flex-1"
                        )}
                    >
                        <Icon size={24} className={cn(className?.includes("flex-row") ? "w-5 h-5" : "w-6 h-6", isActive ? "text-primary" : "text-muted-foreground/40")} />
                        <span className={cn("text-[11px] font-black uppercase tracking-widest", className?.includes("flex-row") ? "text-sm normal-case tracking-tight font-bold" : "")}>
                            {item.label}
                        </span>
                    </Link>
                );
            })}
        </nav>
    );
}
