import { Github, Mail, Heart, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 py-12 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo & Copyright */}
          <div className="text-center md:text-left">
            <div className="text-xl font-bold text-gradient mb-2">ALEX</div>
            <p className="text-sm text-muted-foreground">
              © 2024 Alex (Suman). Built with{" "}
              <Heart className="inline w-4 h-4 text-red-500 mx-1" />
              and lots of coffee ☕
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <button 
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              className="hover:text-foreground transition-colors"
            >
              About
            </button>
            <button 
              onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
              className="hover:text-foreground transition-colors"
            >
              Work
            </button>
            <button 
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="hover:text-foreground transition-colors"
            >
              Contact
            </button>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/alex5402" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors group"
            >
              <Github className="w-5 h-5 group-hover:text-accent transition-colors" />
            </a>
            <a 
              href="mailto:alexbhaiya@duck.com"
              className="p-2 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors group"
            >
              <Mail className="w-5 h-5 group-hover:text-primary transition-colors" />
            </a>
          </div>
        </div>

        {/* Fun Footer Message */}
        <div className="mt-8 pt-8 border-t border-border/30">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground text-center sm:text-left">
              Made with modern web technologies • Powered by React & Tailwind CSS • 
              <span className="ml-2">🐱 Cat-approved code</span>
            </p>
            
            {/* alex5402.me Button */}
            <Button
              size="sm"
              variant="outline"
              className="glass glow-on-hover group/btn"
              asChild
            >
              <a 
                href="https://www.alex5402.me" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4 group-hover/btn:rotate-12 transition-transform duration-300" />
                <span className="text-xs">alex5402.me</span>
              </a>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;