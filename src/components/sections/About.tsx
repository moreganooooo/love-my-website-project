import { useRef, useEffect } from 'react';
// import { SkillCard } from '@/components/SkillCard';
// import { SkillCard } from '@/components/shared/SkillCard';
import { SkillCard } from '@/components/shared/skillscard';
import { skills } from '@/data/skills';
import { FadeInSection } from '@/components/shared/FadeInSection';

const About = () => {
  const bgRefAbout = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const offsetY = window.scrollY;
          if (bgRefAbout.current) {
            bgRefAbout.current.style.transform = `translateY(${offsetY * 0.12}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative min-h-[60vh] py-20 px-6 bg-gradient-to-br from-purple-100 via-white to-orange-50 [overflow:clip] will-change-transform">
      {/* Parallax Decorative background */}
      <div
        ref={bgRefAbout}
        className="pointer-events-none select-none absolute inset-0 w-full h-full z-0 will-change-transform transition-transform"
        aria-hidden="true"
      >
        <img src="/5594016.jpg" alt="" className="w-full h-full object-cover opacity-10" />
      </div>

      {/* Background Blobs */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-0 w-64 h-64 bg-gradient-to-l from-orange-200/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-gradient-to-r from-purple-200/30 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <FadeInSection repeat>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-purple-600 to-orange-600 bg-clip-text text-transparent">
              About Me
            </h2>
          </FadeInSection>
          <FadeInSection delay={200} repeat>
            <p className="text-lg text-slate-700 max-w-3xl mx-auto leading-relaxed">
              I'm a creative strategist and CRM whisperer with a deep love for systems that make
              stories sing.
              <br />
              I’ve spent the last 10+ years blending structure with soul: building lifecycle
              campaigns in Salesforce,
              <br />
              writing content that connects, and designing visual experiences that feel thoughtful
              <br />
              from the first touchpoint to the last.
              <br />
              <br />
              My work lives at the intersection of strategy, storytelling, and quietly joyful
              execution.
              <br />
              If that sounds like your vibe — let’s talk.
            </p>
          </FadeInSection>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skill, index) => (
            <FadeInSection key={skill.title} delay={400 + index * 250} repeat>
              <SkillCard skill={skill} index={index} />
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
