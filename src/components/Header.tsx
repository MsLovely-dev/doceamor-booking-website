
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, MapPin } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-md shadow-sm z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-500 rounded-full"></div>
            <h1 className="text-2xl font-bold text-green-600">Serenity Spa</h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`transition-colors ${isActive('/') ? 'text-green-600 font-medium' : 'text-gray-700 hover:text-green-600'}`}
            >
              Home
            </Link>
            <Link 
              to="/services" 
              className={`transition-colors ${isActive('/services') ? 'text-green-600 font-medium' : 'text-gray-700 hover:text-green-600'}`}
            >
              Services
            </Link>
            <Link 
              to="/book-now" 
              className={`transition-colors ${isActive('/book-now') ? 'text-green-600 font-medium' : 'text-gray-700 hover:text-green-600'}`}
            >
              Book Now
            </Link>
            <Link 
              to="/contact" 
              className={`transition-colors ${isActive('/contact') ? 'text-green-600 font-medium' : 'text-gray-700 hover:text-green-600'}`}
            >
              Contact
            </Link>
            <Link 
              to="/admin" 
              className={`transition-colors ${isActive('/admin') ? 'text-green-600 font-medium' : 'text-gray-700 hover:text-green-600'}`}
            >
              Admin
            </Link>
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
              <Link 
                to="/" 
                onClick={() => setIsMenuOpen(false)}
                className={`text-left transition-colors px-2 py-1 ${isActive('/') ? 'text-green-600 font-medium' : 'text-gray-700 hover:text-green-600'}`}
              >
                Home
              </Link>
              <Link 
                to="/services" 
                onClick={() => setIsMenuOpen(false)}
                className={`text-left transition-colors px-2 py-1 ${isActive('/services') ? 'text-green-600 font-medium' : 'text-gray-700 hover:text-green-600'}`}
              >
                Services
              </Link>
              <Link 
                to="/book-now" 
                onClick={() => setIsMenuOpen(false)}
                className={`text-left transition-colors px-2 py-1 ${isActive('/book-now') ? 'text-green-600 font-medium' : 'text-gray-700 hover:text-green-600'}`}
              >
                Book Now
              </Link>
              <Link 
                to="/contact" 
                onClick={() => setIsMenuOpen(false)}
                className={`text-left transition-colors px-2 py-1 ${isActive('/contact') ? 'text-green-600 font-medium' : 'text-gray-700 hover:text-green-600'}`}
              >
                Contact
              </Link>
              <Link 
                to="/admin" 
                onClick={() => setIsMenuOpen(false)}
                className={`text-left transition-colors px-2 py-1 ${isActive('/admin') ? 'text-green-600 font-medium' : 'text-gray-700 hover:text-green-600'}`}
              >
                Admin
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
