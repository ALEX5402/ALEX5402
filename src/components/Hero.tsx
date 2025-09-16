import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Github, Mail, GamepadIcon, DollarSign, ExternalLink } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";
import ParticleBackground from "./ParticleBackground";

const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToWork = () => {
    const workSection = document.getElementById('work');
    if (workSection) {
      workSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-primary/15 via-primary/5 to-background/60">
      <ParticleBackground />
      
      {/* Dynamic Background Image with Parallax */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 transition-transform duration-1000 ease-out"
        style={{ 
          backgroundImage: `url(${heroImage})`,
          transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px) scale(1.1)`
        }}
      />
      
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-bounce-gentle" />
        <div className="absolute bottom-1/3 left-10 w-48 h-48 bg-accent/15 rounded-full blur-2xl animate-pulse-glow" />
        
        {/* Rotating geometric shapes */}
        <div className="absolute top-1/4 right-1/4 w-16 h-16 border-2 border-primary/30 rotate-45 animate-spin-slow" />
        <div className="absolute bottom-1/4 left-1/3 w-12 h-12 border-2 border-accent/30 rounded-full animate-pulse" />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Welcome Badge with enhanced animation */}
        <div className={`mb-8 transition-all duration-1000 ${isVisible ? 'reveal-up' : 'opacity-0 translate-y-12'}`}>
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass border gradient-border group hover:scale-105 transition-all duration-300">
            <span className="text-2xl animate-wiggle">👋</span>
            <span className="text-sm text-foreground/90 group-hover:text-foreground transition-colors font-medium">Welcome to my portfolio</span>
          </div>
        </div>

        {/* Main Title with shimmer effect */}
        <h1 className={`text-6xl md:text-8xl font-bold mb-6 transition-all duration-1000 delay-200 ${isVisible ? 'reveal-up-delay' : 'opacity-0 translate-y-12'}`}>
          <span className="text-shimmer">ALEX5402</span>
        </h1>

        {/* Subtitle with typewriter effect */}
        <div className={`space-y-2 mb-8 max-w-2xl mx-auto transition-all duration-1000 delay-400 ${isVisible ? 'reveal-up-delay-2' : 'opacity-0 translate-y-12'}`}>
          <p className="text-xl md:text-2xl text-foreground/80 hover:text-gradient-reverse transition-all duration-500 cursor-default">
            I like to make things simple.
          </p>
          <p className="text-xl md:text-2xl text-foreground/80 hover:text-gradient transition-all duration-500 cursor-default">
            I love cats :)
          </p>
        </div>

        {/* Description with enhanced styling */}
        <p className={`text-lg text-foreground/90 max-w-3xl mx-auto mb-12 leading-relaxed transition-all duration-1000 delay-600 ${isVisible ? 'reveal-up-delay-3' : 'opacity-0 translate-y-12'}`}>
          <span className="text-gradient-reverse font-semibold">Android developer</span> passionate about creating elegant mobile solutions and building amazing user experiences.
          Currently crafting native Android apps and contributing to <span className="text-primary font-medium">open-source projects</span>.
        </p>

        {/* Enhanced CTA Section */}
        <div className={`space-y-8 transition-all duration-1000 delay-800 ${isVisible ? 'reveal-up-delay-3' : 'opacity-0 translate-y-12'}`}>
          <Button 
            size="lg" 
            className="glow-on-hover px-8 py-6 text-lg font-semibold rounded-xl group relative overflow-hidden pulse-ring"
            onClick={scrollToWork}
          >
            <span className="relative z-10 flex items-center gap-2">
              Discover my work 
              <span className="inline-block animate-bounce-gentle">↓</span>
            </span>
          </Button>

          {/* Enhanced Social Links with stagger animation */}
          <div className="stagger-children flex justify-center gap-4 flex-wrap">
            <Button variant="outline" size="lg" className="glass accent-glow group tilt-card magnetic">
              <Github className="w-5 h-5 mr-2 group-hover:text-accent transition-all duration-300 group-hover:rotate-12" />
              <span>Github</span>
              <span className="ml-1 animate-wiggle">🔥</span>
            </Button>
            <Button variant="outline" size="lg" className="glass accent-glow group tilt-card magnetic">
              <Mail className="w-5 h-5 mr-2 group-hover:text-accent transition-all duration-300 group-hover:rotate-12" />
              <span>Mail Me</span>
              <span className="ml-1 animate-pulse">💌</span>
            </Button>
            <Button variant="outline" size="lg" className="glass accent-glow group tilt-card magnetic" asChild>
              <a href="https://buymeacoffee.com/alex5402" target="_blank" rel="noopener noreferrer">
                <DollarSign className="w-5 h-5 mr-2 group-hover:text-yellow-500 transition-all duration-300 group-hover:scale-110" />
                <span>Support</span>
                <span className="ml-1 animate-wiggle">😍</span>
              </a>
            </Button>
          </div>
          
          {/* alex5402.me Button */}
          <div className="flex justify-center mt-4">
            <Button variant="outline" size="sm" className="glass glow-on-hover group/btn" asChild>
              <a 
                href="https://www.alex5402.me" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4 group-hover/btn:rotate-12 transition-transform duration-300" />
                <span>alex5402.me</span>
              </a>
            </Button>
          </div>
        </div>
      </div>


      {/* Shadow-like Blending Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-black/20 to-black/60 z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-black/40 z-10" />
    </section>
  );
};

export default Hero;