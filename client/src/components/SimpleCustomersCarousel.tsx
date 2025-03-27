import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Define the customer data interface
interface Customer {
  name: string;
  logo: string;
  industry: string;
  website: string;
  description: string;
}

// Create a list of customers with placeholder images for testing
const customers: Customer[] = [
  {
    name: "FIAN International",
    logo: "https://placehold.co/300x150/2f72df/FFFFFF?text=FIAN+International",
    industry: "Human Rights & Food Security",
    website: "https://www.fian.org/en/",
    description: "Global organization fighting for the right to adequate food and nutrition."
  },
  {
    name: "Resilient Colorado",
    logo: "https://placehold.co/300x150/2f72df/FFFFFF?text=Resilient+Colorado",
    industry: "Community Development",
    website: "https://coloradoresilience.org/",
    description: "Alliance working to strengthen communities across Colorado."
  },
  {
    name: "Rainbow's United",
    logo: "https://placehold.co/300x150/f0644c/FFFFFF?text=Rainbow's+United",
    industry: "Child Development & Support",
    website: "https://rainbowsunited.org/",
    description: "Specialized care for children with developmental disabilities."
  },
  {
    name: "Catchafire",
    logo: "https://placehold.co/300x150/2f72df/FFFFFF?text=Catchafire",
    industry: "Nonprofit & Volunteering",
    website: "https://www.catchafire.org/",
    description: "Platform connecting professionals with nonprofit organizations."
  },
  {
    name: "TechBrain Africa",
    logo: "https://placehold.co/300x150/f0644c/FFFFFF?text=TechBrain",
    industry: "Technology & Innovation",
    website: "https://www.techbrain.africa",
    description: "Empowering businesses through cutting-edge technology solutions."
  },
  {
    name: "Moore Parts",
    logo: "https://placehold.co/300x150/2f72df/FFFFFF?text=Moore+Parts",
    industry: "Automotive Parts",
    website: "https://mooreparts.com/",
    description: "Comprehensive parts solution for the automotive industry."
  },
  {
    name: "Tell Your Trail",
    logo: "https://placehold.co/300x150/f0644c/FFFFFF?text=Tell+Your+Trail",
    industry: "Outdoor & Recreation",
    website: "https://tellyourtrail.com/",
    description: "Connecting outdoor enthusiasts with trail stories and experiences."
  },
  {
    name: "Eighty Four",
    logo: "https://placehold.co/300x150/2f72df/FFFFFF?text=Eighty+Four",
    industry: "Design & Marketing",
    website: "https://eightyfour.com/",
    description: "Creative agency delivering innovative branding solutions."
  },
  {
    name: "Sahara Biz",
    logo: "https://placehold.co/300x150/f0644c/FFFFFF?text=Sahara+Biz",
    industry: "Business Solutions",
    website: "https://saharabiz.com/",
    description: "Comprehensive business services for growth and development."
  },
  {
    name: "Dream Wrap Sleep",
    logo: "https://placehold.co/300x150/2f72df/FFFFFF?text=Dream+Wrap",
    industry: "Health & Wellness",
    website: "https://dreamwrapsleep.com/",
    description: "Innovative sleep solutions for improved health and wellness."
  },
  {
    name: "Ring Masters",
    logo: "https://placehold.co/300x150/f0644c/FFFFFF?text=Ring+Masters",
    industry: "Jewelry & Retail",
    website: "https://shopringmasters.com/",
    description: "Premium jewelry retail with custom design offerings."
  }
];

export default function SimpleCustomersCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = {
    sm: 1, // Mobile: 1 item
    md: 2, // Tablet: 2 items
    lg: 4  // Desktop: 4 items
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
    <section className="w-full py-16 bg-gradient-to-b from-primary/5 to-primary/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Our Happy Customers</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We're proud to have helped these amazing organizations achieve their digital goals. Here's a showcase of some of our successful collaborations.
          </p>
        </div>
        
        <div className="relative max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {visibleCustomers().map((customer, index) => (
              <div key={index} className="h-full transition-all duration-300 hover:scale-[1.02]">
                <Card className="h-full border-2 border-transparent hover:border-primary/70 transition-all duration-300 backdrop-blur-sm">
                  <CardContent className="flex flex-col items-center justify-between p-6 h-full">
                    <div className="w-full h-16 mb-4 flex items-center justify-center">
                      <img
                        src={customer.logo}
                        alt={`${customer.name} logo`}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="text-center">
                      <h3 className="font-semibold text-lg mb-1">{customer.name}</h3>
                      <p className="text-xs text-primary/80 font-medium mb-2">{customer.industry}</p>
                      <p className="text-sm text-muted-foreground mb-3">{customer.description}</p>
                      <a
                        href={customer.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        Visit website
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
          
          <div className="hidden md:block">
            <Button 
              variant="outline" 
              size="icon"
              className="absolute -left-10 top-1/2 transform -translate-y-1/2 bg-background/80 backdrop-blur-sm rounded-full h-8 w-8"
              onClick={handlePrev}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous</span>
            </Button>
            
            <Button 
              variant="outline" 
              size="icon"
              className="absolute -right-10 top-1/2 transform -translate-y-1/2 bg-background/80 backdrop-blur-sm rounded-full h-8 w-8"
              onClick={handleNext}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next</span>
            </Button>
          </div>
        </div>
        
        {/* Mobile controls */}
        <div className="flex justify-center mt-4 md:hidden">
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