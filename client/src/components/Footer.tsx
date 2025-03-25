import { Link } from "wouter";
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaLinkedinIn, FaTwitter, FaFacebookF, FaInstagram } from "react-icons/fa";

export default function Footer() {
  const services = [
    { name: "AI & Machine Learning", href: "#expertise" },
    { name: "Big Data & Analytics", href: "#expertise" },
    { name: "Web Design & Development", href: "#expertise" },
    { name: "E-commerce Solutions", href: "#expertise" },
    { name: "Digital Marketing", href: "#expertise" },
  ];

  const quickLinks = [
    { name: "Home", href: "#home" },
    { name: "About Us", href: "#about" },
    { name: "Services", href: "#expertise" },
    { name: "Contact", href: "#contact" },
  ];

  const contactInfo = [
    {
      icon: <FaMapMarkerAlt className="mt-1 mr-3 text-primary" />,
      content: "123 Tech Avenue, Innovation District, CA 94043",
    },
    {
      icon: <FaEnvelope className="mt-1 mr-3 text-primary" />,
      content: "info@techbrain.com",
    },
    {
      icon: <FaPhone className="mt-1 mr-3 text-primary" />,
      content: "+1 (555) 123-4567",
    },
  ];

  const socialLinks = [
    { icon: <FaLinkedinIn />, href: "#" },
    { icon: <FaTwitter />, href: "#" },
    { icon: <FaFacebookF />, href: "#" },
    { icon: <FaInstagram />, href: "#" },
  ];

  const scrollToSection = (id: string) => {
    const element = document.querySelector(id);
    if (element) {
      window.scrollTo({
        top: element.getBoundingClientRect().top + window.scrollY - 80,
        behavior: "smooth",
      });
    }
  };

  return (
    <footer className="bg-neutral-dark text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div>
            <h3 className="text-2xl font-heading font-bold mb-6">
              Tech<span className="text-primary">Brain</span>
            </h3>
            <p className="text-gray-300 mb-6">
              Intelligent, data-driven solutions that fuel growth, innovation, and
              success.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-gray-300 hover:text-primary transition duration-300"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Our Services</h4>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <a
                    href={service.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(service.href);
                    }}
                    className="text-gray-300 hover:text-primary transition duration-300"
                  >
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.href);
                    }}
                    className="text-gray-300 hover:text-primary transition duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Contact Info</h4>
            <ul className="space-y-3">
              {contactInfo.map((item, index) => (
                <li key={index} className="flex items-start">
                  {item.icon}
                  <span className="text-gray-300">{item.content}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-400">© {new Date().getFullYear()} TechBrain. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
