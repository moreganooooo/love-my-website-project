
import { ArrowLeft, Calendar, User, Award, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FadeInSection } from '@/components/shared/FadeInSection';
import { Link } from 'react-router-dom';

const SampleProject = () => {
  const projectFeatures = [
    {
      icon: Palette,
      title: "Creative Direction",
      description: "Comprehensive brand strategy and visual identity development",
    },
    {
      icon: Award,
      title: "Award Recognition",
      description: "Featured in design publications and industry showcases",
    },
    {
      icon: User,
      title: "Client Collaboration",
      description: "Close partnership throughout the creative process",
    },
  ];

  const projectGallery = [
    "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1586717791821-3de64ac1f41b?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop",
  ];

  return (
    <div className="min-h-dvh bg-gradient-to-br from-slate-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-100/30 to-purple-100/30"></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <FadeInSection>
            <Link to="/" className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-8 transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
          </FadeInSection>

          <FadeInSection delay={200}>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-purple-600 to-orange-600 bg-clip-text text-transparent">
              TreeRing
              <br />
              Campaign
            </h1>
          </FadeInSection>

          <FadeInSection delay={400}>
            <p className="text-xl text-slate-700 mb-8 max-w-2xl leading-relaxed">
              A comprehensive marketing campaign that brought together storytelling, 
              visual design, and strategic thinking to create meaningful connections 
              in the educational space.
            </p>
          </FadeInSection>

          <FadeInSection delay={600}>
            <div className="flex flex-wrap gap-6 text-sm text-slate-600">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-orange-500" />
                2023 - 2024
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-purple-500" />
                Lead Creative Strategist
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Project Overview */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeInSection>
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-slate-800">
                  The Challenge
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed mb-6">
                  TreeRing needed a fresh approach to connect with educators and 
                  families, moving beyond traditional marketing to create genuine 
                  emotional resonance around memory-making and storytelling.
                </p>
                <p className="text-lg text-slate-600 leading-relaxed">
                  The goal was to position TreeRing not just as a yearbook company, 
                  but as a partner in preserving life's most meaningful moments.
                </p>
              </div>
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop"
                  alt="Creative planning session"
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent rounded-2xl"></div>
              </div>
            </div>
          </FadeInSection>

          {/* Features Grid */}
          <FadeInSection delay={200}>
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {projectFeatures.map((feature, index) => (
                <Card key={feature.title} className="border-0 bg-gradient-to-br from-white to-orange-50/30 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-8 text-center">
                    <feature.icon className="h-12 w-12 mx-auto mb-4 text-orange-600" />
                    <h3 className="text-xl font-bold mb-3 text-slate-800">{feature.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Visual Gallery */}
      <section className="py-16 px-6 bg-gradient-to-r from-orange-50/50 to-purple-50/50">
        <div className="max-w-6xl mx-auto">
          <FadeInSection>
            <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent">
              Visual Journey
            </h2>
          </FadeInSection>

          <FadeInSection delay={200}>
            <div className="grid md:grid-cols-2 gap-6">
              {projectGallery.map((image, index) => (
                <div 
                  key={index} 
                  className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500"
                >
                  <img 
                    src={image} 
                    alt={`Project visual ${index + 1}`}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-orange-600/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              ))}
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <FadeInSection>
            <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent">
              The Impact
            </h2>
            <p className="text-xl text-slate-700 leading-relaxed mb-12">
              The campaign successfully repositioned TreeRing in the market, 
              creating deeper emotional connections with customers and driving 
              significant engagement across all touchpoints.
            </p>
          </FadeInSection>

          <FadeInSection delay={200}>
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-600 mb-2">300%</div>
                <div className="text-slate-600">Engagement Increase</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">85%</div>
                <div className="text-slate-600">Client Satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-600 mb-2">12</div>
                <div className="text-slate-600">Months Duration</div>
              </div>
            </div>
          </FadeInSection>

          <FadeInSection delay={400}>
            <Button asChild size="lg" className="bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300">
              <Link to="/">
                View More Projects
              </Link>
            </Button>
          </FadeInSection>
        </div>
      </section>
    </div>
  );
};

export default SampleProject;
