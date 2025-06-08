import { ArrowDown, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

const Hero = () => {
  const bgRef1 = useRef<HTMLDivElement>(null);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const offsetY = window.scrollY;
          if (bgRef1.current) {
            bgRef1.current.style.transform = `translateY(${offsetY * 0.2}px)`;
          }
          setHasScrolled(offsetY > window.innerHeight * 0.6);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToProjects = () => {
    const target = document.getElementById('projects');
    if (target) {
      const yOffset = -80;
      const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 pt-20 md:pt-28 lg:pt-36 pb-16 md:pb-24 lg:pb-32 relative bg-gradient-to-br from-orange-400 via-orange-500 to-purple-700 overflow-hidden">
      {/* Parallax SVG Swirl Layer */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          ref={bgRef1}
          className="absolute inset-0 opacity-100 z-0 will-change-transform"
        >
          {/* SVG Swirling Texture Layer */}
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
            <path d="M-200,300 Q50,100 300,300 T800,300 T1200,300 L1200,1000 L-200,1000 Z" fill="url(#swirl1)" className="animate-pulse">
              <animateTransform attributeName="transform" type="translate" values="-100,0; 100,20; -100,0" dur="12s" repeatCount="indefinite"/>
            </path>
            <path d="M-200,600 Q100,400 400,600 T800,600 T1200,600 L1200,1000 L-200,1000 Z" fill="url(#swirl2)" className="animate-pulse delay-500">
              <animateTransform attributeName="transform" type="translate" values="100,0; -100,15; 100,0" dur="15s" repeatCount="indefinite"/>
            </path>
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
      </div>

      {/* Content Centered */}
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center z-10 w-full max-w-screen-md sm:max-w-screen-lg md:max-w-screen-xl mx-auto animate-fade-up px-4 sm:px-6 md:px-10">
          <div className="flex flex-col justify-center items-center min-h-[80vh] space-y-8 md:space-y-10">
            <h1 className="relative z-10 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold font-playfair bg-gradient-to-r from-white via-orange-100 to-white bg-clip-text text-transparent drop-shadow-2xl leading-[1.3] px-4 py-2 overflow-visible animate-fade-up delay-200">
              Hi, I'm Morgan.
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 w-full max-w-3xl leading-relaxed sm:leading-normal md:leading-snug drop-shadow-lg font-source animate-fade-up delay-500 text-balance">
              This is just a small taste of what I've accomplished, and a few projects I'm proud of.
            </p>
            <div className="flex justify-center gap-4 animate-fade-in delay-700">
              <Button variant="outline" size="icon" className="transition-all duration-300 border-white/30 bg-transparent hover:bg-transparent text-white hover:text-purple-900">
                <Linkedin className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" className="transition-all duration-300 border-white/30 bg-transparent hover:bg-transparent text-white hover:text-purple-900">
                <Mail className="h-5 w-5" />
              </Button>
            </div>
            <Button
              onClick={scrollToProjects}
              size="lg"
              className="bg-white/20 hover:bg-white/30 text-white hover:text-purple-900 px-8 py-6 text-lg rounded-full shadow-2xl hover:shadow-3xl transition-all duration-500 backdrop-blur-md border border-white/30 hover:border-white/50 animate-fade-up delay-1000"
            >
              CONTACT ME
              <ArrowDown className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator with fade toggle */}
      {!hasScrolled && (
        <div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer animate-bounce transition-opacity duration-500"
          onClick={scrollToProjects}
          title="Scroll down"
        >
          <div className="w-1 h-8 bg-gradient-to-b from-white/60 to-transparent rounded-full"></div>
        </div>
      )}
    </section>
  );
};

export default Hero;
