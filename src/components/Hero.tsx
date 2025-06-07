
import { ArrowDown, Linkedin, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden bg-gradient-to-br from-orange-400 via-orange-500 to-purple-700">
      {/* Animated texture background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Flowing mesh gradient texture */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-300/30 via-purple-400/20 to-orange-500/30 animate-pulse"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-tl from-white/15 to-transparent rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-purple-300/20 to-orange-300/20 rounded-full blur-3xl animate-bounce"></div>
        </div>
        
        {/* Seamless dynamic swirling texture elements */}
        <div className="absolute inset-0">
          <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 1000 1000" preserveAspectRatio="none">
            <defs>
              <linearGradient id="swirl1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
                <stop offset="50%" stopColor="rgba(255,200,100,0.2)" />
                <stop offset="100%" stopColor="rgba(200,100,255,0.1)" />
              </linearGradient>
              <linearGradient id="swirl2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
                <stop offset="50%" stopColor="rgba(150,100,255,0.15)" />
                <stop offset="100%" stopColor="rgba(255,150,100,0.1)" />
              </linearGradient>
            </defs>
            {/* Seamless flowing paths */}
            <path d="M-200,300 Q50,100 300,300 T800,300 T1200,300 L1200,1000 L-200,1000 Z" fill="url(#swirl1)" className="animate-pulse">
              <animateTransform attributeName="transform" type="translate" values="-100,0; 100,20; -100,0" dur="12s" repeatCount="indefinite"/>
            </path>
            <path d="M-200,600 Q100,400 400,600 T800,600 T1200,600 L1200,1000 L-200,1000 Z" fill="url(#swirl2)" className="animate-pulse delay-500">
              <animateTransform attributeName="transform" type="translate" values="100,0; -100,15; 100,0" dur="15s" repeatCount="indefinite"/>
            </path>
            {/* Seamless floating elements */}
            <circle cx="200" cy="200" r="100" fill="rgba(255,255,255,0.1)" className="animate-pulse">
              <animateTransform attributeName="transform" type="translate" values="-50,0; 150,50; -50,0" dur="18s" repeatCount="indefinite"/>
            </circle>
            <circle cx="800" cy="700" r="80" fill="rgba(255,200,150,0.15)" className="animate-pulse delay-700">
              <animateTransform attributeName="transform" type="translate" values="50,0; -150,30; 50,0" dur="14s" repeatCount="indefinite"/>
            </circle>
            <ellipse cx="500" cy="150" rx="60" ry="30" fill="rgba(255,255,255,0.08)" className="animate-pulse delay-300">
              <animateTransform attributeName="transform" type="translate" values="0,0; 200,40; 0,0" dur="20s" repeatCount="indefinite"/>
            </ellipse>
          </svg>
        </div>
        
        {/* Enhanced sparkle effects with more variety */}
        <div className="absolute inset-0">
          <Sparkles className="absolute top-1/4 left-1/3 w-6 h-6 text-white/40 animate-pulse" />
          <Sparkles className="absolute top-2/3 right-1/4 w-4 h-4 text-orange-200/60 animate-pulse delay-500" />
          <Sparkles className="absolute bottom-1/4 left-1/4 w-5 h-5 text-purple-200/50 animate-pulse delay-1000" />
          <Sparkles className="absolute top-1/3 right-1/3 w-3 h-3 text-white/50 animate-pulse delay-700" />
          <Sparkles className="absolute top-3/4 left-2/3 w-4 h-4 text-orange-300/70 animate-pulse delay-300" />
          <Sparkles className="absolute top-1/6 right-1/6 w-5 h-5 text-purple-300/60 animate-pulse delay-1200" />
          {/* Additional tasteful sparkles */}
          <Sparkles className="absolute top-1/2 left-1/6 w-3 h-3 text-white/45 animate-pulse delay-800" />
          <Sparkles className="absolute bottom-1/6 right-2/5 w-4 h-4 text-orange-200/55 animate-pulse delay-1500" />
          <Sparkles className="absolute top-1/8 left-3/5 w-2 h-2 text-purple-200/65 animate-pulse delay-400" />
          <Sparkles className="absolute bottom-2/5 left-4/5 w-3 h-3 text-white/35 animate-pulse delay-1800" />
        </div>

        {/* Floating geometric elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/5 left-1/5 w-6 h-6 border border-white/30 rotate-45 animate-spin" style={{animationDuration: '20s'}}></div>
          <div className="absolute bottom-1/3 right-1/5 w-4 h-4 bg-white/20 rounded-full animate-bounce" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-2/3 left-3/4 w-8 h-1 bg-gradient-to-r from-orange-300/50 to-purple-300/50 animate-pulse delay-800"></div>
        </div>
      </div>
      
      <div className="text-center z-10 max-w-5xl mx-auto animate-fade-in">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-orange-100 to-white bg-clip-text text-transparent drop-shadow-2xl leading-tight px-4">
          Hi, I'm Morgan.
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
          This is just a small taste of what I've accomplished, and a few projects I'm proud of.
        </p>
        
        {/* Social Links - removed Github */}
        <div className="flex justify-center gap-4 mb-12">
          <Button variant="outline" size="icon" className="hover:scale-110 transition-all duration-300 border-white/30 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm">
            <Linkedin className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" className="hover:scale-110 transition-all duration-300 border-white/30 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm">
            <Mail className="h-5 w-5" />
          </Button>
        </div>

        {/* CTA Button */}
        <Button 
          onClick={scrollToProjects}
          size="lg" 
          className="bg-white/20 hover:bg-white/30 text-white px-8 py-6 text-lg rounded-full shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 backdrop-blur-md border border-white/30 hover:border-white/50"
        >
          CONTACT ME
          <ArrowDown className="ml-2 h-5 w-5 animate-bounce" />
        </Button>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-1 h-8 bg-gradient-to-b from-white/60 to-transparent rounded-full"></div>
      </div>
    </section>
  );
};

export default Hero;
