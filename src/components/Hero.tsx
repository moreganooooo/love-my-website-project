
import { ArrowDown, Github, Linkedin, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden bg-gradient-to-br from-orange-400 via-orange-500 to-purple-700">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Flowing organic shapes */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-tl from-white/15 to-transparent rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-purple-300/20 to-orange-300/20 rounded-full blur-3xl animate-bounce"></div>
        </div>
        
        {/* Sparkle effects */}
        <div className="absolute inset-0">
          <Sparkles className="absolute top-1/4 left-1/3 w-6 h-6 text-white/40 animate-pulse" />
          <Sparkles className="absolute top-2/3 right-1/4 w-4 h-4 text-orange-200/60 animate-pulse delay-500" />
          <Sparkles className="absolute bottom-1/4 left-1/4 w-5 h-5 text-purple-200/50 animate-pulse delay-1000" />
          <Sparkles className="absolute top-1/3 right-1/3 w-3 h-3 text-white/50 animate-pulse delay-700" />
        </div>
      </div>
      
      <div className="text-center z-10 max-w-4xl mx-auto animate-fade-in">
        <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-orange-100 to-white bg-clip-text text-transparent drop-shadow-2xl">
          Hi, I'm Morgan.
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
          This is just a small taste of what I've accomplished, and a few projects I'm proud of.
        </p>
        
        {/* Social Links */}
        <div className="flex justify-center gap-4 mb-12">
          <Button variant="outline" size="icon" className="hover:scale-110 transition-all duration-300 border-white/30 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm">
            <Github className="h-5 w-5" />
          </Button>
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
