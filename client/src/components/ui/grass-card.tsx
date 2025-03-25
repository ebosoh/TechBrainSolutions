import { forwardRef, HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const grassCardVariants = cva(
  "bg-white/60 backdrop-filter backdrop-blur-md border border-primary/20 shadow-[0_6px_20px_-5px_rgba(52,183,104,0.15)] rounded-xl transition-all duration-300",
  {
    variants: {
      variant: {
        default: "hover:translate-y-[-5px] hover:shadow-[0_12px_25px_-5px_rgba(52,183,104,0.25)]",
        static: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface GrassCardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof grassCardVariants> {}

export const GrassCard = forwardRef<HTMLDivElement, GrassCardProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(grassCardVariants({ variant }), className)}
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300 }}
        {...props}
      />
    );
  }
);

GrassCard.displayName = "GrassCard";
