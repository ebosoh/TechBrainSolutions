import { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface GrassTextureProps extends HTMLAttributes<HTMLDivElement> {}

export const GrassTexture = forwardRef<HTMLDivElement, GrassTextureProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-white/60 backdrop-filter backdrop-blur-md border border-primary/20 shadow-[0_10px_30px_-10px_rgba(52,183,104,0.2)] rounded-2xl",
          className
        )}
        {...props}
      />
    );
  }
);

GrassTexture.displayName = "GrassTexture";
