
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Mail, Clock, Car, Wifi } from 'lucide-react';

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-gray-800 mb-4">
            Visit <span className="font-bold text-[#F1B2B5]">Serenity Spa</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Located in the heart of downtown, our tranquil oasis awaits you. 
            We're here to make your wellness journey as seamless as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="spa-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <MapPin className="w-6 h-6 text-[#F1B2B5]" />
                  Location & Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-2">Downtown Wellness Center</p>
                <p className="text-gray-600">
                  123 Serenity Boulevard, Suite 200<br />
                  Wellness District, City 12345
                </p>
              </CardContent>
            </Card>

            <Card className="spa-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Phone className="w-6 h-6 text-[#F1B2B5]" />
                  Phone & Email
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#F1B2B5]" />
                  <span className="text-gray-700">(555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#F1B2B5]" />
                  <span className="text-gray-700">info@serenityspa.com</span>
                </div>
              </CardContent>
            </Card>

            <Card className="spa-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Clock className="w-6 h-6 text-[#F1B2B5]" />
                  Hours of Operation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-gray-700">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>9:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>8:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>10:00 AM - 5:00 PM</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="spa-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Car className="w-6 h-6 text-[#F1B2B5]" />
                  Amenities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-[#F1B2B5]" />
                    <span>Free Parking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-[#F1B2B5]" />
                    <span>Free WiFi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-[#F1B2B5] rounded-full flex-shrink-0"></span>
                    <span>Relaxation Lounge</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-[#F1B2B5] rounded-full flex-shrink-0"></span>
                    <span>Refreshment Bar</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Map Placeholder */}
          <div className="lg:mt-0">
            <Card className="spa-card h-full">
              <CardContent className="p-0 h-full min-h-[500px]">
                <div className="w-full h-full bg-gradient-to-br from-[#F5C5C5] to-[#D2D2D2] rounded-lg flex items-center justify-center">
                  <div className="text-center text-[#BEBEBE]">
                    <MapPin className="w-16 h-16 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Interactive Map</h3>
                    <p className="text-[#F1B2B5]">
                      Detailed directions and location map<br />
                      would be integrated here
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;


