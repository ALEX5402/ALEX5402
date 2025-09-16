import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, Star, GitFork, Loader2, AlertCircle } from "lucide-react";
import { useGitHubPinned } from "@/hooks/use-github-pinned";

const Work = () => {
  // Set your GitHub username here
  const githubUsername = "alex5402";
  const { repos, user, loading, error } = useGitHubPinned(githubUsername);

  // Helper function to get emoji based on language
  const getLanguageEmoji = (language: string): string => {
    const emojiMap: { [key: string]: string } = {
      'Kotlin': '📱',
      'Java': '☕',
      'JavaScript': '🟨',
      'TypeScript': '🔷',
      'Python': '🐍',
      'C++': '⚙️',
      'C': '🔧',
      'C#': '🔷',
      'Go': '🐹',
      'Rust': '🦀',
      'PHP': '🐘',
      'Ruby': '💎',
      'Swift': '🍎',
      'Dart': '🎯',
      'HTML': '🌐',
      'CSS': '🎨',
      'Shell': '🐚',
      'Dockerfile': '🐳',
      'Other': '📦'
    };
    return emojiMap[language] || '📦';
  };

  // Helper function to format numbers
  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const contributions = [
    { repo: "tiann/KernelSU", description: "Kernel-level root solution", commits: "45+" },
    { repo: "android/compose-samples", description: "Jetpack Compose examples", commits: "12+" },
    { repo: "kotlin/kotlinx.coroutines", description: "Coroutines library", commits: "8+" }
  ];

  return (
    <section className="py-20 px-4 relative" id="work">
      {/* Gradient Transition from About */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-background/50 to-transparent -mt-8" />
      
      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">My Work</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A collection of projects I've built and contributed to, focusing on Android development and open source
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading your GitHub repositories...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <AlertCircle className="w-8 h-8 mx-auto mb-4 text-destructive" />
              <p className="text-destructive mb-2">Failed to load repositories</p>
              <p className="text-muted-foreground text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* GitHub Pinned Repositories */}
        {!loading && !error && repos.length > 0 && (
          <>
            <div className="text-center mb-8">
              <p className="text-muted-foreground">
                Showing your top {repos.length} repositories from GitHub
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {repos.slice(0, 4).map((repo, index) => (
                <Card key={repo.id} className="glass p-6 group hover:scale-[1.02] transition-all duration-500 glow-on-hover tilt-card relative overflow-hidden">
                  {/* Animated background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="space-y-4 relative z-10">
                    {/* Project Icon & Title with enhanced animations */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-4xl animate-bounce-gentle group-hover:animate-rubber-band transition-all duration-300">
                          {getLanguageEmoji(repo.language)}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold group-hover:text-gradient transition-all duration-300">
                            {repo.name}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1 hover:text-primary transition-colors group/stars">
                              <Star className="w-4 h-4 group-hover/stars:text-yellow-500 transition-colors" />
                              <span className="group-hover/stars:font-bold transition-all">{formatNumber(repo.stargazersCount)}</span>
                            </div>
                            <div className="flex items-center gap-1 hover:text-accent transition-colors group/forks">
                              <GitFork className="w-4 h-4 group-hover/forks:text-accent transition-colors" />
                              <span className="group-hover/forks:font-bold transition-all">{formatNumber(repo.forksCount)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="relative">
                        <div className="px-2 py-1 rounded-full text-xs font-medium transition-all duration-300 bg-gradient-to-r from-primary to-accent text-primary-foreground animate-pulse-glow">
                          Pinned
                        </div>
                      </div>
                    </div>

                    {/* Description with hover effect */}
                    <p className="text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors duration-300">
                      {repo.description}
                    </p>

                    {/* Enhanced Tags with stagger animation */}
                    <div className="flex flex-wrap gap-2">
                      <div className="px-2 py-1 rounded-md bg-muted/20 border border-border/50 text-xs hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all duration-300 cursor-default">
                        {repo.language}
                      </div>
                      {repo.topics.slice(0, 3).map((topic, tagIndex) => (
                        <div
                          key={topic}
                          className="px-2 py-1 rounded-md bg-muted/20 border border-border/50 text-xs hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all duration-300 cursor-default"
                          style={{ animationDelay: `${tagIndex * 0.1}s` }}
                        >
                          {topic}
                        </div>
                      ))}
                    </div>

                    {/* Enhanced Actions */}
                    <div className="flex gap-3 pt-2">
                      <Button size="sm" variant="outline" className="flex-1 group/btn tilt-card" asChild>
                        <a href={repo.htmlUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="w-4 h-4 mr-2 group-hover/btn:text-accent group-hover/btn:rotate-12 transition-all duration-300" />
                          <span className="group-hover/btn:text-accent transition-colors">View Code</span>
                        </a>
                      </Button>
                      {repo.homepage && (
                        <Button size="sm" className="flex-1 group/btn glow-on-hover" asChild>
                          <a href={repo.homepage} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-2 group-hover/btn:rotate-12 transition-transform duration-300" />
                            Live Demo
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Additional Repositories */}
        {!loading && !error && repos.length > 4 && (
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {repos.slice(4).map((repo, index) => (
              <Card key={repo.id} className="glass p-4 group hover:bg-muted/5 transition-all duration-300 tilt-card">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl animate-bounce-gentle group-hover:animate-wiggle">
                      {getLanguageEmoji(repo.language)}
                    </span>
                    <h4 className="font-semibold group-hover:text-gradient transition-all duration-300">
                      {repo.name}
                    </h4>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1 hover:text-primary transition-colors">
                      <Star className="w-3 h-3" />
                      <span className="hover:font-bold transition-all">{formatNumber(repo.stargazersCount)}</span>
                    </div>
                    <div className="flex items-center gap-1 hover:text-accent transition-colors">
                      <GitFork className="w-3 h-3" />
                      <span className="hover:font-bold transition-all">{formatNumber(repo.forksCount)}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3 leading-relaxed group-hover:text-foreground transition-colors">
                  {repo.description}
                </p>
                
                <div className="flex justify-between items-center">
                  <div className="flex gap-1 flex-wrap">
                    <div className="px-2 py-1 rounded-md bg-muted/20 border border-border/50 text-xs hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all duration-300">
                      {repo.language}
                    </div>
                    {repo.topics.slice(0, 1).map((topic, tagIndex) => (
                      <div
                        key={topic}
                        className="px-2 py-1 rounded-md bg-muted/20 border border-border/50 text-xs hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all duration-300"
                        style={{ animationDelay: `${tagIndex * 0.1}s` }}
                      >
                        {topic}
                      </div>
                    ))}
                  </div>
                  <Button size="sm" variant="ghost" className="h-8 px-2 group/btn" asChild>
                    <a href={repo.htmlUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4 group-hover/btn:text-accent group-hover/btn:rotate-12 transition-all duration-300" />
                    </a>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* GitHub Profile Summary */}
        {!loading && !error && user && (
          <Card className="glass p-6 tilt-card group hover:shadow-xl transition-all duration-500">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="animate-spin-slow">🌟</span> GitHub Profile
            </h3>
            
            <div className="grid md:grid-cols-3 gap-4 stagger-children">
              <div className="p-4 rounded-lg bg-muted/20 border border-border/50 hover:bg-primary/5 hover:border-primary/30 transition-all duration-300 group/stat tilt-card">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-sm group-hover/stat:text-gradient transition-all duration-300">Public Repositories</h4>
                  <div className="px-2 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs text-primary group-hover/stat:bg-primary/20 transition-all duration-300">
                    {user.publicRepos}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground group-hover/stat:text-foreground transition-colors">Total repositories</p>
              </div>
              
              <div className="p-4 rounded-lg bg-muted/20 border border-border/50 hover:bg-accent/5 hover:border-accent/30 transition-all duration-300 group/stat tilt-card">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-sm group-hover/stat:text-gradient transition-all duration-300">Followers</h4>
                  <div className="px-2 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs text-accent group-hover/stat:bg-accent/20 transition-all duration-300">
                    {user.followers}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground group-hover/stat:text-foreground transition-colors">GitHub followers</p>
              </div>
              
              <div className="p-4 rounded-lg bg-muted/20 border border-border/50 hover:bg-primary/5 hover:border-primary/30 transition-all duration-300 group/stat tilt-card">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-sm group-hover/stat:text-gradient transition-all duration-300">Following</h4>
                  <div className="px-2 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs text-primary group-hover/stat:bg-primary/20 transition-all duration-300">
                    {user.following}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground group-hover/stat:text-foreground transition-colors">Following developers</p>
              </div>
            </div>
            
            <div className="text-center mt-6">
              <Button variant="outline" className="glow-on-hover group/btn" asChild>
                <a href={`https://github.com/${githubUsername}`} target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4 mr-2 group-hover/btn:rotate-12 transition-transform duration-300" />
                  <span className="group-hover/btn:text-gradient transition-all duration-300">View GitHub Profile</span>
                </a>
              </Button>
            </div>
          </Card>
        )}
      </div>
    </section>
  );
};

export default Work;