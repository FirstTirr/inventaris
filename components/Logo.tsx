"use client";
import React from "react";

type Props = {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
};

export default function Logo({
  size = "md",
  showText = true,
  className = "",
}: Props) {
  const sizeMap = {
    sm: "w-10 h-10",
    md: "w-16 h-16",
    lg: "w-29 h-29",
  } as const;

  return (
    <div className={`flex items-center ${className}`}>
      <div
        className={`flex-shrink-0 rounded-full overflow-hidden ${sizeMap[size]} shadow-md ring-1 ring-white/20 bg-white transform -translate-y-2`}
      >
        <img
          src="/tefa.jpg"
          alt="TEFA logo"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Wordmark only visible on md+ screens for a compact sidebar look */}
      {showText && (
        <div className="ml-3 hidden md:flex flex-col">
          <span className="text-white font-bold text-base leading-none">
            BCS
          </span>
          <span className="text-gray-300 text-xs leading-none">Inventaris</span>
        </div>
      )}
    </div>
  );
}
