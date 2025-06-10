import { SkillCard } from '@/components/shared/skillscard';
import { skills } from '@/data/skills';
import { FadeInSection } from '@/components/shared/FadeInSection';
import styles from './About.module.css';

const About = () => {
  return (
    <section id="about" className="relative min-h-[60dvh] py-20 px-6 bg-gradient-to-br from-purple-100 via-white to-orange-50 overflow-hidden">
      {/* Static Decorative background */}
      <div className="pointer-events-none select-none absolute inset-0 w-full h-full z-0" aria-hidden="true">
        <img src="/5594016.jpg" alt="" className="w-full h-full object-cover opacity-10" />
      </div>

      {/* Background Blobs */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-0 w-64 h-64 bg-gradient-to-l from-orange-200/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-gradient-to-r from-purple-200/30 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-purple-600 to-orange-600 bg-clip-text text-transparent">
            About Me
          </h2>
          <p className="text-lg text-slate-700 max-w-3xl mx-auto leading-relaxed">
            I'm a creative strategist and CRM whisperer with a deep love for systems that make stories sing.
            <br />
            I've spent the last 10+ years blending structure with soul: building lifecycle
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
            If that sounds like your vibe — let's talk.
          </p>
        </div>
        
       <FadeInSection threshold={0.2} rootMargin="80px" className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
         {skills.map((skill, index) => (
          <div
            key={skill.title}
            className={`transition-all duration-[1500ms] ease-out ${styles.skillCard} ${styles[`delay-${index}`]}`}
            style={{ 
              transitionDelay: `${(index * 300) + 500}ms`
              // No opacity/transform here!
            }}
          >
            <SkillCard skill={skill} />
          </div>
        ))}
      </FadeInSection>
            </div>
          ))}
        </FadeInSection>
      </div>
    </section>
  );
};

export default About;
