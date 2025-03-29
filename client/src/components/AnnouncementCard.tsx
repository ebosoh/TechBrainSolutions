import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, ArrowUpRight, ChevronRight } from "lucide-react";

interface AnnouncementCardProps {
  message: string;
  ctaText: string;
  ctaLink: string;
  onClose: () => void;
  showDelay?: number;
}

export default function AnnouncementCard({
  message,
  ctaText,
  ctaLink,
  onClose,
  showDelay = 1500 // Default delay of 1.5 seconds
}: AnnouncementCardProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Show announcement after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, showDelay);

    return () => clearTimeout(timer);
  }, [showDelay]);

  const handleClose = () => {
    setIsVisible(false);
    // Give time for the animation to complete before unmounting
    setTimeout(onClose, 500);
  };

  // Star animation
  const starAnimation = {
    rotate: [0, 15, -15, 10, -10, 5, -5, 0],
    scale: [1, 1.1, 1.2, 1.1, 1],
    transition: {
      repeat: Infinity,
      repeatType: "loop" as const,
      duration: 3,
      ease: "easeInOut"
    }
  };

  // Red line animation
  const redLineAnimation = {
    x: ["-100%", "0%", "100%", "200%", "100%", "0%", "-100%"],
    transition: {
      repeat: Infinity,
      duration: 6,
      ease: "easeInOut"
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "-100%", opacity: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 80, 
            damping: 15 
          }}
          className="fixed bottom-8 left-8 z-50 max-w-md"
        >
          <div className="bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-lg shadow-xl p-6 text-white relative border border-white/10">
            {/* Decorative circuit patterns in the background */}
            <div className="absolute inset-0 opacity-10 overflow-hidden pointer-events-none">
              <svg width="100%" height="100%" viewBox="0 0 200 200">
                <path d="M20,50 L60,50 M70,50 L110,50 M110,50 L110,30 M110,50 L110,70 M120,50 L160,50" 
                      stroke="white" strokeWidth="1" fill="none" />
                <circle cx="65" cy="50" r="3" fill="white" />
                <circle cx="115" cy="30" r="2" fill="white" />
                <circle cx="115" cy="70" r="2" fill="white" />
                <circle cx="165" cy="50" r="3" fill="white" />
              </svg>
            </div>
            
            <button 
              onClick={handleClose}
              className="absolute right-2 top-2 p-1.5 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Close announcement"
            >
              <X size={16} />
            </button>
            
            <div className="flex items-center mb-1">
              {/* Animated Financial icon/badge */}
              <motion.div 
                animate={starAnimation}
                className="bg-white/20 rounded-full p-1.5 mr-3"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L14.5 9H21L16 13.5L18 21L12 17L6 21L8 13.5L3 9H9.5L12 2Z" fill="white"/>
                </svg>
              </motion.div>
              <h3 className="text-lg font-semibold">New Launch Announcement!</h3>
            </div>
            
            {/* Animated red line */}
            <div className="relative h-1 mb-3 overflow-hidden">
              <div className="absolute inset-0 bg-gray-200/20 rounded-full"></div>
              <motion.div 
                className="absolute h-full w-1/4 bg-red-500 rounded-full shadow-sm"
                animate={redLineAnimation}
              ></motion.div>
            </div>
            
            <p className="mb-4 leading-relaxed">{message}</p>
            
            <Button
              variant="secondary"
              className="bg-white text-emerald-600 hover:bg-white/90 hover:scale-105 transition-all gap-1 font-medium"
              onClick={() => window.open(ctaLink, "_blank")}
            >
              {ctaText}
              <ChevronRight size={16} />
            </Button>
            
            {/* Powered by TechBrain badge with brand colors */}
            <div className="mt-3 text-xs flex items-center justify-end">
              <span>Powered by </span>
              <span className="font-medium">
                <span className="text-[#2f72df]">Tech</span>
                <span className="text-[#f0644c]">Brain</span>
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}