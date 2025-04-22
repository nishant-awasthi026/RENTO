import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { Vehicle } from "@/types";
import { vehicleAPI } from "@/utils/api";
import { useAuth } from "@/context/AuthContext";

interface UseVehiclesProps {
  isOwner?: boolean;
  autoRefresh?: boolean;
}

export const useVehicles = ({ isOwner = true, autoRefresh = false }: UseVehiclesProps = {}) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const { token, user } = useAuth();

  // Create memoized fetchVehicles function to prevent unnecessary re-renders
  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Fetching vehicles, isOwner:", isOwner, "token:", token ? "Token exists" : "No token", "user role:", user?.role);
      
      if (!token) {
        console.log("No token available, skipping vehicle fetch");
        setVehicles([]);
        setLoading(false);
        return [];
      }
      
      // Validate user role for owner actions
      if (isOwner && user?.role !== 'owner') {
        console.log("User is not an owner, skipping owner vehicles fetch");
        setVehicles([]);
        setLoading(false);
        return [];
      }
      
      let vehicleList: Vehicle[];
      
      if (isOwner && user?.role === 'owner') {
        console.log("Fetching owner vehicles");
        vehicleList = await vehicleAPI.getOwnerVehicles();
      } else {
        vehicleList = await vehicleAPI.getVehicles();
      }
      
      console.log("Vehicles fetched:", vehicleList);
      
      // Ensure we always set an array even if the API returns null or a single object
      const vehiclesArray = Array.isArray(vehicleList) ? vehicleList : vehicleList ? [vehicleList] : [];
      setVehicles(vehiclesArray);
      return vehiclesArray;
    } catch (error) {
      console.error("Failed to fetch vehicles:", error);
      setError("Failed to load vehicles. Please try again.");
      toast({
        title: "Error",
        description: "Failed to load vehicles. Please try again later.",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [isOwner, toast, token, user]);

  useEffect(() => {
    fetchVehicles();
    
    // Set up auto-refresh interval if enabled
    let interval: ReturnType<typeof setInterval>;
    if (autoRefresh && token) {
      interval = setInterval(() => {
        fetchVehicles();
      }, 30000); // Refresh every 30 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, token, fetchVehicles]);

  const handleDeleteVehicle = async (id: string) => {
    try {
      await vehicleAPI.deleteVehicle(id);
      setVehicles(vehicles.filter((vehicle) => vehicle.id !== id));
      toast({
        title: "Success",
        description: "Vehicle successfully deleted",
      });
    } catch (error) {
      console.error("Failed to delete vehicle:", error);
      toast({
        title: "Error",
        description: "Failed to delete vehicle. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleToggleAvailability = async (id: string) => {
    try {
      const vehicle = vehicles.find((v) => v.id === id);
      if (!vehicle) return;

      const newAvailability = !vehicle.availability;
      await vehicleAPI.toggleAvailability(id, newAvailability);

      setVehicles(
        vehicles.map((v) =>
          v.id === id ? { ...v, availability: newAvailability } : v
        )
      );

      toast({
        title: "Success",
        description: `Vehicle is now ${newAvailability ? "available" : "unavailable"}`,
      });
    } catch (error) {
      console.error("Failed to update vehicle availability:", error);
      toast({
        title: "Error",
        description: "Failed to update vehicle availability. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Filter vehicles based on search query
  const filteredVehicles = vehicles.filter((vehicle) => {
    if (!searchQuery.trim()) return true;
    
    const searchTerms = searchQuery.toLowerCase().trim().split(" ");
    const vehicleText = `${vehicle.name} ${vehicle.brand} ${vehicle.model} ${vehicle.location}`.toLowerCase();
    
    return searchTerms.every(term => vehicleText.includes(term));
  });

  return {
    vehicles: filteredVehicles,
    allVehicles: vehicles,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    handleDeleteVehicle,
    handleToggleAvailability,
    refreshVehicles: fetchVehicles
  };
};
