"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="Переключить тему"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <Sun
        className={`h-[1.2rem] w-[1.2rem] transition-all ${
          theme === "dark"
            ? "rotate-90 scale-0"
            : "rotate-0 scale-100"
        }`}
      />
      <Moon
        className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${
          theme === "dark"
            ? "rotate-0 scale-100"
            : "-rotate-90 scale-0"
        }`}
      />
      <span className="sr-only">Переключить тему</span>
    </Button>
  );
}