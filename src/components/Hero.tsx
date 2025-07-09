
import { Button } from '@/components/ui/button';

const Hero = () => {
  const scrollToBooking = () => {
    const element = document.getElementById('booking');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-cream-50 to-green-100"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-green-200/30 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-green-300/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-light text-gray-800 mb-6 leading-tight">
            Welcome to <br />
            <span className="font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
              Serenity Spa
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
            Escape the everyday and discover tranquility in our luxurious spa sanctuary. 
            Where wellness meets indulgence, and every moment is designed for your serenity.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              onClick={scrollToBooking}
              className="spa-button text-lg px-8 py-4"
            >
              Book Your Experience
            </Button>
            <Button 
              variant="outline" 
              className="text-lg px-8 py-4 border-green-300 text-green-700 hover:bg-green-50"
              onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Services
            </Button>
          </div>
        </div>
        
        {/* Floating spa elements */}
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center space-x-4 text-green-600">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
