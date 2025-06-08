
import { ArrowDown, Linkedin, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

const Hero = () => {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > window.innerHeight * 0.6);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
    <section className="min-h-[90vh] flex items-center justify-center px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 pt-16 md:pt-20 lg:pt-24 pb-12 md:pb-16 lg:pb-20 relative bg-gradient-to-br from-orange-400 via-orange-500 to-purple-700 overflow-hidden">
      {/* Static SVG Background Layer */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-100 z-0">
          {/* SVG Swirling Texture Layer */}
          <svg
            className="absolute inset-0 w-full h-full opacity-60"
            viewBox="0 0 1000 1000"
            preserveAspectRatio="none"
          >
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
            {/* Swooshy wave paths only */}
            <path
              d="M-200,300 Q50,100 300,300 T800,300 T1200,300 L1200,1000 L-200,1000 Z"
              fill="url(#swirl1)"
              className="animate-pulse"
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                values="-100,0; 100,20; -100,0"
                dur="12s"
                repeatCount="indefinite"
              />
            </path>
            <path
              d="M-200,600 Q100,400 400,600 T800,600 T1200,600 L1200,1000 L-200,1000 Z"
              fill="url(#swirl2)"
              className="animate-pulse delay-500"
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                values="100,0; -100,15; 100,0"
                dur="15s"
                repeatCount="indefinite"
              />
            </path>
          </svg>
        </div>
      </div>

      {/* Content Centered */}
      <div className="flex items-center justify-center min-h-[50vh] w-full">
        <div className="text-center z-10 w-full max-w-screen-md sm:max-w-screen-lg md:max-w-screen-xl mx-auto animate-fade-up px-4 sm:px-6 md:px-10">
          <div className="flex flex-col justify-center items-center min-h-[50vh] space-y-8 md:space-y-10">
            <h1 className="relative z-10 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold font-playfair bg-gradient-to-r from-white via-orange-100 to-white bg-clip-text text-transparent drop-shadow-2xl leading-[1.3] px-4 py-2 overflow-visible animate-fade-up delay-200">
              Hi, I'm Morgan.
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 w-full max-w-3xl leading-relaxed sm:leading-normal md:leading-snug drop-shadow-lg font-source animate-fade-up delay-500 text-balance">
              This is just a small taste of what I've accomplished, and a few projects I'm proud of.
            </p>
            <div className="flex justify-center gap-4 animate-fade-in delay-700">
              <Button
                variant="outline"
                size="icon"
                className="transition-all duration-300 border-white/30 bg-transparent hover:bg-transparent text-white hover:text-purple-900"
              >
                <Linkedin className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="transition-all duration-300 border-white/30 bg-transparent hover:bg-transparent text-white hover:text-purple-900"
              >
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
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer animate-bounce transition-opacity duration-250"
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
