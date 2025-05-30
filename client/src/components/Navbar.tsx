import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { fadeIn } from "@/lib/animations";
import { apiRequest } from "@/lib/queryClient";
import { User } from "@shared/schema";

const navLinks = [
  { name: "Home", href: "#home", isAnchor: true },
  { name: "Expertise", href: "#expertise", isAnchor: true },
  { name: "About Us", href: "#about", isAnchor: true },
  { name: "Metrics", href: "#data-visualization", isAnchor: true },
  { name: "Careers", href: "/careers", isAnchor: false },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [, navigate] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Check if user is logged in and is an admin
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await apiRequest<{ user: User }>('/api/auth/session');
        if (response.user) {
          setUser(response.user);
          setIsAdmin(response.user.role === 'admin');
        }
      } catch (error) {
        // Not logged in or error, leave user as null
        console.log("Not logged in");
      }
    };
    checkSession();
  }, []);

  const handleNavClick = (href: string, isAnchor: boolean = false) => {
    setIsOpen(false);
    
    if (isAnchor || href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        window.scrollTo({
          top: element.getBoundingClientRect().top + window.scrollY - 80,
          behavior: "smooth",
        });
      } else if (href === '#home' && window.location.pathname !== '/') {
        // If we're not on the homepage and trying to go to #home, navigate to home first
        navigate('/');
        setTimeout(() => {
          const homeElement = document.querySelector('#home');
          if (homeElement) {
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }
        }, 100);
      }
    } else {
      // For regular links like "/careers", use wouter navigation
      navigate(href);
    }
  };

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/80 backdrop-blur-lg border-b border-primary/10" : "bg-transparent"}`}>
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-3xl font-heading font-bold logo-hover inline-block">
            <span className="text-primary">Tech</span><span style={{ color: '#f0644c' }}>Brain</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(link.href, link.isAnchor);
              }}
              className="font-medium text-neutral hover:text-primary transition duration-300 ease-in-out relative group nav-link-hover"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary rounded-full group-hover:w-full transition-all duration-300 ease-in-out transform origin-left group-hover:animate-[nav-underline_0.3s_ease-in-out]"></span>
            </a>
          ))}
          
          {/* Show Dashboard link only for admin users */}
          {isAdmin && (
            <Link
              href="/dashboard"
              className="font-medium text-neutral hover:text-primary transition duration-300 ease-in-out relative group nav-link-hover"
            >
              Dashboard
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary rounded-full group-hover:w-full transition-all duration-300 ease-in-out transform origin-left group-hover:animate-[nav-underline_0.3s_ease-in-out]"></span>
            </Link>
          )}
          
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              const handleNavClick = (sectionId: string, closeMenu: boolean = false) => {
    const section = document.querySelector(sectionId);
    if (section) {
      const topOffset = section.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({
        top: topOffset,
        behavior: 'smooth'
      });
    }
    if (closeMenu) {
      setIsOpen(false);
    }
  };

  handleNavClick('#contact', true);
            }}
            className="bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 nav-btn-pulse"
          >
            Get in Touch
          </a>
        </div>

        {/* Mobile Navigation Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="focus:outline-none menu-icon-hover transition-colors duration-300"
            aria-expanded={isOpen}
            aria-label="Toggle navigation menu"
          >
            <svg
              className="h-6 w-6 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/95 backdrop-blur-lg px-6 py-4 border-t border-primary/10"
          >
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href, link.isAnchor);
                  }}
                  className="font-medium text-neutral hover:text-primary py-2 transition duration-300 ease-in-out relative group nav-link-hover"
                >
                  {link.name}
                  <span className="absolute -bottom-0 left-0 w-0 h-0.5 bg-primary rounded-full group-hover:w-1/2 transition-all duration-300 ease-in-out transform origin-left group-hover:animate-[nav-underline_0.3s_ease-in-out]"></span>
                </a>
              ))}
              
              {/* Show Dashboard link in mobile menu for admin users */}
              {isAdmin && (
                <Link
                  href="/dashboard"
                  className="font-medium text-neutral hover:text-primary py-2 transition duration-300 ease-in-out relative group nav-link-hover"
                >
                  Dashboard
                  <span className="absolute -bottom-0 left-0 w-0 h-0.5 bg-primary rounded-full group-hover:w-1/2 transition-all duration-300 ease-in-out transform origin-left group-hover:animate-[nav-underline_0.3s_ease-in-out]"></span>
                </Link>
              )}
              
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('#contact', true);
                }}
                className="bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-xl text-center transition-all duration-300 shadow-md nav-btn-pulse"
              >
                Get in Touch
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
