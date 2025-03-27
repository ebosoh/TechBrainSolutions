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

// Create a list of customers with their logos
const customers: Customer[] = [
  {
    name: "Microsoft",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
    industry: "Technology & Software",
    website: "https://www.microsoft.com/",
    description: "Leading global technology company developing innovative solutions."
  },
  {
    name: "Google",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    industry: "Technology & Internet Services",
    website: "https://www.google.com/",
    description: "World-renowned search engine and technology innovator."
  },
  {
    name: "Amazon",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    industry: "E-Commerce & Cloud Computing",
    website: "https://www.amazon.com/",
    description: "Global leader in e-commerce and cloud infrastructure services."
  },
  {
    name: "IBM",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
    industry: "Technology & Consulting",
    website: "https://www.ibm.com/",
    description: "Pioneer in computing technology and business solutions."
  },
  {
    name: "Samsung",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg",
    industry: "Electronics & Technology",
    website: "https://www.samsung.com/",
    description: "Leading manufacturer of electronics and digital solutions."
  },
  {
    name: "Oracle",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg",
    industry: "Cloud & Database Services",
    website: "https://www.oracle.com/",
    description: "Provider of enterprise cloud computing and database solutions."
  },
  {
    name: "Apple",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    industry: "Consumer Electronics",
    website: "https://www.apple.com/",
    description: "Designer and developer of premium consumer technology products."
  },
  {
    name: "Intel",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/7d/Intel_logo_%282006-2020%29.svg",
    industry: "Semiconductor Manufacturing",
    website: "https://www.intel.com/",
    description: "Leading producer of microprocessors and technology solutions."
  },
  {
    name: "Cisco",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg",
    industry: "Networking & Security",
    website: "https://www.cisco.com/",
    description: "Worldwide leader in networking and cybersecurity solutions."
  },
  {
    name: "Salesforce",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg",
    industry: "Cloud Software & CRM",
    website: "https://www.salesforce.com/",
    description: "Provider of customer relationship management and cloud solutions."
  },
  {
    name: "Adobe",
    logo: "https://upload.wikimedia.org/wikipedia/commons/8/8d/Adobe_Corporate_logo.svg",
    industry: "Software & Digital Media",
    website: "https://www.adobe.com/",
    description: "Creator of industry-standard creative and document management software."
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
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Our Trusted Partners</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We collaborate with industry leaders to deliver cutting-edge technology solutions. These partnerships enable us to provide world-class services to our clients.
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