
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useVehicles } from "@/hooks/useVehicles";
import VehicleSearch from "@/components/owner/VehicleSearch";
import EmptyVehicleState from "@/components/owner/EmptyVehicleState";
import VehicleLoadingSkeleton from "@/components/owner/VehicleLoadingSkeleton";

const OwnerVehicles = () => {
  const { 
    vehicles, 
    loading, 
    searchQuery, 
    setSearchQuery,
    handleDeleteVehicle,
    handleToggleAvailability 
  } = useVehicles();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Vehicles</h1>
              <p className="text-gray-600 mt-1">Manage your vehicle listings</p>
            </div>
            <Link to="/owner/vehicles/new">
              <Button className="bg-rento-yellow hover:bg-rento-gold text-rento-dark">
                <Plus size={16} className="mr-2" />
                Add New Vehicle
              </Button>
            </Link>
          </div>
          
          {loading ? (
            <VehicleLoadingSkeleton />
          ) : (
            <>
              <VehicleSearch 
                vehicles={vehicles}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onDeleteVehicle={handleDeleteVehicle}
                onToggleAvailability={handleToggleAvailability}
              />
              
              {vehicles.length === 0 && (
                <EmptyVehicleState searchQuery={searchQuery} />
              )}
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OwnerVehicles;
