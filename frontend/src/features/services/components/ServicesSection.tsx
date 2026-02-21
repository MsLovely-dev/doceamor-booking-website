import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchServices, Service } from "@/features/booking/api";

const ServicesSection = () => {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const data = await fetchServices();
        setServices(data);
      } catch (error) {
        toast({ title: "Could not load services", description: (error as Error).message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, [toast]);

  return (
    <section id="services" className="py-20 bg-gradient-to-b from-white to-green-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-gray-800 mb-4">
            Our <span className="font-bold text-green-600">Signature Services</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Services are loaded live from your Django backend.
          </p>
        </div>

        {loading ? (
          <p className="text-center text-gray-600">Loading services...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card key={service.id} className="spa-card group hover:scale-105 transition-all duration-300">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-4 bg-gradient-to-r from-green-100 to-green-200 rounded-full text-green-600">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-800">{service.name}</CardTitle>
                  <CardDescription className="text-green-600 font-medium">
                    {service.duration_minutes} minutes | PHP {service.price}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 leading-relaxed">{service.description || "No description available."}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesSection;

