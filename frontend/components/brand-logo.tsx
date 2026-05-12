"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface BrandLogoProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "horizontal" | "vertical" | "icon" | "mark";
  priority?: boolean;
}

export function BrandLogo({
  variant = "horizontal",
  priority = false,
  className,
  ...props
}: BrandLogoProps) {
  const { theme } = useTheme();

  const getLogoPath = () => {
    const isDark = theme === "dark";
    switch (variant) {
      case "vertical":
        return isDark ? "/Logo/Vertical-Dark.png" : "/Logo/Vertical-Light.png";
      case "icon":
      case "mark":
        return isDark
          ? "/Logo/Brandmark-Dark.png"
          : "/Logo/Brandmark-Light.png";
      case "horizontal":
      default:
        return isDark
          ? "/Logo/Horizontal-Dark.png"
          : "/Logo/Horizontal-Light.png";
    }
  };

  const getLogoSize = () => {
    switch (variant) {
      case "vertical":
        return { width: 60, height: 80 };
      case "icon":
      case "mark":
        return { width: 40, height: 40 };
      case "horizontal":
      default:
        return { width: 150, height: 40 };
    }
  };

  const { width, height } = getLogoSize();

  return (
    <div className={cn("relative", className)} {...props}>
      <Image
        src={getLogoPath()}
        alt="MeroPDF Logo"
        width={width}
        height={height}
        priority={priority}
        className="h-auto w-full"
      />
    </div>
  );
}
