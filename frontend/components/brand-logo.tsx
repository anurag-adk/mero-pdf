import Image from "next/image";

import { cn } from "@/lib/utils";

type BrandLogoVariant = "mark" | "horizontal" | "vertical";

interface BrandLogoProps {
  variant?: BrandLogoVariant;
  className?: string;
  textClassName?: string;
  priority?: boolean;
}

const ASSETS = {
  mark: {
    light: "/Logo/Brandmark-Light.png",
    dark: "/Logo/Brandmark-Dark.png",
    alt: "MeroPDF brandmark",
  },
  horizontal: {
    light: "/Logo/Horizontal-Light.png",
    dark: "/Logo/Horizontal-Dark.png",
    alt: "MeroPDF horizontal logo",
  },
  vertical: {
    light: "/Logo/Vertical-Light.png",
    dark: "/Logo/Vertical-Dark.png",
    alt: "MeroPDF vertical logo",
  },
} as const;

export function BrandLogo({
  variant = "horizontal",
  className,
  textClassName,
  priority = false,
}: BrandLogoProps) {
  const asset = ASSETS[variant];

  if (variant === "mark") {
    return (
      <span
        className={cn(
          "relative inline-flex items-center justify-center",
          className,
        )}
      >
        <Image
          src={asset.dark}
          alt={asset.alt}
          width={40}
          height={40}
          priority={priority}
          className="block dark:hidden"
        />
        <Image
          src={asset.light}
          alt={asset.alt}
          width={40}
          height={40}
          priority={priority}
          className="hidden dark:block"
        />
      </span>
    );
  }

  if (variant === "vertical") {
    return (
      <div
        className={cn(
          "flex flex-col items-center gap-3 text-center",
          className,
        )}
      >
        <div className="relative h-auto w-full max-w-[220px]">
          <Image
            src={asset.dark}
            alt={asset.alt}
            width={220}
            height={120}
            priority={priority}
            className="block h-auto w-full dark:hidden"
          />
          <Image
            src={asset.light}
            alt={asset.alt}
            width={220}
            height={120}
            priority={priority}
            className="hidden h-auto w-full dark:block"
          />
        </div>
        <span
          className={cn(
            "brand-mono text-[0.7rem] uppercase text-muted-foreground",
            textClassName,
          )}
        >
          Intelligent document query
        </span>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative h-auto w-[180px] max-w-full sm:w-[200px]">
        <Image
          src={asset.dark}
          alt={asset.alt}
          width={200}
          height={48}
          priority={priority}
          className="block h-auto w-full dark:hidden"
        />
        <Image
          src={asset.light}
          alt={asset.alt}
          width={200}
          height={48}
          priority={priority}
          className="hidden h-auto w-full dark:block"
        />
      </div>
    </div>
  );
}
