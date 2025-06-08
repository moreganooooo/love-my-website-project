import { ArrowDown, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

const Hero = () => {
  const bgRef1 = useRef<HTMLDivElement>(null);
  const bgRef2 = useRef<HTMLDivElement>(null);
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
          if (bgRef2.current) {
            bgRef2.current.style.transform = `translateY(${offsetY * 0.4}px)`;
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
      {/* Parallax Background Layers */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          ref={bgRef1}
          className="absolute inset-0 opacity-100 z-0 will-change-transform"
        >
          {/* Remove or comment out the next line: */}
          {/* <div className="absolute top-0 left-0 w-full h-full bg-red-500"></div> */}
          {/* Optionally, add a subtle gradient or shape here if you want */}
        </div>
        <div
          ref={bgRef2}
          className="absolute inset-0 opacity-80 will-change-transform"
        >
          {/* Layer 2: faster */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-tl from-white/15 to-transparent rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-purple-300/20 to-orange-300/20 rounded-full blur-3xl animate-bounce"></div>
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
