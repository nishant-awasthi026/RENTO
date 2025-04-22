
import { Vehicle } from "@/types";
import VehicleItem from "./VehicleItem";

interface VehicleListProps {
  vehicles: Vehicle[];
  onDeleteVehicle: (id: string) => Promise<void>;
  onToggleAvailability: (id: string) => Promise<void>;
}

const VehicleList = ({ vehicles, onDeleteVehicle, onToggleAvailability }: VehicleListProps) => {
  if (!vehicles || vehicles.length === 0) {
    return (
      <div className="text-center py-8 bg-white rounded-lg shadow-sm">
        <p className="text-gray-500">No vehicles found. Add a vehicle to see it here.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {vehicles.map(vehicle => (
        <VehicleItem 
          key={vehicle.id} 
          vehicle={vehicle} 
          onDelete={onDeleteVehicle}
          onToggleAvailability={onToggleAvailability}
        />
      ))}
    </div>
  );
};

export default VehicleList;
