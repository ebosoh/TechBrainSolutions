import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/animations";
import { ServiceCard } from "@/components/ui/service-card";
import { FaBrain, FaDatabase, FaLaptopCode, FaShoppingCart, FaBullhorn, FaCogs } from "react-icons/fa";

const expertiseItems = [
  {
    icon: <FaBrain className="text-2xl text-primary" />,
    title: "AI & Machine Learning",
    description: "We develop smart applications that automate workflows, enhance decision-making, and drive efficiency.",
    detailedInfo: {
      trendingServices: [
        "Custom GPT model fine-tuning for industry-specific tasks",
        "Computer vision systems for quality control and safety",
        "Predictive maintenance AI for manufacturing and industrial equipment",
        "AI-powered customer service chatbots with human-like responses",
        "Natural language processing for business document analysis"
      ],
      trendingProducts: [
        "GPT-4o integration for multimodal intelligence applications",
        "Claude 3 Opus for complex business reasoning systems",
        "Vision-language models for image understanding",
        "Llama 3 for on-premise, private AI deployments",
        "AutoML platforms for non-technical teams"
      ]
    }
  },
  {
    icon: <FaDatabase className="text-2xl text-primary" />,
    title: "Big Data & Analytics",
    description: "Our powerful data-driven insights help businesses make faster, smarter, and more strategic decisions.",
    detailedInfo: {
      trendingServices: [
        "Real-time analytics dashboards for business intelligence",
        "Predictive analytics for market trends and consumer behavior",
        "Data lake architectures for unified enterprise data",
        "Data pipeline optimization and automation",
        "Custom ETL solutions for complex data environments"
      ],
      trendingProducts: [
        "Snowflake for cloud data warehousing",
        "Apache Kafka for real-time data streaming",
        "Databricks for unified data analytics",
        "dbt for data transformation workflows",
        "ThoughtSpot for AI-powered analytics"
      ]
    }
  },
  {
    icon: <FaLaptopCode className="text-2xl text-primary" />,
    title: "Web Design & Development",
    description: "We craft stunning, high-performance websites that enhance user experience, improve engagement, and boost conversions.",
    detailedInfo: {
      trendingServices: [
        "Progressive Web Applications (PWAs) for cross-platform experiences",
        "Jamstack architecture for high-performance sites",
        "Headless CMS implementation for flexible content management",
        "Microservices architecture for scalable web applications",
        "Accessibility compliance and optimization"
      ],
      trendingProducts: [
        "Next.js for server-side rendering and static generation",
        "Remix for enhanced web application performance",
        "Astro for content-focused websites",
        "Tailwind CSS for rapid UI development",
        "Sanity.io for structured content management"
      ]
    }
  },
  {
    icon: <FaShoppingCart className="text-2xl text-primary" />,
    title: "E-commerce Platform Development",
    description: "We build robust, scalable, and AI-powered e-commerce solutions that optimize sales and enhance customer experience.",
    detailedInfo: {
      trendingServices: [
        "Headless e-commerce architecture implementation",
        "Personalized product recommendation engines",
        "Omnichannel retail solutions connecting online and offline",
        "Voice commerce integration for hands-free shopping",
        "Advanced analytics for conversion optimization"
      ],
      trendingProducts: [
        "Shopify Hydrogen for headless commerce",
        "Medusa.js for open-source e-commerce",
        "BigCommerce for enterprise-scale operations",
        "CommerceTools for composable commerce",
        "Algolia for lightning-fast product search"
      ]
    }
  },
  {
    icon: <FaBullhorn className="text-2xl text-primary" />,
    title: "Digital Marketing Excellence",
    description: "We create AI-powered marketing strategies that maximize brand visibility, optimize customer engagement, and increase conversions.",
    detailedInfo: {
      trendingServices: [
        "AI-driven content creation and optimization",
        "Programmatic advertising with dynamic targeting",
        "Predictive customer journey mapping",
        "Marketing automation with behavioral triggers",
        "Attribution modeling for multi-channel campaigns"
      ],
      trendingProducts: [
        "HubSpot for comprehensive marketing automation",
        "Jasper AI for content generation",
        "Semrush for SEO and competitive analysis",
        "Klaviyo for e-commerce marketing",
        "Meta Advantage+ for AI-powered ad optimization"
      ]
    }
  },
  {
    icon: <FaCogs className="text-2xl text-primary" />,
    title: "Technology Consulting",
    description: "We provide strategic guidance on adopting emerging technologies that align with your business goals and drive sustainable growth.",
    detailedInfo: {
      trendingServices: [
        "Digital transformation roadmap development",
        "Cloud migration and optimization strategies",
        "Emerging tech integration (AR/VR, blockchain, IoT)",
        "Technology stack modernization planning",
        "Legacy system assessment and enhancement"
      ],
      trendingProducts: [
        "Microsoft Azure OpenAI Service for enterprise AI",
        "AWS Lambda for serverless architecture",
        "Google Vertex AI for MLOps",
        "Kubernetes for container orchestration",
        "Terraform for infrastructure as code"
      ]
    }
  },
];

export default function ExpertiseSection() {
  return (
    <section
      id="expertise"
      className="py-20 bg-gradient-to-r from-primary/5 to-secondary/5"
    >
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
            Our Expertise
          </motion.h2>
          <motion.p
            variants={fadeIn("up", "tween", 0.3, 1)}
            className="text-lg opacity-80"
          >
            We provide intelligent, scalable, and data-driven solutions that fuel
            growth, innovation, and success.
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {expertiseItems.map((item, index) => (
            <motion.div
              key={index}
              variants={fadeIn("up", "tween", 0.2 + index * 0.1, 1)}
              className="h-full"
            >
              <ServiceCard
                title={item.title}
                description={item.description}
                icon={item.icon}
                detailedInfo={item.detailedInfo}
                onLearnMoreClick={() => {
                  const contactSection = document.querySelector('#contact');
                  if (contactSection) {
                    const topOffset = contactSection.getBoundingClientRect().top + window.scrollY - 80;
                    window.scrollTo({
                      top: topOffset,
                      behavior: 'smooth'
                    });
                  }
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
