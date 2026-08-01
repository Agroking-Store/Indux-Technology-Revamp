"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const currentTheme = theme === "system" ? resolvedTheme : theme;

  const toggleTheme = useCallback(() => {
    const nextTheme = currentTheme === "dark" ? "light" : "dark";

    if (typeof document.startViewTransition !== "function") {
      setTheme(nextTheme);
      return;
    }

    const button = buttonRef.current;
    if (!button) {
      setTheme(nextTheme);
      return;
    }

    const { top, left, width, height } = button.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;

    const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
    const maxRadius = Math.hypot(
      Math.max(x, viewportWidth - x),
      Math.max(y, viewportHeight - y)
    );

    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${maxRadius}px at ${x}px ${y}px)`,
    ];

    const root = document.documentElement;
    root.setAttribute("data-theme-transitioning", "active");

    const cleanup = () => {
      root.removeAttribute("data-theme-transitioning");
    };

    const transition = document.startViewTransition(() => {
      const isDark = nextTheme === "dark";
      document.documentElement.classList.toggle("dark", isDark);
      document.documentElement.classList.toggle("light", !isDark);
      setTheme(nextTheme);
    });

    if (transition && typeof transition.finished?.finally === "function") {
      transition.finished.finally(cleanup);
    } else {
      cleanup();
    }

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath,
        },
        {
          duration: 400,
          easing: "ease-in-out",
          fill: "forwards",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  }, [currentTheme, setTheme]);

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="w-9 h-9 cursor-default opacity-50">
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <Button
      ref={buttonRef}
      variant="outline"
      size="icon"
      className="w-9 h-9 cursor-pointer"
      onClick={toggleTheme}
      aria-label="Toggle Theme"
    >
      {currentTheme === "dark" ? (
        <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-400" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      )}
    </Button>
  );
}