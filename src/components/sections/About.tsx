import { SkillCard } from '@/components/shared/SkillCard';
import { skills } from '@/data/skills';

console.log('skills array:', skills);

const About = () => {
  return (
    <section
      id="about"
      className="relative min-h-[60dvh] py-20 px-6 bg-gradient-to-br from-purple-100 via-white to-orange-50 overflow-hidden"
    >
      {/* Static Decorative background */}
      <div
        className="pointer-events-none select-none absolute inset-0 w-full h-full z-0"
        aria-hidden="true"
      >
        <img src="/5594016.jpg" alt="" className="w-full h-full object-cover opacity-10" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-purple-600 to-orange-600 bg-clip-text text-transparent">
            About Me
          </h2>
          <p className="text-lg text-slate-700 max-w-3xl mx-auto leading-relaxed">
            I'm a creative strategist and CRM whisperer with a deep love for systems that make
            stories sing.
            <br />
            I've spent the last 10+ years blending structure with soul: building lifecycle campaigns
            in Salesforce,
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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skill, index) => (
            <div key={skill.title} className="transition-all duration-1000 ease-out">
              <SkillCard skill={skill} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
