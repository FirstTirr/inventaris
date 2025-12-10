"use client";

import { FaSun, FaMoon } from "react-icons/fa";
import { useTheme } from "./theme-provider";

export default function ThemeToggle({ className }: { className?: string }) {
  const { isLight, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-lg transition-colors ${
        isLight
          ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
          : "bg-white/10 text-white hover:bg-white/20"
      } ${className}`}
    >
      {isLight ? <FaMoon /> : <FaSun />}
    </button>
  );
}
