import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { fadeIn, slideIn, staggerContainer } from "@/lib/animations";
import { GrassTexture } from "@/components/ui/grass-texture";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { contactFormSchema, type ContactFormData } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaLinkedinIn, FaTwitter, FaFacebookF, FaInstagram } from "react-icons/fa";

interface ContactInfoItem {
  icon: React.ReactNode;
  title: string;
  content: string;
  link?: string;
}

interface SocialLink {
  icon: React.ReactNode;
  href: string;
}

export default function ContactSection() {
  const { toast } = useToast();
  
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: ""
    }
  });
  
  // Check if the URL contains a CV hash parameter
  React.useEffect(() => {
    // Check if the URL has a #cv hash to indicate the user wants to send their CV
    if (window.location.hash === '#cv') {
      // Pre-fill the subject field for CV submissions
      form.setValue('subject', 'CV Submission for Future Opportunities');
      
      // Scroll to the contact form
      setTimeout(() => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  }, [form]);
  
  const contactMutation = useMutation({
    mutationFn: (data: ContactFormData) => {
      return apiRequest("/api/contact", {
        method: "POST",
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      toast({
        title: "Message sent!",
        description: "We'll get back to you within 24 hours.",
        variant: "default",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error sending message",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: ContactFormData) => {
    contactMutation.mutate(data);
  };

  const contactInfo = [
    {
      icon: <FaMapMarkerAlt className="text-primary" />,
      title: "Our Location",
      content: "University Way, Nairobi, Kenya",
    },
    {
      icon: <FaEnvelope className="text-primary" />,
      title: "Email Us",
      content: "hudson.eboso@techbrain.africa",
      link: "mailto:hudson.eboso@techbrain.africa",
    },
    {
      icon: <FaPhone className="text-primary" />,
      title: "Call Us",
      content: "+254 (78) 0010010",
      link: "tel:+254780010010",
    },
  ];

  const socialLinks = [
    { icon: <FaLinkedinIn className="text-primary" />, href: "https://www.linkedin.com/company/techbrainco/?viewAsMember=true" },
    { icon: <FaTwitter className="text-primary" />, href: "https://twitter.com" },
    { icon: <FaFacebookF className="text-primary" />, href: "https://facebook.com" },
    { icon: <FaInstagram className="text-primary" />, href: "https://instagram.com" },
  ];

  return (
    <section
      id="contact"
      className="py-20 bg-[radial-gradient(rgba(52,183,104,0.1)_2px,transparent_2px),radial-gradient(rgba(52,183,104,0.05)_2px,transparent_2px)] bg-[length:40px_40px] bg-[0_0,20px_20px]"
    >
      <div className="container mx-auto px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="flex flex-col lg:flex-row"
        >
          <motion.div
            variants={fadeIn("right", "tween", 0.2, 1)}
            className="lg:w-1/2 lg:pr-16 mb-10 lg:mb-0"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
              Get in Touch
            </h2>
            <p className="text-lg opacity-80 mb-8 leading-relaxed">
              Ready to discuss how TechBrain can help your business grow? Fill out
              the form and our team will get back to you within 24 hours.
            </p>

            <div className="space-y-6">
              {contactInfo.map((item, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn("up", "tween", 0.3 + index * 0.1, 1)}
                  className="flex items-start"
                >
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mr-4 shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">{item.title}</h4>
                    {item.link ? (
                      <a href={item.link} className="opacity-80 hover:text-primary transition-colors">
                        {item.content}
                      </a>
                    ) : (
                      <p className="opacity-80">{item.content}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              variants={fadeIn("up", "tween", 0.6, 1)}
              className="mt-10"
            >
              <h4 className="font-bold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                {socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary/20 transition duration-300"
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            variants={slideIn("left", "tween", 0.2, 1)}
            className="lg:w-1/2"
          >
            <GrassTexture className="p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Your name" 
                            className="w-full px-4 py-3 rounded-lg border border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition duration-300" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="your@email.com" 
                            type="email"
                            className="w-full px-4 py-3 rounded-lg border border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition duration-300" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="How can we help you?" 
                            className="w-full px-4 py-3 rounded-lg border border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition duration-300" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us about your project" 
                            className="w-full px-4 py-3 rounded-lg border border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition duration-300" 
                            rows={5}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 nav-btn-pulse"
                    disabled={contactMutation.isPending}
                  >
                    {contactMutation.isPending ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </Form>
            </GrassTexture>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
