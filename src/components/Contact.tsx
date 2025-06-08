cot
import { Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Contact = () => {
  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      details: "escott.morgan@gmail.com",
      action: "mailto:escott.morgan@gmail.com"
    },
    {
      icon: Phone,
      title: "Phone",
      details: "+1 (716) 352-9050",
      action: "tel:+17163529050"
    },
    {
      icon: MapPin,
      title: "Location",
      details: "Williamsville, NY",
      action: "#"
    }
  ];

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-purple-800 via-purple-700 to-orange-600 text-white relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-tl from-orange-300/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-lg">
            Contact
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto drop-shadow">
            Reach out today — I'd love to hear from you!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold mb-8 text-white">Get In Touch</h3>
            {contactInfo.map((info) => (
              <Card key={info.title} className="bg-white/10 border-white/20 backdrop-blur-md hover:bg-white/20 transition-all duration-500 hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-400 to-purple-500 rounded-full shadow-lg">
                      <info.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{info.title}</h4>
                      <p className="text-white/80">{info.details}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Form */}
          <Card className="bg-white/10 border-white/20 backdrop-blur-md shadow-2xl">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6 text-white">Send a Message</h3>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input 
                    placeholder="Your Name" 
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-orange-300 focus:ring-orange-300/20"
                  />
                  <Input 
                    type="email" 
                    placeholder="Your Email" 
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-orange-300 focus:ring-orange-300/20"
                  />
                </div>
                <Input 
                  placeholder="Subject" 
                  className="bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-orange-300 focus:ring-orange-300/20"
                />
                <Textarea 
                  placeholder="Your Message" 
                  rows={5}
                  className="bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-orange-300 focus:ring-orange-300/20"
                />
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white py-6 text-lg rounded-lg shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105"
                >
                  Submit
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-white/20">
          <p className="text-white/80">
            © 2024 Morgan. Crafted with ❤️ using modern web technologies
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
