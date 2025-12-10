"use client";

import React from "react";
import { useTheme } from "./theme-provider";
import { FaMoon, FaSun } from "react-icons/fa";

export default function ThemeToggle() {
  const { isLight, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-full transition-all duration-300 ${
        isLight
          ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
          : "bg-slate-800 text-yellow-400 hover:bg-slate-700"
      }`}
      aria-label="Toggle Theme"
    >
      {isLight ? <FaMoon className="w-5 h-5" /> : <FaSun className="w-5 h-5" />}
    </button>
  );
}
