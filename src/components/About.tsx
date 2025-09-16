import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import alexPortrait from "@/assets/alex-portrait.png";
import { useAge } from "@/hooks/use-age";

const About = () => {
  // Set your birthdate here - adjust this to your actual birthdate
  const birthDate = new Date('2003-03-12'); // Example: January 15, 2002
  const age = useAge(birthDate);

  const stats = [
    { label: "Total Repositories", value: "225", suffix: "+100 public" },
    { label: "Stars Earned", value: "453", suffix: "total" },
    { label: "Forks", value: "261", suffix: "total" },
    { label: "Followers", value: "101", suffix: "total" },
  ];

  const skills = [
    { name: "Android Development", level: 95 },
    { name: "Kotlin", level: 90 },
    { name: "Java", level: 85 },
    { name: "Open Source", level: 88 },
    { name: "Mobile UI/UX", level: 82 },
    { name: "Git & GitHub", level: 92 },
  ];

  return (
    <section className="py-20 px-4" id="about">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">About Me</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get to know me better and see what I'm currently up to
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Personal Info Card with enhanced animations */}
          <Card className="glass p-8 space-y-6 tilt-card group hover:shadow-2xl transition-all duration-500">
            <div className="flex items-start gap-6">
              <div className="relative">
                <img 
                  src={alexPortrait}
                  alt="Alex (Suman) - Android Developer"
                  className="w-24 h-24 rounded-2xl object-cover ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300 hover:scale-110"
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-success rounded-full border-4 border-background flex items-center justify-center pulse-ring">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2 text-gradient">Alex (Suman)</h3>
                <p className="text-accent font-medium mb-2 hover:text-primary transition-colors cursor-default">Android Developer & Open Source Contributor</p>
                <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 border border-success/20">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                  <span className="text-sm text-success font-medium">💭 Just chilling</span>
                </div>
                
                <p className="text-muted-foreground leading-relaxed hover:text-foreground transition-colors duration-300">
                  Hey there! I'm Suman, but people know me as Alex on the internet. :) I'm a{" "}
                  <span className="text-primary font-semibold hover:text-gradient-reverse transition-all duration-300 cursor-default group relative">
                    {age.years}-year-old
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                      {age.totalYears.toFixed(10)} years old
                    </div>
                  </span> native Android developer from India. 
                  I started programming as a hobby, but after 2022, I began taking it seriously. 
                  Over time, I've developed a strong passion for programming.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-muted-foreground hover:text-foreground transition-colors duration-300">
                I enjoy contributing to{" "}
                <a href="https://github.com/alex5402" className="text-accent hover:text-primary font-medium transition-all duration-300 hover:underline decoration-2 underline-offset-4">
                  🤓 open-source
                </a>{" "}
                Android projects, such as{" "}
                <a href="https://github.com/tiann/KernelSU" className="text-primary hover:text-accent font-medium transition-all duration-300 hover:underline decoration-2 underline-offset-4">
                  KernelSU
                </a>.
              </p>

              {/* Enhanced Skills Progress with stagger animation */}
              <div className="space-y-3 pt-4">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <span className="animate-bounce-gentle">🚀</span>
                  Technical Skills
                </h4>
                <div className="stagger-children space-y-3">
                  {skills.map((skill, index) => (
                    <div key={skill.name} className="space-y-1 group/skill">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground group-hover/skill:text-foreground transition-colors">{skill.name}</span>
                        <span className="text-primary font-medium group-hover/skill:text-accent transition-colors">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-primary to-accent rounded-full h-2 transition-all duration-2000 ease-out group-hover/skill:from-accent group-hover/skill:to-primary"
                          style={{ 
                            width: `${skill.level}%`,
                            animationDelay: `${index * 0.2}s`
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Enhanced GitHub Analytics */}
          <div className="space-y-6">
            <Card className="glass p-6 tilt-card group hover:shadow-xl transition-all duration-500">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="animate-spin-slow">📦</span> GitHub Analytics
                <div className="ml-auto flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 border border-primary/20">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <span className="text-xs text-primary font-medium">Real-time</span>
                </div>
              </h3>
              
              <div className="grid grid-cols-2 gap-4 stagger-children">
                {stats.map((stat, index) => (
                  <div key={stat.label} className="text-center p-4 rounded-lg bg-muted/20 border border-border/50 hover:bg-primary/5 hover:border-primary/30 transition-all duration-300 group/stat tilt-card">
                    <div className="text-2xl font-bold text-primary mb-1 group-hover/stat:text-accent transition-colors group-hover/stat:scale-110 transform duration-300">{stat.value}</div>
                    <div className="text-sm text-muted-foreground mb-1 group-hover/stat:text-foreground transition-colors">{stat.label}</div>
                    <div className="text-xs text-accent group-hover/stat:text-primary transition-colors">{stat.suffix}</div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Enhanced Activity Card */}
            <Card className="glass p-6 tilt-card group hover:shadow-xl transition-all duration-500">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="animate-pulse-glow">⚡</span> Current Activity
              </h3>
              <div className="space-y-3 stagger-children">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20 hover:bg-primary/20 hover:scale-105 transition-all duration-300 group/activity">
                  <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
                  <span className="text-sm group-hover/activity:text-primary transition-colors">Working on Android projects</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/10 border border-accent/20 hover:bg-accent/20 hover:scale-105 transition-all duration-300 group/activity">
                  <div className="w-3 h-3 bg-accent rounded-full animate-pulse" />
                  <span className="text-sm group-hover/activity:text-accent transition-colors">Contributing to KernelSU</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 border border-border/50 hover:bg-muted/30 hover:scale-105 transition-all duration-300 group/activity">
                  <div className="w-3 h-3 bg-muted-foreground rounded-full animate-bounce-gentle" />
                  <span className="text-sm group-hover/activity:text-foreground transition-colors">Learning new technologies</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;