import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

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

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "-100%", opacity: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 100, 
            damping: 20 
          }}
          className="fixed bottom-8 left-8 z-50 max-w-md"
        >
          <div className="bg-gradient-to-r from-green-600 to-cyan-600 rounded-lg shadow-lg p-6 text-white relative">
            <button 
              onClick={handleClose}
              className="absolute right-2 top-2 p-1 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Close announcement"
            >
              <X size={18} />
            </button>
            
            <h3 className="text-lg font-semibold mb-3">New Launch Announcement!</h3>
            <p className="mb-4">{message}</p>
            
            <Button
              className="bg-white text-green-600 hover:bg-white/90 hover:text-green-700 transition-colors"
              onClick={() => window.open(ctaLink, "_blank")}
            >
              {ctaText}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}