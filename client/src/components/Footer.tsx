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
    { name: "Terms of Use", href: "/terms", isPage: true },
    { name: "Company Policy", href: "/policy", isPage: true },
  ];

  const contactInfo = [
    {
      icon: <FaMapMarkerAlt className="mt-1 mr-3 text-primary" />,
      content: "University Way, Nairobi, Kenya",
    },
    {
      icon: <FaEnvelope className="mt-1 mr-3 text-primary" />,
      content: "hudson.eboso@techbrain.africa",
    },
    {
      icon: <FaPhone className="mt-1 mr-3 text-primary" />,
      content: "+254 (78) 0010010",
    },
  ];

  const socialLinks = [
    { icon: <FaLinkedinIn />, href: "https://www.linkedin.com/company/techbrainco/?viewAsMember=true" },
    { icon: <FaTwitter />, href: "https://twitter.com" },
    { icon: <FaFacebookF />, href: "https://facebook.com" },
    { icon: <FaInstagram />, href: "https://instagram.com" },
  ];

  const scrollToSection = (id: string) => {
    const element = document.querySelector(id);
    if (element) {
      window.scrollTo({
        top: element.getBoundingClientRect().top + window.scrollY - 80,
        behavior: "smooth",
      });
    } else if (id === '#home' && window.location.pathname !== '/') {
      // If we're not on the homepage and trying to go to #home, navigate to home first
      window.location.href = '/';
    }
  };

  return (
    <footer className="bg-neutral-dark text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div>
            <h3 className="text-2xl font-heading font-bold mb-6 inline-block logo-hover">
              <span className="text-primary">Tech</span><span style={{ color: '#f0644c' }}>Brain</span>
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
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-primary transition duration-300 social-icon-hover"
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
                  {link.isPage ? (
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-primary transition duration-300"
                    >
                      {link.name}
                    </Link>
                  ) : (
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
                  )}
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
