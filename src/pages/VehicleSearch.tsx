import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import VehicleGrid from "@/components/vehicle/VehicleGrid";
import VehicleFilters from "@/components/vehicle/VehicleFilters";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Vehicle } from "@/types";
import { useToast } from "@/hooks/use-toast";

const VehicleSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [loading, setLoading] = useState(true);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const { toast } = useToast();

  // Get initial category from URL
  const initialCategory = searchParams.get("category");

  // Fetch vehicles from API
  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      
      try {
        // Build query string from search params
        const queryParams = new URLSearchParams();
        
        if (searchParams.get("q")) {
          queryParams.set("search", searchParams.get("q") || "");
        }
        
        if (searchParams.get("category")) {
          queryParams.set("category", searchParams.get("category") || "");
        }
        
        if (searchParams.get("minPrice")) {
          queryParams.set("minPrice", searchParams.get("minPrice") || "");
        }
        
        if (searchParams.get("maxPrice")) {
          queryParams.set("maxPrice", searchParams.get("maxPrice") || "");
        }
        
        if (searchParams.get("location")) {
          queryParams.set("location", searchParams.get("location") || "");
        }
        
        const response = await fetch(`http://localhost:5000/api/vehicles?${queryParams.toString()}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch vehicles');
        }
        
        const data = await response.json();
        setVehicles(data);
        setFilteredVehicles(data);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
        toast({
          title: "Error",
          description: "Failed to load vehicles. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchVehicles();
  }, [searchParams, toast]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams(searchParams);
    if (searchQuery) {
      params.set("q", searchQuery);
    } else {
      params.delete("q");
    }
    
    setSearchParams(params);
  };

  const handleFilterChange = (filters: any) => {
    const params = new URLSearchParams(searchParams);
    
    // Update price range
    if (filters.priceRange) {
      params.set("minPrice", filters.priceRange[0].toString());
      params.set("maxPrice", filters.priceRange[1].toString());
    }
    
    // Update categories
    if (filters.categories && filters.categories.length > 0) {
      params.set("category", filters.categories[0]);
    } else {
      params.delete("category");
    }
    
    // Update location
    if (filters.location) {
      params.set("location", filters.location);
    } else {
      params.delete("location");
    }
    
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams({});
    setSearchQuery("");
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const hasActiveFilters = () => {
    return Array.from(searchParams.keys()).length > 0;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Perfect Vehicle</h1>
            <p className="text-gray-600">Browse our collection of vehicles for rent</p>
          </div>
          
          <div className="mb-6">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="Search by name, brand, model, or location"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
              <Button 
                type="submit" 
                className="bg-rento-yellow hover:bg-rento-gold text-rento-dark"
              >
                Search
              </Button>
              <Button
                type="button"
                variant="outline"
                className="lg:hidden"
                onClick={toggleFilters}
              >
                <SlidersHorizontal size={20} />
              </Button>
            </form>
          </div>
          
          {hasActiveFilters() && (
            <div className="flex items-center mb-4 gap-2">
              <div className="text-sm font-medium text-gray-700">Active filters:</div>
              {searchParams.get("q") && (
                <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                  Search: {searchParams.get("q")}
                </div>
              )}
              {searchParams.get("category") && (
                <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                  Category: {searchParams.get("category")}
                </div>
              )}
              {(searchParams.get("minPrice") || searchParams.get("maxPrice")) && (
                <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                  Price: ₹{searchParams.get("minPrice") || "0"} - ₹{searchParams.get("maxPrice") || "10000"}
                </div>
              )}
              {searchParams.get("location") && (
                <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                  Location: {searchParams.get("location")}
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-gray-600 h-7 text-xs flex items-center"
              >
                <X size={14} className="mr-1" /> Clear all
              </Button>
            </div>
          )}
          
          <div className="flex flex-col lg:flex-row gap-6">
            <div 
              className={`lg:w-1/4 lg:block ${showFilters ? 'block' : 'hidden'}`}
            >
              <VehicleFilters onFilterChange={handleFilterChange} />
            </div>
            
            <div className="lg:w-3/4">
              <VehicleGrid vehicles={filteredVehicles} loading={loading} />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default VehicleSearch;
