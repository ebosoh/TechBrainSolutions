import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/animations";
import { GrassCard } from "@/components/ui/grass-card";
import { FaStar } from "react-icons/fa";

const testimonials = [
  {
    content:
      "TechBrain completely transformed our approach to customer data. Their AI solution helped us increase conversions by 45% in just three months.",
    author: "John Doe",
    position: "Marketing Director, TechCompany",
    initials: "JD",
  },
  {
    content:
      "The e-commerce platform TechBrain developed for us is not only beautiful but extremely functional. Sales are up 60% since launch!",
    author: "Jane Smith",
    position: "CEO, Retail Solutions",
    initials: "JS",
  },
  {
    content:
      "Their Big Data analytics implementation has given us insights we never knew were possible. Decision-making is now faster and backed by real data.",
    author: "Robert Johnson",
    position: "CTO, DataCorp",
    initials: "RJ",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-gradient-to-r from-primary/5 to-secondary/5">
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
            What Our Clients Say
          </motion.h2>
          <motion.p
            variants={fadeIn("up", "tween", 0.3, 1)}
            className="text-lg opacity-80"
          >
            Hear from the businesses we've helped transform with our intelligent tech solutions.
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={fadeIn("up", "tween", 0.2 + index * 0.1, 1)}
            >
              <GrassCard className="p-8 h-full">
                <div className="flex items-center mb-4 text-primary">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                </div>
                <p className="opacity-80 mb-6 italic">{testimonial.content}</p>
                <div className="flex items-center">
                  <div className="bg-secondary/20 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                    <span className="text-secondary font-bold">
                      {testimonial.initials}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold">{testimonial.author}</h4>
                    <p className="text-sm opacity-60">{testimonial.position}</p>
                  </div>
                </div>
              </GrassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
