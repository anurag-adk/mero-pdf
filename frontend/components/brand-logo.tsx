"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface BrandLogoProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "horizontal" | "vertical" | "icon" | "mark";
  priority?: boolean;
  isLink?: boolean;
}

export function BrandLogo({
  variant = "horizontal",
  priority = false,
  isLink = true,
  className,
  ...props
}: BrandLogoProps) {
  const { theme } = useTheme();

  const getLogoPath = () => {
    // Light logo for dark background, dark logo for light background
    const isDark = theme === "dark";
    switch (variant) {
      case "vertical":
        return isDark ? "/Logo/Vertical-Light.png" : "/Logo/Vertical-Dark.png";
      case "icon":
      case "mark":
        return isDark
          ? "/Logo/Brandmark-Light.png"
          : "/Logo/Brandmark-Dark.png";
      case "horizontal":
      default:
        return isDark
          ? "/Logo/Horizontal-Light.png"
          : "/Logo/Horizontal-Dark.png";
    }
  };

  const getLogoSize = () => {
    switch (variant) {
      case "vertical":
        return { width: 200, height: 280 };
      case "icon":
      case "mark":
        return { width: 40, height: 40 };
      case "horizontal":
      default:
        return { width: 150, height: 40 };
    }
  };

  const { width, height } = getLogoSize();

  const content = (
    <div className={cn("relative", className)} {...props}>
      <Image
        src={getLogoPath()}
        alt="MeroPDF Logo"
        width={width}
        height={height}
        priority={priority}
        className="block h-full w-full object-contain"
      />
    </div>
  );

  if (isLink) {
    return (
      <Link
        href="/"
        className="inline-block cursor-pointer hover:opacity-80 transition-opacity"
      >
        {content}
      </Link>
    );
  }

  return content;
}
