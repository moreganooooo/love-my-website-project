import { ExternalLink, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import BackgroundWrapper from '@/components/BackgroundWrapper';

const Projects = () => {
  const projects = [
    {
      title: 'Freelance & Spec Work',
      description:
        'A collection of creative projects showcasing design versatility and client collaboration across various industries.',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&h=300&fit=crop',
      tech: ['Design', 'Branding', 'Print', 'Digital'],
      category: 'Creative Work',
    },
    {
      title: 'TreeRing Campaign Materials',
      description:
        "Comprehensive marketing materials and event coordination for TreeRing's educational initiatives and community outreach.",
      image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=500&h=300&fit=crop',
      tech: ['Event Planning', 'Marketing', 'Design', 'Coordination'],
      category: 'Campaign Management',
    },
    {
      title: 'Brand Identity Systems',
      description:
        'Complete brand identity development including logos, color systems, and brand guidelines for various clients.',
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500&h=300&fit=crop',
      tech: ['Brand Design', 'Logo Design', 'Style Guides', 'Typography'],
      category: 'Branding',
    },
    {
      title: 'Digital Design Portfolio',
      description:
        'Curated collection of digital design work spanning web design, social media, and interactive experiences.',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&h=300&fit=crop',
      tech: ['Web Design', 'Social Media', 'Interactive', 'Digital Art'],
      category: 'Digital Design',
    },
  ];

  return (
    <BackgroundWrapper id="projects" toggleable>
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-purple-600 to-orange-600 bg-clip-text text-transparent">
          Featured Projects
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Here are some of my recent projects that showcase my skills and passion for creating
          exceptional digital experiences.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {projects.map((project, index) => (
          <Card
            key={project.title}
            className="group hover:shadow-2xl transition-all duration-700 hover:-translate-y-4 border-0 overflow-hidden bg-gradient-to-br from-white via-orange-50/30 to-purple-50/30 backdrop-blur-sm hover:from-orange-50/50 hover:to-purple-50/50"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <div className="relative overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-orange-600/50 via-purple-600/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-orange-500/90 to-purple-500/90 text-white rounded-full text-sm font-medium backdrop-blur-sm">
                {project.category}
              </div>
            </div>

            <CardContent className="p-6">
              <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-orange-700 to-purple-700 bg-clip-text text-transparent">
                {project.title}
              </h3>
              <p className="text-slate-600 mb-4 leading-relaxed">{project.description}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {project.tech.map(tech => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-gradient-to-r from-orange-100 to-purple-100 text-orange-700 rounded-full text-sm font-medium shadow-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-orange-200 hover:bg-orange-50 hover:border-orange-300 transition-all duration-300"
                >
                  <Github className="h-4 w-4 mr-2" />
                  Details
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Project
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </BackgroundWrapper>
  );
};

export default Projects;