import React, { useEffect, useRef } from "react";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

// Define the customer data interface
interface Customer {
  name: string;
  logo: string;
  industry: string;
  website: string;
  description: string;
}

// Create a list of customers based on the provided websites
const customers: Customer[] = [
  {
    name: "FIAN International",
    logo: "https://www.fian.org/fileadmin/templates/fian/img/logo.svg",
    industry: "Human Rights & Food Security",
    website: "https://www.fian.org/en/",
    description: "Global organization fighting for the right to adequate food and nutrition."
  },
  {
    name: "Resilient Colorado",
    logo: "https://coloradoresilience.org/wp-content/uploads/2023/02/cra-logo-color.svg",
    industry: "Community Development",
    website: "https://coloradoresilience.org/",
    description: "Alliance working to strengthen communities across Colorado."
  },
  {
    name: "Rainbow's United",
    logo: "https://rainbowsunited.org/wp-content/uploads/2021/04/Rainbow.svg",
    industry: "Child Development & Support",
    website: "https://rainbowsunited.org/",
    description: "Specialized care for children with developmental disabilities."
  },
  {
    name: "Catchafire",
    logo: "https://images.catchafire.org/frontend-production/assets/resources/catchafire-text-logo-7e59c94fd5.svg",
    industry: "Nonprofit & Volunteering",
    website: "https://www.catchafire.org/",
    description: "Platform connecting professionals with nonprofit organizations."
  },
  {
    name: "TechBrain Africa",
    logo: "https://www.techbrain.africa/wp-content/uploads/2022/03/TechBrain-Logo-1.png",
    industry: "Technology & Innovation",
    website: "https://www.techbrain.africa",
    description: "Empowering businesses through cutting-edge technology solutions."
  },
  {
    name: "Moore Parts",
    logo: "https://mooreparts.com/wp-content/uploads/elementor/thumbs/MP_Logo-qhbv6ov6idcmttfcjg7w4sjqj3k01b6bch6fjm0j1c.webp",
    industry: "Automotive Parts",
    website: "https://mooreparts.com/",
    description: "Comprehensive parts solution for the automotive industry."
  },
  {
    name: "Tell Your Trail",
    logo: "https://tellyourtrail.com/wp-content/uploads/2023/06/cropped-New-Logo-1-1.webp",
    industry: "Outdoor & Recreation",
    website: "https://tellyourtrail.com/",
    description: "Connecting outdoor enthusiasts with trail stories and experiences."
  },
  {
    name: "Eighty Four",
    logo: "https://eightyfour.com/wp-content/uploads/2023/10/84-Logo-Navbar-2.svg",
    industry: "Design & Marketing",
    website: "https://eightyfour.com/",
    description: "Creative agency delivering innovative branding solutions."
  },
  {
    name: "Sahara Biz",
    logo: "https://saharabiz.com/wp-content/uploads/2024/03/Sahara-Biz.png",
    industry: "Business Solutions",
    website: "https://saharabiz.com/",
    description: "Comprehensive business services for growth and development."
  },
  {
    name: "Dream Wrap Sleep",
    logo: "https://dreamwrapsleep.com/wp-content/uploads/2022/04/Dream-Wrap-Sleep-Logo.png",
    industry: "Health & Wellness",
    website: "https://dreamwrapsleep.com/",
    description: "Innovative sleep solutions for improved health and wellness."
  },
  {
    name: "Ring Masters",
    logo: "https://shopringmasters.com/cdn/shop/files/RM-Logo_120x.png",
    industry: "Jewelry & Retail",
    website: "https://shopringmasters.com/",
    description: "Premium jewelry retail with custom design offerings."
  }
];

export default function CustomersCarousel() {
  // Set up autoplay with useRef and useEffect
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoplayTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const autoplay = () => {
      const nextButton = carouselRef.current?.querySelector('[aria-label="Next slide"]') as HTMLButtonElement | null;
      if (nextButton) {
        nextButton.click();
      }
    };

    // Start autoplay
    autoplayTimerRef.current = window.setInterval(autoplay, 4000);

    // Clean up on unmount
    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, []);

  return (
    <section className="w-full py-16 bg-gradient-to-b from-primary/5 to-primary/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Our Happy Customers</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We're proud to have helped these amazing organizations achieve their digital goals. Here's a showcase of some of our successful collaborations.
          </p>
        </div>

        <div ref={carouselRef}>
          <Carousel
            className="w-full max-w-5xl mx-auto relative"
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent>
              {customers.map((customer, index) => (
                <CarouselItem key={index} className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4 h-full">
                  <div className="h-full transition-all duration-300 hover:scale-[1.02]">
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
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:block">
              <CarouselPrevious className="absolute -left-2 top-1/2 transform -translate-y-1/2 bg-background/80 backdrop-blur-sm" />
              <CarouselNext className="absolute -right-2 top-1/2 transform -translate-y-1/2 bg-background/80 backdrop-blur-sm" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
}