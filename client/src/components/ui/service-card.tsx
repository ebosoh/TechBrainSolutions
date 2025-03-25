import { forwardRef, ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ServiceCardProps {
  className?: string;
  title: string;
  description: string;
  icon: ReactNode;
  onLearnMoreClick?: () => void;
}

export const ServiceCard = forwardRef<HTMLDivElement, ServiceCardProps>(
  ({ className, title, description, icon, onLearnMoreClick }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "relative bg-white/60 backdrop-filter backdrop-blur-md border border-primary/20 shadow-[0_6px_20px_-5px_rgba(52,183,104,0.15)] rounded-xl transition-all duration-300 overflow-hidden p-8 h-full",
          className
        )}
        initial={{ boxShadow: "0 6px 20px -5px rgba(52,183,104,0.15)" }}
        whileHover={{
          y: -8,
          boxShadow: "0 20px 30px -10px rgba(52,183,104,0.3)",
          borderColor: "rgba(52,183,104,0.4)",
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 15
        }}
      >
        {/* Background shine effect on hover */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0"
          initial={{ opacity: 0 }}
          whileHover={{ 
            opacity: 0.07,
            background: "linear-gradient(135deg, rgba(52,183,104,0) 0%, rgba(52,183,104,0.1) 50%, rgba(52,183,104,0) 100%)"
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Icon with animation */}
        <motion.div 
          className="relative bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-6"
          whileHover={{ 
            scale: 1.1,
            backgroundColor: "rgba(52,183,104,0.2)",
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 10
          }}
        >
          <motion.div
            whileHover={{ 
              y: [0, -5, 0],
              rotate: [-2, 2, -2],
            }}
            transition={{
              y: {
                repeat: Infinity,
                repeatType: "mirror",
                duration: 1.5,
                ease: "easeInOut"
              },
              rotate: {
                repeat: Infinity,
                repeatType: "mirror",
                duration: 2,
                ease: "easeInOut"
              }
            }}
          >
            {icon}
          </motion.div>
        </motion.div>

        {/* Content */}
        <motion.h3 
          className="text-xl font-heading font-bold mb-4"
          whileHover={{ color: "rgba(52,183,104,1)" }}
          transition={{ duration: 0.2 }}
        >
          {title}
        </motion.h3>
        
        <motion.p 
          className="opacity-80 mb-6"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {description}
        </motion.p>
        
        {/* Learn more link with enhanced hover effect */}
        <motion.a
          href="#contact"
          onClick={(e) => {
            e.preventDefault();
            onLearnMoreClick?.();
            document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          className="text-primary font-medium flex items-center group"
          whileHover={{ x: 3 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          Learn more
          <motion.svg
            className="w-4 h-4 ml-1 group-hover:ml-2 transition-all duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            whileHover={{ x: 2 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            ></path>
          </motion.svg>
        </motion.a>
      </motion.div>
    );
  }
);

ServiceCard.displayName = "ServiceCard";