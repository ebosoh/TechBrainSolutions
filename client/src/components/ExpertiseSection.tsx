import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/animations";
import { ServiceCard } from "@/components/ui/service-card";
import { FaBrain, FaDatabase, FaLaptopCode, FaShoppingCart, FaBullhorn, FaCogs } from "react-icons/fa";

const expertiseItems = [
  {
    icon: <FaBrain className="text-2xl text-primary" />,
    title: "AI & Machine Learning",
    description: "We develop smart applications that automate workflows, enhance decision-making, and drive efficiency.",
  },
  {
    icon: <FaDatabase className="text-2xl text-primary" />,
    title: "Big Data & Analytics",
    description: "Our powerful data-driven insights help businesses make faster, smarter, and more strategic decisions.",
  },
  {
    icon: <FaLaptopCode className="text-2xl text-primary" />,
    title: "Web Design & Development",
    description: "We craft stunning, high-performance websites that enhance user experience, improve engagement, and boost conversions.",
  },
  {
    icon: <FaShoppingCart className="text-2xl text-primary" />,
    title: "E-commerce Platform Development",
    description: "We build robust, scalable, and AI-powered e-commerce solutions that optimize sales and enhance customer experience.",
  },
  {
    icon: <FaBullhorn className="text-2xl text-primary" />,
    title: "Digital Marketing Excellence",
    description: "We create AI-powered marketing strategies that maximize brand visibility, optimize customer engagement, and increase conversions.",
  },
  {
    icon: <FaCogs className="text-2xl text-primary" />,
    title: "Technology Consulting",
    description: "We provide strategic guidance on adopting emerging technologies that align with your business goals and drive sustainable growth.",
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
                onLearnMoreClick={() => {
                  console.log(`User clicked Learn more on ${item.title}`);
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
