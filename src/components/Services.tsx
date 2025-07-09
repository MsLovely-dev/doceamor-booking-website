
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Flower, Heart, Zap, Waves, Sun } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Signature Facial",
      duration: "90 minutes",
      price: "$120",
      description: "Rejuvenating facial treatment with organic botanicals and deep cleansing for radiant, glowing skin."
    },
    {
      icon: <Waves className="w-8 h-8" />,
      title: "Swedish Massage",
      duration: "60 minutes", 
      price: "$95",
      description: "Classic full-body massage using long, flowing strokes to promote relaxation and improve circulation."
    },
    {
      icon: <Flower className="w-8 h-8" />,
      title: "Aromatherapy Session",
      duration: "75 minutes",
      price: "$110",
      description: "Therapeutic massage with essential oils tailored to your mood and wellness needs."
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Couples Retreat",
      duration: "120 minutes",
      price: "$280",
      description: "Intimate spa experience for two with side-by-side massages and champagne service."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Deep Tissue Therapy",
      duration: "60 minutes",
      price: "$105",
      description: "Intensive massage targeting muscle tension and chronic pain with focused pressure techniques."
    },
    {
      icon: <Sun className="w-8 h-8" />,
      title: "Hot Stone Massage",
      duration: "90 minutes",
      price: "$135",
      description: "Warm volcanic stones melt away tension while soothing heated oils nourish your skin."
    }
  ];

  return (
    <section id="services" className="py-20 bg-gradient-to-b from-white to-green-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-gray-800 mb-4">
            Our <span className="font-bold text-green-600">Signature Services</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Indulge in our carefully curated treatments designed to restore balance, 
            rejuvenate your spirit, and enhance your natural beauty.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="spa-card group hover:scale-105 transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-4 bg-gradient-to-r from-green-100 to-green-200 rounded-full text-green-600 group-hover:from-green-200 group-hover:to-green-300 transition-all duration-300">
                  {service.icon}
                </div>
                <CardTitle className="text-xl font-semibold text-gray-800">
                  {service.title}
                </CardTitle>
                <CardDescription className="text-green-600 font-medium">
                  {service.duration} • {service.price}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
