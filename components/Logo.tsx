"use client";
import React from "react";
import Image from "next/image";

type Props = {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
};

const Logo = React.memo(
  ({ size = "md", showText = true, className = "" }: Props) => {
    const sizeMap = {
      sm: { class: "w-10 h-10", width: 40, height: 40 },
      md: { class: "w-16 h-16", width: 64, height: 64 },
      lg: { class: "w-29 h-29", width: 116, height: 116 },
    } as const;

    const sizeConfig = sizeMap[size];

    return (
      <div className={`flex items-center ${className}`}>
        <div
          className={`flex-shrink-0 rounded-full overflow-hidden ${sizeConfig.class} shadow-md ring-1 ring-white/20 bg-white transform -translate-y-2`}
        >
          <Image
            src="/tefa.jpg"
            alt="TEFA logo"
            width={sizeConfig.width}
            height={sizeConfig.height}
            className="w-full h-full object-cover"
            priority={true}
            quality={85}
          />
        </div>

        {/* Wordmark only visible on md+ screens for a compact sidebar look */}
        {showText && (
          <div className="ml-3 hidden md:flex flex-col">
            <span className="text-white font-bold text-base leading-none">
              BCS
            </span>
            <span className="text-gray-300 text-xs leading-none">
              Inventaris
            </span>
          </div>
        )}
      </div>
    );
  }
);

Logo.displayName = "Logo";

export default Logo;
