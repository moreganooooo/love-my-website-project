import { Code, Palette, Rocket, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  const skills = [
    {
      icon: git-compare-arrows,
      title: "Lifecycle Marketing",
      description: "Building customer journeys that convert and retain"
    },
    {
      icon: send,
      title: "Email Marketing",
      description: "Messaging that resonates with every audience"
    },
    {
      icon: layout-dashboard,
      title: "CRM Optimization",
      description: "Turning data into actionable insights and strategies"
    },
    {
      icon: spline-pointer,
      title: "Copywriting  & Design",
      description: "Crafting compelling narratives and visuals"
    }
  ];

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-purple-100 via-white to-orange-50 relative overflow-hidden">
      {/* Background decoration */}
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
            I'm a creative strategist and CRM whisperer with a deep love for systems that make stories sing. I’ve spent the last 10+ years blending structure with soul: building lifecycle campaigns in Salesforce, writing content that actually connects, and designing visual experiences that feel thoughtful from the first touchpoint to the last.
            <br /><br />
            I’ve worked with scrappy startups, mission-driven orgs, and growing SaaS platforms — always bringing a human-first lens to marketing, messaging, and collaboration. Whether I’m crafting an email journey, optimizing a CRM workflow, or designing a pitch deck that doesn’t make people’s eyes glaze over, I care about two things: clarity and resonance.
            <br /><br />
            My work lives at the intersection of strategy, storytelling, and quietly joyful execution. If that sounds like your vibe — let’s talk.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skill, index) => (
            <Card 
              key={skill.title} 
              className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border-0 bg-gradient-to-br from-white via-orange-50/50 to-purple-50/50 backdrop-blur-sm hover:from-orange-50 hover:to-purple-50"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6 text-center">
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-purple-600 rounded-full shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <skill.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-orange-700 to-purple-700 bg-clip-text text-transparent">
                  {skill.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {skill.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;

