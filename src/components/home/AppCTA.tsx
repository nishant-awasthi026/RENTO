
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

const AppCTA = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-rento-dark text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Download the RENTO Mobile App
            </h2>
            <p className="text-lg text-white/80 mb-8">
              Get the RENTO app for a seamless experience. Book, manage and track your rentals on the go. Available for iOS and Android devices.
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
              <Button size="lg" className="bg-rento-yellow hover:bg-rento-gold text-rento-dark w-full sm:w-auto">
                Download for iOS
              </Button>
              <Button size="lg" className="bg-[#2c2c2c] text-white w-full sm:w-auto">
                Download for Android
              </Button>             
            </div>
            
            <div className="flex items-center">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-rento-yellow fill-current" />
                ))}
              </div>
              <span className="ml-2 text-sm">4.8/5 from over 10,000 reviews</span>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-rento-yellow to-rento-gold opacity-20 rounded-2xl"></div>
            <div className="relative p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80" 
                alt="RENTO Mobile App" 
                className="rounded-xl shadow-lg mx-auto"
              />
              <div className="absolute -top-4 -right-4 bg-rento-yellow text-rento-dark text-sm font-bold py-2 px-4 rounded-full">
                New Features!
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppCTA;
