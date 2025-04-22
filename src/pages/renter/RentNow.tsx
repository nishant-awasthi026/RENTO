
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { vehicleAPI } from "@/utils/api";
import { Vehicle } from "@/types";
import { useToast } from "@/hooks/use-toast";
import BookingForm from "@/components/renter/BookingForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import VehicleDetails from "@/components/vehicle/VehicleDetails";
import { useAuth } from "@/context/AuthContext";

const RentNow = () => {
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Redirect non-renters
    if (user && user.role !== "renter") {
      toast({
        title: "Access Denied",
        description: "Only renters can book vehicles",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    const fetchVehicleDetails = async () => {
      try {
        setLoading(true);
        if (!id) return;
        
        console.log("Fetching vehicle details for ID:", id);
        const vehicleData = await vehicleAPI.getVehicleById(id);
        console.log("Vehicle data received:", vehicleData);
        setVehicle(vehicleData);
      } catch (error) {
        console.error("Failed to fetch vehicle details:", error);
        toast({
          title: "Error",
          description: "Failed to load vehicle details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVehicleDetails();
    }
  }, [id, toast, navigate, user]);

  const handleBookingComplete = () => {
    toast({
      title: "Success",
      description: "Your booking request has been sent to the owner",
    });
    navigate("/renter/bookings");
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="w-full h-64 animate-pulse bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Vehicle Not Found</h2>
        <p className="mb-4">The vehicle you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate("/search")}>Browse Vehicles</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Button 
        variant="ghost" 
        className="mb-4" 
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <VehicleDetails vehicle={vehicle} />
        </div>
        
        <div>
          <BookingForm vehicle={vehicle} onBookingComplete={handleBookingComplete} />
        </div>
      </div>
    </div>
  );
};

export default RentNow;
