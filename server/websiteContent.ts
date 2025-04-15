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
  }[];
  services: string[];
  companyInfo: {
    name: string;
    location: string;
    phone: string;
    email: string;
    about: string;
  };
}

/**
 * Collects all relevant website content from the database for AI training
 */
export async function collectWebsiteContent(): Promise<WebsiteContentForAI> {
  log("Collecting website content for AI training", "ai-training");
  
  // Initialize the content structure
  const content: WebsiteContentForAI = {
    sections: {},
    careers: [],
    services: [
      "AI & Machine Learning",
      "Big Data Analytics",
      "Web Development",
      "E-commerce Solutions",
      "Digital Marketing",
      "Mobile App Development"
    ],
    companyInfo: {
      name: "TechBrain",
      location: "University Way, Nairobi, Kenya",
      phone: "+254 (78) 0010010",
      email: "hudson.eboso@techbrain.africa",
      about: "TechBrain is a technology company specializing in AI, Big Data Analytics, Machine Learning, Web Design, E-commerce Platforms, and Digital Marketing solutions."
    }
  };
  
  try {
    // Get all website content from CMS
    const cmsContent = await storage.getAllContent(true);
    
    // Organize content by sections
    cmsContent.forEach(item => {
      if (!content.sections[item.section]) {
        content.sections[item.section] = [];
      }
      
      // Add formatted content to the appropriate section
      content.sections[item.section].push(`${item.key}: ${item.content}`);
    });
    
    // Get all careers
    const careers = await storage.getCareers();
    content.careers = careers.map(career => ({
      title: career.title,
      description: career.description,
      requirements: career.requirements,
      location: career.location
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

## Our Services
${content.services.map(service => `- ${service}`).join('\n')}

`;

  // Add CMS sections
  Object.entries(content.sections).forEach(([section, items]) => {
    formattedContent += `\n## ${section.charAt(0).toUpperCase() + section.slice(1)}\n`;
    items.forEach(item => {
      formattedContent += `- ${item}\n`;
    });
  });
  
  // Add careers
  if (content.careers.length > 0) {
    formattedContent += '\n## Career Opportunities\n';
    content.careers.forEach(career => {
      formattedContent += `
### ${career.title}
- Location: ${career.location}
- Description: ${career.description}
- Requirements: ${career.requirements}
`;
    });
  }
  
  return formattedContent;
}