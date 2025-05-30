import { motion } from "framer-motion";
import { fadeIn, slideIn, staggerContainer } from "@/lib/animations";
import { FaBrain } from "react-icons/fa";
import { GrassTexture } from "@/components/ui/grass-texture";

export default function HeroSection() {
  return (
    <section id="home" className="pt-32 pb-20 relative overflow-hidden bg-[radial-gradient(rgba(52,183,104,0.1)_2px,transparent_2px),radial-gradient(rgba(52,183,104,0.05)_2px,transparent_2px)] bg-[length:40px_40px] bg-[0_0,20px_20px]">
      <div className="container mx-auto px-6">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="flex flex-col md:flex-row items-center"
        >
          <motion.div 
            variants={fadeIn("right", "tween", 0.2, 1)}
            className="md:w-1/2 mb-10 md:mb-0 md:pr-10"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-6">
              Intelligent Solutions that{" "}
              <span className="text-primary">Transform your Business</span>
            </h1>
            <p className="text-lg md:text-xl opacity-80 mb-8 leading-relaxed">
              We leverage cutting-edge AI, Big Data, and Machine Learning to drive innovation and give your business a competitive edge in today's fast-evolving digital landscape.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <a
                href="#expertise"
                onClick={(e) => {
                  e.preventDefault();
                  const expertiseSection = document.querySelector('#expertise');
                  if (expertiseSection) {
                    const topOffset = expertiseSection.getBoundingClientRect().top + window.scrollY - 80;
                    window.scrollTo({
                      top: topOffset,
                      behavior: 'smooth'
                    });
                  }
                }}
                className="bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 text-center"
              >
                Explore Our Services
              </a>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  const contactSection = document.querySelector('#contact');
                  if (contactSection) {
                    const topOffset = contactSection.getBoundingClientRect().top + window.scrollY - 80;
                    window.scrollTo({
                      top: topOffset,
                      behavior: 'smooth'
                    });
                  }
                }}
                className="bg-white border-2 border-primary/20 hover:border-primary/40 text-primary font-semibold py-3 px-6 rounded-xl text-center transition duration-300 hover:shadow-lg"
              >
                Get in Touch
              </a>
            </div>
          </motion.div>
          
          <motion.div 
            variants={slideIn("left", "tween", 0.2, 1)}
            className="md:w-1/2"
          >
            <GrassTexture className="p-5 md:p-8 relative">
              <img
                src="https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3400&q=80"
                alt="AI and technology visualization"
                className="rounded-lg w-full h-auto shadow-lg"
              />
              <div className="absolute -bottom-4 -right-4 bg-secondary text-white rounded-lg p-4 shadow-lg">
                <div className="flex items-center">
                  <div className="mr-3 bg-white/20 p-2 rounded-md">
                    <FaBrain className="text-xl" style={{ color: '#f0644c' }} />
                  </div>
                  <div>
                    <p className="font-semibold">Powered by</p>
                    <p className="text-sm opacity-90">Advanced AI Technology</p>
                  </div>
                </div>
              </div>
            </GrassTexture>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
