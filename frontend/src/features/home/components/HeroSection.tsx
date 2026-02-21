
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-[#FFF7F8] to-white"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-[#F1B2B5]/30 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-[#F1B2B5]/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-light text-gray-800 mb-6 leading-tight">
            Welcome to <br />
            <span className="font-bold bg-gradient-to-r from-[#F1B2B5] to-[#F5C5C5] bg-clip-text text-transparent">
              Serenity Spa
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
            Escape the everyday and discover tranquility in our luxurious spa sanctuary. 
            Where wellness meets indulgence, and every moment is designed for your serenity.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              onClick={() => navigate('/book-now')}
              className="spa-button text-lg px-8 py-4"
            >
              Book Your Experience
            </Button>
            <Button 
              variant="outline" 
              className="text-lg px-8 py-4 border-[#F5C5C5] text-[#BEBEBE] hover:bg-[#FFF7F8]"
              onClick={() => navigate('/services')}
            >
              Explore Services
            </Button>
          </div>
        </div>
        
        {/* Floating spa elements */}
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center space-x-4 text-[#F1B2B5]">
            <div className="w-2 h-2 bg-[#F5C5C5] rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-[#F1B2B5] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-[#F5C5C5] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;


