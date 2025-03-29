import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/animations";
import { GrassCard } from "@/components/ui/grass-card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Import logo assets
import fianLogo from "../assets/logos/fian.svg";
import coloradoLogo from "../assets/logos/coloradoresilience.svg";
import rainbowsLogo from "../assets/logos/rainbows.svg";
import catchafireLogo from "../assets/logos/catchafire.svg";
import techbrainLogo from "../assets/logos/techbrain.svg";
import moorePartsLogo from "../assets/logos/mooreparts.svg";
import trailLogo from "../assets/logos/tellyourtrail.svg";
import eightyFourLogo from "../assets/logos/eightyfour.svg";
import saharaLogo from "../assets/logos/saharabiz.svg";
import dreamWrapLogo from "../assets/logos/dreamwrap.svg";
import ringMastersLogo from "../assets/logos/ringmasters.svg";
import tajiriAILogo from "../assets/logos/tajiriai.svg";

// Define the customer data interface
interface Customer {
  name: string;
  logo: string;
  industry: string;
  website: string;
  description: string;
}

// Create a list of customers with local SVG logos
const customers: Customer[] = [
  {
    name: "FIAN International",
    logo: fianLogo,
    industry: "Human Rights & Food Security",
    website: "https://www.fian.org/en/",
    description: "Global organization fighting for the right to adequate food and nutrition."
  },
  {
    name: "Resilient Colorado",
    logo: coloradoLogo,
    industry: "Community Development",
    website: "https://coloradoresilience.org/",
    description: "Alliance working to strengthen communities across Colorado."
  },
  {
    name: "Rainbow's United",
    logo: rainbowsLogo,
    industry: "Child Development & Support",
    website: "https://rainbowsunited.org/",
    description: "Specialized care for children with developmental disabilities."
  },
  {
    name: "Catchafire",
    logo: catchafireLogo,
    industry: "Nonprofit & Volunteering",
    website: "https://www.catchafire.org/",
    description: "Platform connecting professionals with nonprofit organizations."
  },
  {
    name: "TechBrain Africa",
    logo: techbrainLogo,
    industry: "Technology & Innovation",
    website: "https://www.techbrain.africa",
    description: "Empowering businesses through cutting-edge technology solutions."
  },
  {
    name: "Moore Parts",
    logo: moorePartsLogo,
    industry: "Automotive Parts",
    website: "https://mooreparts.com/",
    description: "Comprehensive parts solution for the automotive industry."
  },
  {
    name: "Tell Your Trail",
    logo: trailLogo,
    industry: "Outdoor & Recreation",
    website: "https://tellyourtrail.com/",
    description: "Connecting outdoor enthusiasts with trail stories and experiences."
  },
  {
    name: "Eighty Four",
    logo: eightyFourLogo,
    industry: "Design & Marketing",
    website: "https://eightyfour.com/",
    description: "Creative agency delivering innovative branding solutions."
  },
  {
    name: "Sahara Biz",
    logo: saharaLogo,
    industry: "Business Solutions",
    website: "https://saharabiz.com/",
    description: "Comprehensive business services for growth and development."
  },
  {
    name: "Dream Wrap Sleep",
    logo: dreamWrapLogo,
    industry: "Health & Wellness",
    website: "https://dreamwrapsleep.com/",
    description: "Innovative sleep solutions for improved health and wellness."
  },
  {
    name: "Ring Masters",
    logo: ringMastersLogo,
    industry: "Jewelry & Retail",
    website: "https://shopringmasters.com/",
    description: "Premium jewelry retail with custom design offerings."
  },
  {
    name: "Tajiri AI",
    logo: tajiriAILogo,
    industry: "Artificial Intelligence & Fintech",
    website: "https://www.tajiri.live",
    description: "Advanced AI solutions for financial technology and wealth management."
  }
];

export default function SimpleCustomersCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = {
    sm: 1, // Mobile: 1 item
    md: 2, // Tablet: 2 items
    lg: 3  // Desktop: 3 items (matching TestimonialsSection)
  };
  
  // Determine items per page based on screen width
  const [itemsToShow, setItemsToShow] = useState(itemsPerPage.lg);
  
  // Update items per page when screen size changes
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setItemsToShow(itemsPerPage.sm);
      } else if (width < 1024) {
        setItemsToShow(itemsPerPage.md);
      } else {
        setItemsToShow(itemsPerPage.lg);
      }
    };
    
    // Set initial value
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Autoplay functionality
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 4000);
    
    return () => clearInterval(timer);
  }, [currentIndex, itemsToShow]);
  
  // Create a group of visible customers
  const visibleCustomers = () => {
    const result = [];
    for (let i = 0; i < itemsToShow; i++) {
      const index = (currentIndex + i) % customers.length;
      result.push(customers[index]);
    }
    return result;
  };
  
  const handlePrev = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex - 1 + customers.length) % customers.length
    );
  };
  
  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex + 1) % customers.length
    );
  };
  
  return (
    <section className="py-20 bg-gradient-to-r from-primary/5 to-secondary/5">
      <div className="container mx-auto px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.h2
            variants={fadeIn("up", "tween", 0.2, 1)}
            className="text-3xl md:text-4xl font-heading font-bold mb-6"
          >
            Our Happy Customers
          </motion.h2>
          <motion.p
            variants={fadeIn("up", "tween", 0.3, 1)}
            className="text-lg opacity-80"
          >
            We're proud to have helped these amazing organizations achieve their digital goals. Here's a showcase of some of our successful collaborations.
          </motion.p>
        </motion.div>
        
        <div className="relative max-w-5xl mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {visibleCustomers().map((customer, index) => (
              <motion.div
                key={index}
                variants={fadeIn("up", "tween", 0.2 + index * 0.1, 1)}
                className="h-full"
              >
                <GrassCard className="p-8 h-full">
                  <div className="w-full h-20 mb-6 flex items-center justify-center">
                    <img
                      src={customer.logo}
                      alt={`${customer.name} logo`}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="font-bold text-lg mb-2">{customer.name}</h3>
                    <p className="text-sm text-primary/80 font-medium mb-3">{customer.industry}</p>
                    <p className="opacity-80 mb-4">{customer.description}</p>
                    <a
                      href={customer.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline inline-block transition-all hover:translate-x-1"
                    >
                      Visit website →
                    </a>
                  </div>
                </GrassCard>
              </motion.div>
            ))}
          </motion.div>
          
          <div className="hidden md:block">
            <Button 
              variant="outline" 
              size="icon"
              className="absolute -left-10 top-1/2 transform -translate-y-1/2 bg-background/80 backdrop-blur-sm rounded-full h-10 w-10"
              onClick={handlePrev}
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Previous</span>
            </Button>
            
            <Button 
              variant="outline" 
              size="icon"
              className="absolute -right-10 top-1/2 transform -translate-y-1/2 bg-background/80 backdrop-blur-sm rounded-full h-10 w-10"
              onClick={handleNext}
            >
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">Next</span>
            </Button>
          </div>
        </div>
        
        {/* Mobile controls */}
        <div className="flex justify-center mt-6 md:hidden">
          <Button
            variant="outline"
            size="sm"
            className="mx-1"
            onClick={handlePrev}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Prev
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="mx-1"
            onClick={handleNext}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </section>
  );
}