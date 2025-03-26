import { motion, useInView } from "framer-motion";
import { fadeIn, slideIn, staggerContainer } from "@/lib/animations";
import { useEffect, useRef, useState } from "react";

export default function AboutSection() {
  const [hasCounted, setHasCounted] = useState(false);
  const statsRef = useRef(null);
  const isInView = useInView(statsRef, { once: false, amount: 0.5 });
  
  const stats = [
    { endValue: 10, suffix: "+", label: "Expert Developers" },
    { endValue: 100, suffix: "+", label: "Projects Completed" },
    { endValue: 98, suffix: "%", label: "Client Satisfaction" },
  ];
  
  const [counts, setCounts] = useState(stats.map(() => 0));
  
  useEffect(() => {
    if (isInView && !hasCounted) {
      setHasCounted(true);
      stats.forEach((stat, index) => {
        const duration = 2000; // ms
        const increment = stat.endValue / (duration / 16); // Assuming 60 fps
        let currentCount = 0;
        
        const timer = setInterval(() => {
          currentCount += increment;
          if (currentCount >= stat.endValue) {
            currentCount = stat.endValue;
            clearInterval(timer);
          }
          setCounts(prev => {
            const newCounts = [...prev];
            newCounts[index] = Math.floor(currentCount);
            return newCounts;
          });
        }, 16);
        
        return () => clearInterval(timer);
      });
    } else if (!isInView && hasCounted) {
      setHasCounted(false);
      setCounts(stats.map(() => 0));
    }
  }, [isInView, hasCounted]);

  return (
    <section
      id="about"
      className="py-20 bg-[radial-gradient(rgba(52,183,104,0.1)_2px,transparent_2px),radial-gradient(rgba(52,183,104,0.05)_2px,transparent_2px)] bg-[length:40px_40px] bg-[0_0,20px_20px]"
    >
      <div className="container mx-auto px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.25 }}
          className="flex flex-col lg:flex-row items-center"
        >
          <motion.div
            variants={slideIn("right", "tween", 0.2, 1)}
            className="lg:w-1/2 mb-10 lg:mb-0 lg:pr-16"
          >
            <img
              src="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3400&q=80"
              alt="TechBrain diverse team collaborating"
              className="rounded-xl shadow-[0_10px_30px_-10px_rgba(52,183,104,0.2)] w-full h-auto"
            />
          </motion.div>
          <motion.div
            variants={fadeIn("left", "tween", 0.2, 1)}
            className="lg:w-1/2"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
              About TechBrain
            </h2>
            <p className="text-lg opacity-80 mb-6 leading-relaxed">
              At TechBrain, we don't just build technology—we create intelligent,
              data-driven solutions that fuel growth, innovation, and success. Our
              mission is to empower businesses through cutting-edge technology and
              strategic insights.
            </p>
            <p className="text-lg opacity-80 mb-8 leading-relaxed">
              We leverage cutting-edge AI, Big Data, Machine Learning, Web Design,
              E-commerce Platforms, and Digital Marketing to drive business
              transformation and innovation. Our expert team specializes in building
              intelligent, scalable, and data-driven solutions that give businesses
              a competitive edge in today's fast-evolving digital landscape.
            </p>

            <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn("up", "tween", 0.3 + index * 0.1, 1)}
                  className="text-center"
                >
                  <div className="text-4xl text-primary font-bold">
                    {counts[index]}{stat.suffix}
                  </div>
                  <p className="text-sm mt-2">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            <motion.div variants={fadeIn("up", "tween", 0.6, 1)}>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 inline-block"
              >
                Let's Work Together
              </a>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
