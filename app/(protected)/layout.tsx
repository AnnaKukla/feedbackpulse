"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, LayoutDashboard, Layers, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import * as React from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const navLinks = [
  {
    href: "/dashboard",
    label: "Дашборд",
    icon: LayoutDashboard,
  },
  {
    href: "/widgets",
    label: "Виджеты",
    icon: Layers,
  },
  {
    href: "/settings",
    label: "Настройки",
    icon: Settings,
  },
];

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/auth");
  };

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="flex flex-col w-64 h-screen px-6 py-6 border-r border-border bg-card fixed left-0 top-0">
        {/* Logo */}
        <div className="mb-10">
          <Link href="/dashboard" className="flex items-center">
            <span className="text-xl font-bold tracking-tight">FeedbackPulse</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1">
          <ul className="space-y-2">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors hover:bg-muted hover:text-foreground",
                    pathname.startsWith(href)
                      ? "bg-muted font-medium"
                      : "text-muted-foreground"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto flex items-center gap-2">
          <Button
            variant="ghost"
            className="flex-1 flex items-center gap-3 px-3 py-2 text-muted-foreground justify-start"
            onClick={handleSignOut}
          >
            <LogOut className="w-5 h-5" />
            Выйти
          </Button>
          <ThemeToggle />
        </div>
      </aside>
      <main className="flex-1 ml-64 p-8">{children}</main>
    </div>
  );
}