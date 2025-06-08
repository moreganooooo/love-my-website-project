import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Projects from '@/components/sections/Projects';
import Contact from '@/components/sections/Contact';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <About />
      <Projects />
      <Contact />
    </div>
  );
};

export default Index;
