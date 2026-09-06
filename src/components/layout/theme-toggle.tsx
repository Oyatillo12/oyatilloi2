"use client";

import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const t = useTranslations("ThemeToggle");
  const { resolvedTheme, setTheme } = useTheme();

  // The active theme is unknown while rendering on the server, so both icons
  // are rendered and the `dark` class on <html> decides which one is visible.
  // That keeps the markup stable across hydration without a mounted flag.
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label={t("label")}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <MoonIcon className="dark:hidden" />
      <SunIcon className="hidden dark:block" />
    </Button>
  );
}
