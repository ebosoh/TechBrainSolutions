import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/animations";
import { GrassCard } from "@/components/ui/grass-card";
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
            >
              <GrassCard className="p-8 h-full">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-heading font-bold mb-4">{item.title}</h3>
                <p className="opacity-80 mb-6">{item.description}</p>
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="text-primary font-medium flex items-center hover:underline"
                >
                  Learn more
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    ></path>
                  </svg>
                </a>
              </GrassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
