
import { useState } from 'react';
import { Menu, X, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-md shadow-sm z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-500 rounded-full"></div>
            <h1 className="text-2xl font-bold text-green-600">Serenity Spa</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('home')} className="text-gray-700 hover:text-green-600 transition-colors">
              Home
            </button>
            <button onClick={() => scrollToSection('services')} className="text-gray-700 hover:text-green-600 transition-colors">
              Services
            </button>
            <button onClick={() => scrollToSection('booking')} className="text-gray-700 hover:text-green-600 transition-colors">
              Book Now
            </button>
            <button onClick={() => scrollToSection('contact')} className="text-gray-700 hover:text-green-600 transition-colors">
              Contact
            </button>
            <button onClick={() => scrollToSection('admin')} className="text-gray-700 hover:text-green-600 transition-colors">
              Admin
            </button>
          </nav>

          {/* Contact Info */}
          <div className="hidden lg:flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Phone className="w-4 h-4" />
              <span>(555) 123-4567</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>Downtown Wellness Center</span>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t py-4">
            <nav className="flex flex-col space-y-3">
              <button onClick={() => scrollToSection('home')} className="text-left text-gray-700 hover:text-green-600 transition-colors px-2 py-1">
                Home
              </button>
              <button onClick={() => scrollToSection('services')} className="text-left text-gray-700 hover:text-green-600 transition-colors px-2 py-1">
                Services
              </button>
              <button onClick={() => scrollToSection('booking')} className="text-left text-gray-700 hover:text-green-600 transition-colors px-2 py-1">
                Book Now
              </button>
              <button onClick={() => scrollToSection('contact')} className="text-left text-gray-700 hover:text-green-600 transition-colors px-2 py-1">
                Contact
              </button>
              <button onClick={() => scrollToSection('admin')} className="text-left text-gray-700 hover:text-green-600 transition-colors px-2 py-1">
                Admin
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
