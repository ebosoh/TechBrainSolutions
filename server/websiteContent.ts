import { storage } from "./storage";
import { log } from "./vite";

// This interface represents structured website content for AI training
interface WebsiteContentForAI {
  sections: {
    [key: string]: string[];
  };
  careers: {
    title: string;
    description: string;
    requirements: string;
    location: string;
    type: string;
  }[];
  services: {
    title: string;
    description: string;
  }[];
  companyInfo: {
    name: string;
    location: string;
    phone: string;
    email: string;
    about: string;
  };
  companyStats: {
    label: string;
    value: string;
  }[];
  testimonials: {
    name: string;
    position: string;
    quote: string;
    rating: number;
  }[];
  partners: {
    name: string;
    industry: string;
    description: string;
  }[];
}

/**
 * Collects all relevant website content from the database for AI training
 */
export async function collectWebsiteContent(): Promise<WebsiteContentForAI> {
  log("Collecting website content for AI training", "ai-training");
  
  // Initialize the content structure with default values
  const content: WebsiteContentForAI = {
    sections: {},
    careers: [],
    services: [
      {
        title: "AI & Machine Learning",
        description: "We develop smart applications that automate workflows, enhance decision-making, and drive efficiency."
      },
      {
        title: "Big Data & Analytics",
        description: "Our powerful data-driven insights help businesses make faster, smarter, and more strategic decisions."
      },
      {
        title: "Web Design & Development",
        description: "We craft stunning, high-performance websites that enhance user experience, improve engagement, and boost conversions."
      },
      {
        title: "E-commerce Platform Development",
        description: "We build robust, scalable, and AI-powered e-commerce solutions that optimize sales, enhance customer experience, and drive business growth."
      },
      {
        title: "Digital Marketing Excellence",
        description: "We create AI-powered marketing strategies that maximize brand visibility, optimize customer engagement, and increase conversions."
      }
    ],
    companyInfo: {
      name: "TechBrain",
      location: "University Way, Nairobi, Kenya",
      phone: "+254 (78) 0010010",
      email: "hudson.eboso@techbrain.africa",
      about: "TechBrain is a technology company specializing in AI, Big Data Analytics, Machine Learning, Web Design, E-commerce Platforms, and Digital Marketing solutions."
    },
    companyStats: [
      { label: "Expert Developers", value: "10+" },
      { label: "Projects Completed", value: "100+" },
      { label: "Client Satisfaction", value: "98%" }
    ],
    testimonials: [
      {
        name: "John Doe",
        position: "Marketing Director, TechCompany",
        quote: "TechBrain completely transformed our approach to customer data. Their AI solution helped us increase conversions by 45% in just three months.",
        rating: 5
      },
      {
        name: "Jane Smith",
        position: "CEO, Retail Solutions",
        quote: "The e-commerce platform TechBrain developed for us is not only beautiful but extremely functional. Sales are up 60% since launch!",
        rating: 5
      },
      {
        name: "Robert Johnson",
        position: "CTO, DataCorp",
        quote: "Their Big Data analytics implementation has given us insights we never knew were possible. Decision-making is now faster and backed by real data.",
        rating: 5
      }
    ],
    partners: [
      {
        name: "Tajiri AI",
        industry: "Artificial Intelligence & Fintech",
        description: "Advanced AI solutions for financial technology and wealth management."
      },
      {
        name: "Eighty Four",
        industry: "Technology & Innovation",
        description: "Software solutions for business optimization and growth."
      },
      {
        name: "Sahara Biz",
        industry: "Business Services",
        description: "Business consulting and strategic management services."
      },
      {
        name: "Dreamwrap Sleep",
        industry: "Health & Wellness",
        description: "Innovative sleep technologies and wellness solutions."
      },
      {
        name: "Ring Masters",
        industry: "Jewelry & Retail",
        description: "Premium jewelry retail with custom design offerings."
      }
    ]
  };
  
  try {
    log("Fetching CMS content from database", "ai-training");
    // Get all website content from CMS
    const cmsContent = await storage.getAllContent(true);
    
    // Organize content by sections
    cmsContent.forEach(item => {
      if (!content.sections[item.section]) {
        content.sections[item.section] = [];
      }
      
      // Format the content with title if available
      let formattedContent = item.title 
        ? `${item.title}: ${item.content}` 
        : `${item.key}: ${item.content}`;
      
      // Add formatted content to the appropriate section
      content.sections[item.section].push(formattedContent);
    });
    
    log("Fetching career opportunities from database", "ai-training");
    // Get all careers
    const careers = await storage.getCareers();
    content.careers = careers.map(career => ({
      title: career.title,
      description: career.description,
      requirements: career.requirements,
      location: career.location,
      type: career.type
    }));
    
    log(`Content collected: ${Object.keys(content.sections).length} sections, ${content.careers.length} careers`, "ai-training");
    return content;
    
  } catch (error) {
    log(`Error collecting website content: ${error}`, "ai-training");
    console.error("Failed to collect website content:", error);
    
    // Return default content structure in case of error
    return content;
  }
}

/**
 * Converts the structured content into a plain text format for AI training
 */
export function formatContentForAI(content: WebsiteContentForAI): string {
  let formattedContent = `
# TechBrain Website Content

## Company Information
- Name: ${content.companyInfo.name}
- Location: ${content.companyInfo.location}
- Phone: ${content.companyInfo.phone}
- Email: ${content.companyInfo.email}
- About: ${content.companyInfo.about}

## Company Statistics
${content.companyStats.map(stat => `- ${stat.label}: ${stat.value}`).join('\n')}

## Our Services
${content.services.map(service => `- ${service.title}: ${service.description}`).join('\n')}

## Our Partners/Clients
${content.partners.map(partner => `- ${partner.name} (${partner.industry}): ${partner.description}`).join('\n')}

## Client Testimonials
${content.testimonials.map(testimonial => 
  `- ${testimonial.name}, ${testimonial.position}: "${testimonial.quote}" (Rating: ${testimonial.rating}/5)`
).join('\n')}
`;

  // Add CMS sections
  Object.entries(content.sections).forEach(([section, items]) => {
    formattedContent += `\n## ${section.charAt(0).toUpperCase() + section.slice(1)} Section\n`;
    items.forEach(item => {
      formattedContent += `- ${item}\n`;
    });
  });
  
  // Add careers
  if (content.careers.length > 0) {
    formattedContent += '\n## Career Opportunities\n';
    content.careers.forEach(career => {
      formattedContent += `
### ${career.title} (${career.type})
- Location: ${career.location}
- Description: ${career.description}
- Requirements: ${career.requirements.replace(/\n/g, ', ')}
`;
    });
  }

  formattedContent += `
## Important Products and Integrations
- Tajiri AI: A data-driven MMF Investment Advisor. This is one of our successful projects. More information at https://tajiri.live/

## Contact Information
- Visit our contact form on the website to reach out to us.
- Phone: ${content.companyInfo.phone}
- Email: ${content.companyInfo.email}
- Address: ${content.companyInfo.location}
`;
  
  return formattedContent;
}