
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Clock, Car, Wifi } from 'lucide-react';

const Contact = () => {
  const address = '1 Riverside 1, Darangan, Binangonan, 1940 Rizal, Philippines';
  const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(address)}&z=16&output=embed`;
  const mapLinkUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-gray-800 mb-4">
            Visit <span className="font-bold text-[#F1B2B5]">Doce-Amor Wellness Spa</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Visit us at 1 Riverside 1, Darangan, Binangonan, Rizal, Philippines.
            We are here to make your wellness journey as seamless as possible.
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
                <p className="text-gray-700 mb-2">Doce-Amor Wellness Spa</p>
                <p className="text-gray-600">
                  1 Riverside 1, Darangan,<br />
                  Binangonan, 1940 Rizal, Philippines
                </p>
              </CardContent>
            </Card>

            <Card className="spa-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Phone className="w-6 h-6 text-[#F1B2B5]" />
                  Phone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#F1B2B5]" />
                  <span className="text-gray-700">0977 240 4477</span>
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
                    <span>Monday - Thursday</span>
                    <span>11:00 AM - 10:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Friday</span>
                    <span>11:00 AM - 11:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday - Sunday</span>
                    <span>11:00 AM - 11:00 PM</span>
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
                    <Wifi className="w-4 h-4 text-[#F1B2B5]" />
                    <span>Free WiFi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-[#F1B2B5] rounded-full flex-shrink-0"></span>
                    <span>Relaxation Lounge</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Interactive Map */}
          <div className="lg:mt-0">
            <Card className="spa-card h-full">
              <CardContent className="p-0 h-full min-h-[500px]">
                <div className="w-full h-full rounded-lg overflow-hidden">
                  <iframe
                    title="Doce-Amor Wellness Spa Location"
                    src={mapEmbedUrl}
                    className="w-full h-full min-h-[500px] border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>
              </CardContent>
            </Card>
            <p className="mt-3 text-sm text-gray-600">
              Need directions?{' '}
              <a
                href={mapLinkUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[#F1B2B5] hover:text-[#e7a1a5] underline"
              >
                Open in Google Maps
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;


