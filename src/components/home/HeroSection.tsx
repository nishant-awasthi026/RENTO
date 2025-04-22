
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <div className="relative bg-rento-dark min-h-[70vh] flex items-center overflow-hidden">
      <div 
        className="absolute inset-0 opacity-40 bg-cover bg-center" 
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=1920&q=80')"
        }}
      />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            <span className="block">RENTO RIDE RETURN</span>
            <span className="block text-rento-yellow">Vehicle Rentals Made Easy</span>
          </h1>
          <p className="text-xl text-white/80 mb-8">
            Rent any vehicle from 2-wheelers to 20-wheelers. The most trusted vehicle rental platform for all your needs.
          </p>
          
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/search">
              <Button size="lg" className="bg-rento-yellow hover:bg-rento-gold text-rento-dark w-full sm:w-auto">
                <Search className="mr-2 h-5 w-5" />
                Find Vehicles
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg" className="bg-[#2c2c2c] text-white w-full sm:w-auto">
                Register Now
              </Button>
            </Link>
          </div>
          
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <div className="text-3xl font-bold text-rento-yellow">1000+</div>
              <div className="text-white text-sm">Vehicles</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <div className="text-3xl font-bold text-rento-yellow">500+</div>
              <div className="text-white text-sm">Cities</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <div className="text-3xl font-bold text-rento-yellow">10K+</div>
              <div className="text-white text-sm">Happy Users</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <div className="text-3xl font-bold text-rento-yellow">4.8</div>
              <div className="text-white text-sm">Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
