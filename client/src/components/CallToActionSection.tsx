import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animations";
import { GrassTexture } from "@/components/ui/grass-texture";

export default function CallToActionSection() {
  return (
    <section className="py-20 bg-gradient-to-r from-primary/10 to-secondary/10">
      <div className="container mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={fadeIn("up", "tween", 0.2, 1)}
        >
          <GrassTexture className="p-10 text-center max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-lg opacity-80 mb-8 max-w-2xl mx-auto">
              Let's transform your business together! Contact us today to explore how
              TechBrain can power your success with AI, Big Data, Web Design,
              E-commerce Platforms, and Machine Learning.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1"
              >
                Get Started Now
              </a>
              <a
                href="#expertise"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#expertise')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="bg-white border-2 border-primary/20 hover:border-primary/40 text-primary font-semibold py-3 px-6 rounded-xl text-center transition duration-300 hover:shadow-lg"
              >
                Explore Services
              </a>
            </div>
          </GrassTexture>
        </motion.div>
      </div>
    </section>
  );
}
