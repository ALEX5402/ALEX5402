import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, Mail, GamepadIcon, DollarSign, MessageCircle, MapPin, Send } from "lucide-react";

const Contact = () => {
  const contactMethods = [
    {
      icon: <Github className="w-6 h-6" />,
      title: "GitHub",
      description: "Check out my code and projects",
      action: "Follow @alex5402",
      href: "https://github.com/alex5402",
      color: "text-foreground"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      description: "Drop me a line anytime",
      action: "Send Email",
      href: "mailto:alexbhaiya@duck.com",
      color: "text-accent"
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Discord",
      description: "Let's chat about tech and cats",
      action: "Message Me",
      href: "https://discord.com/users/803060151082418217",
      color: "text-primary"
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: "Support",
      description: "Support my open source work",
      action: "Sponsor",
      href: "https://github.com/sponsors/ALEX5402",
      color: "text-yellow-500"
    }
  ];

  return (
    <section className="py-20 px-4 relative" id="contact">
      {/* Gradient Transition from Work */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-background/50 to-transparent -mt-8" />
      
      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Get In Touch</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have a project in mind? Want to collaborate? Or just want to say hi? I'd love to hear from you!
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="glass p-6">
              <h3 className="text-xl font-bold mb-4">Let's Connect</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-accent" />
                  <span className="text-muted-foreground">India 🇮🇳</span>
                </div>
                <div className="flex items-center gap-3">
                  <GamepadIcon className="w-5 h-5 text-primary" />
                  <span className="text-muted-foreground">Available for gaming sessions</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 text-xl">🐱</div>
                  <span className="text-muted-foreground">Cat lover & Android developer</span>
                </div>
              </div>
            </Card>

            <Card className="glass p-6">
              <h3 className="text-xl font-bold mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Response Time</span>
                  <span className="text-accent font-medium">~24 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Timezone</span>
                  <span className="text-primary font-medium">IST (UTC+5:30)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Availability</span>
                  <span className="text-success font-medium">Open to work</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Enhanced Contact Methods */}
          <div className="lg:col-span-2">
            <div className="grid md:grid-cols-2 gap-6 stagger-children">
              {contactMethods.map((method, index) => (
                <Card key={method.title} className="glass p-6 group hover:scale-[1.02] transition-all duration-500 glow-on-hover tilt-card relative overflow-hidden">
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="space-y-4 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className={`${method.color} group-hover:scale-125 transition-all duration-500 group-hover:rotate-12 pulse-ring`}>
                        {method.icon}
                      </div>
                      <h3 className="text-lg font-semibold group-hover:text-gradient transition-all duration-300">{method.title}</h3>
                    </div>
                    
                    <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      {method.description}
                    </p>
                    
                    <Button 
                      variant="outline" 
                      className="w-full group/btn glass glow-on-hover"
                      asChild
                    >
                      <a href={method.href} target="_blank" rel="noopener noreferrer">
                        <span className="group-hover/btn:text-primary transition-all duration-300 group-hover/btn:scale-105 transform">
                          {method.action}
                        </span>
                      </a>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Enhanced Call to Action */}
            <Card className="glass p-8 mt-8 text-center tilt-card group hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4 group-hover:text-gradient transition-all duration-300">
                  Ready to work together?
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto group-hover:text-foreground transition-colors duration-300">
                  Whether you have a project idea, want to collaborate on open source, or just want to chat about Android development, I'm always excited to connect with fellow developers and creators.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center stagger-children">
                  <Button size="lg" className="glow-on-hover group/cta" asChild>
                    <a href="mailto:alexbhaiya@duck.com" target="_blank" rel="noopener noreferrer">
                      <Mail className="w-5 h-5 mr-2 group-hover/cta:rotate-12 transition-transform duration-300" />
                      <span className="group-hover/cta:text-gradient-reverse transition-all duration-300">Send me an email</span>
                    </a>
                  </Button>
                  <Button variant="outline" size="lg" className="glass accent-glow group/cta" asChild>
                    <a href="https://t.me/alex5402" target="_blank" rel="noopener noreferrer">
                      <Send className="w-5 h-5 mr-2 group-hover/cta:rotate-12 transition-transform duration-300" />
                      <span className="group-hover/cta:text-primary transition-colors">Contact me on Telegram</span>
                    </a>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;