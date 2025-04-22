
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import FeaturedVehicles from "@/components/home/FeaturedVehicles";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import AppCTA from "@/components/home/AppCTA";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <HeroSection />
        
        <div className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto text-center">
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Vehicle Type</h2>
              <p className="text-lg text-gray-600">From compact scooters to heavy-duty trucks, we have it all</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { name: "2-Wheeler", image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=400&q=80" },
                { name: "4-Wheeler", image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=400&q=80" },
                { name: "6-Wheeler", image: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=400&q=80" },
                { name: "10-Wheeler", image: "https://images.unsplash.com/photo-1602244331666-16544efd1b8c?auto=format&fit=crop&w=400&q=80" },
                { name: "20-Wheeler", image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=400&q=80" },
              ].map((category, index) => (
                <Link 
                  key={index} 
                  to={`/search?category=${category.name.toLowerCase()}`}
                  className="relative group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <div className="aspect-[4/3] relative">
                    <img 
                      src={category.image} 
                      alt={category.name} 
                      className="absolute h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <h3 className="text-white font-bold text-lg md:text-xl">{category.name}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="mt-10">
              <Link to="/search">
                <Button className="bg-rento-yellow hover:bg-rento-gold text-rento-dark font-medium px-6">
                  Browse All Vehicles
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        <FeaturedVehicles />
        <HowItWorks />
        <Testimonials />
        <AppCTA />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
