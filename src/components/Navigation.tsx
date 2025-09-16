import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border/50" : ""
    }`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button 
            onClick={() => scrollToSection("hero")}
            className="text-xl font-bold text-gradient hover:scale-105 transition-transform"
          >
            ALEX5402
          </button>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => scrollToSection("hero")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection("about")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection("work")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Work
            </button>
          </div>

          {/* Contact Button */}
          <Button 
            variant="outline" 
            size="sm"
            className="glass glow-on-hover"
            onClick={() => scrollToSection("contact")}
          >
            Contact
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;