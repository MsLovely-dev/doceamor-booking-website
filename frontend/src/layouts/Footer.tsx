import { Heart, MapPin, Phone, Facebook } from "lucide-react";
import { BOOKING_ENABLED } from "@/config/features";

const Footer = () => {
  return (
    <footer className="bg-[#F5C5C5]/35 text-[#5f4e55] py-16 border-t border-[#F5C5C5]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-[#F1B2B5] to-[#F5C5C5] rounded-full"></div>
              <h3 className="text-2xl font-bold">Doce-Amor Wellness Spa</h3>
            </div>
            <p className="text-[#6b5b62] leading-relaxed">
              Your sanctuary for wellness, beauty, and tranquility. Discover the perfect balance of luxury and serenity.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/doceamorspa"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#6b5b62] hover:text-[#F1B2B5] transition-colors"
                aria-label="Visit Doce-Amor Wellness Spa on Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-[#6b5b62]">
              <li><a href="#home" className="hover:text-[#F1B2B5] transition-colors">Home</a></li>
              <li><a href="#services" className="hover:text-[#F1B2B5] transition-colors">Services</a></li>
              {BOOKING_ENABLED ? <li><a href="#booking" className="hover:text-[#F1B2B5] transition-colors">Book Now</a></li> : null}
              <li><a href="#contact" className="hover:text-[#F1B2B5] transition-colors">Contact</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Popular Services</h4>
            <ul className="space-y-2 text-[#6b5b62]">
              <li>Signature Facial</li>
              <li>Swedish Massage</li>
              <li>Aromatherapy Session</li>
              <li>Hot Stone Massage</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact Info</h4>
            <div className="space-y-3 text-[#6b5b62]">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-[#F1B2B5]" />
                <span className="text-sm">1 Riverside 1, Darangan, Binangonan, 1940 Rizal, Philippines</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#F1B2B5]" />
                <span className="text-sm">0977 240 4477</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#F5C5C5] mt-12 pt-8 text-center">
          <p className="text-[#6b5b62] flex items-center justify-center gap-2">
            Made with <Heart className="w-4 h-4 text-[#F1B2B5]" /> for your wellness journey
          </p>
          <p className="text-[#7d6d74] text-sm mt-2">
            Copyright 2024 Doce-Amor Wellness Spa. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
