import { forwardRef, ReactNode, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export interface ServiceCardProps {
  className?: string;
  title: string;
  description: string;
  icon: ReactNode;
  detailedInfo?: {
    trendingServices: string[];
    trendingProducts: string[];
  };
  onLearnMoreClick?: () => void;
}

// Create a separate Modal component
const DetailModal = ({ 
  isOpen, 
  onClose, 
  title, 
  description, 
  icon, 
  detailedInfo 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  title: string; 
  description: string; 
  icon: ReactNode; 
  detailedInfo: { 
    trendingServices: string[]; 
    trendingProducts: string[]; 
  }; 
}) => {
  // Effect to prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold font-heading flex items-center">
            <span className="mr-3">{icon}</span>
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <p className="text-gray-700 mb-6">{description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Services */}
          <div>
            <h3 className="text-lg font-bold text-primary mb-4 border-b border-primary/20 pb-2">
              Services
            </h3>
            <ul className="space-y-3">
              {detailedInfo.trendingServices.map((service, index) => (
                <li
                  key={index}
                  className="flex items-start"
                >
                  <span className="text-primary mr-2 mt-1">•</span>
                  <span>{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-lg font-bold text-primary mb-4 border-b border-primary/20 pb-2">
              Products
            </h3>
            <ul className="space-y-3">
              {detailedInfo.trendingProducts.map((product, index) => (
                <li
                  key={index}
                  className="flex items-start"
                >
                  <span className="text-primary mr-2 mt-1">•</span>
                  <span>{product}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            onClick={() => {
              onClose();
              const contactSection = document.querySelector('#contact');
              if (contactSection) {
                const topOffset = contactSection.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({
                  top: topOffset,
                  behavior: 'smooth'
                });
              }
            }}
          >
            Get in Touch
          </button>
        </div>
      </div>
    </div>
  );
};

export const ServiceCard = forwardRef<HTMLDivElement, ServiceCardProps>(
  ({ className, title, description, icon, detailedInfo, onLearnMoreClick }, ref) => {
    const [showDetailedInfo, setShowDetailedInfo] = useState(false);
    
    return (
      <>
        <motion.div
          ref={ref}
          className={cn(
            "relative bg-white/60 backdrop-filter backdrop-blur-md border border-primary/20 shadow-[0_6px_20px_-5px_rgba(47,114,223,0.15)] rounded-xl transition-all duration-300 overflow-hidden p-8 h-full group",
            className
          )}
          initial={{ boxShadow: "0 6px 20px -5px rgba(47,114,223,0.15)" }}
          whileHover={{
            y: -8,
            boxShadow: "0 20px 30px -10px rgba(47,114,223,0.3)",
            borderColor: "rgba(47,114,223,0.4)",
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
              background: "linear-gradient(135deg, rgba(47,114,223,0) 0%, rgba(47,114,223,0.1) 50%, rgba(47,114,223,0) 100%)"
            }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Animated border */}
          <div className="service-card-border" />

          {/* Icon with animation */}
          <motion.div 
            className="relative bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-6"
            whileHover={{ 
              scale: 1.1,
              backgroundColor: "rgba(47,114,223,0.2)",
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 10
            }}
          >
            <motion.div
              animate={{ 
                y: [0, -3, 0],
              }}
              whileHover={{ 
                y: [0, -5, 0],
                rotate: [-2, 2, -2],
              }}
              transition={{
                y: {
                  repeat: Infinity,
                  repeatType: "mirror",
                  duration: 3,
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
            className="text-xl font-heading font-bold mb-4 relative inline-block"
            whileHover={{ 
              color: "rgba(47,114,223,1)",
              x: 3 
            }}
            transition={{ 
              duration: 0.2,
              x: { type: "spring", stiffness: 300, damping: 10 }
            }}
          >
            {title}
            <motion.span 
              className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary"
              whileHover={{ 
                width: "100%", 
                height: "2px" 
              }}
              transition={{ duration: 0.3, delay: 0.1 }}
            />
          </motion.h3>
          
          <motion.p 
            className="opacity-80 mb-6"
            whileHover={{ 
              opacity: 1,
              x: 2
            }}
            transition={{ 
              duration: 0.2,
              x: { type: "spring", stiffness: 200, damping: 15 }
            }}
          >
            {description}
          </motion.p>
          
          {/* Learn more button with enhanced hover effect */}
          <motion.button
            onClick={() => {
              if (detailedInfo) {
                setShowDetailedInfo(true);
              } else if (onLearnMoreClick) {
                onLearnMoreClick();
              }
            }}
            className="text-primary font-medium flex items-center group cursor-pointer relative z-10"
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
          </motion.button>
        </motion.div>

        {/* Simplified modal implementation */}
        {detailedInfo && (
          <DetailModal
            isOpen={showDetailedInfo}
            onClose={() => setShowDetailedInfo(false)}
            title={title}
            description={description}
            icon={icon}
            detailedInfo={detailedInfo}
          />
        )}
      </>
    );
  }
);

ServiceCard.displayName = "ServiceCard";