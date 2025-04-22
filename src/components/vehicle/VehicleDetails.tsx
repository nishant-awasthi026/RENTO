
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, CalendarCheck, Info } from "lucide-react";
import { Vehicle } from "@/types";

interface VehicleDetailsProps {
  vehicle: Vehicle;
}

const VehicleDetails = ({ vehicle }: VehicleDetailsProps) => {
  return (
    <div className="space-y-6">
      <div className="relative rounded-lg overflow-hidden h-96">
        <img
          src={vehicle.image || "/placeholder.svg"}
          alt={vehicle.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4">
          <Badge className="bg-rento-yellow text-rento-dark font-medium">
            {vehicle.category}
          </Badge>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <h1 className="text-3xl font-bold">{vehicle.name}</h1>
          <div className="flex items-center bg-yellow-50 px-2 py-1 rounded">
            <Star size={20} className="text-rento-yellow fill-current" />
            <span className="ml-1 font-medium">{vehicle.rating || '4.5'}</span>
          </div>
        </div>
        
        <div className="text-gray-600 flex items-center">
          <MapPin size={18} className="mr-1" />
          <span>{vehicle.location}</span>
        </div>
        
        <div className="flex flex-wrap gap-4 pt-2">
          <div className="bg-gray-50 px-4 py-2 rounded-lg">
            <div className="text-sm text-gray-600">Daily Rate</div>
            <div className="text-xl font-bold">₹{vehicle.pricePerDay}</div>
          </div>
          
          {vehicle.pricePerWeek && (
            <div className="bg-gray-50 px-4 py-2 rounded-lg">
              <div className="text-sm text-gray-600">Weekly Rate</div>
              <div className="text-xl font-bold">₹{vehicle.pricePerWeek}</div>
            </div>
          )}
          
          {vehicle.pricePerMonth && (
            <div className="bg-gray-50 px-4 py-2 rounded-lg">
              <div className="text-sm text-gray-600">Monthly Rate</div>
              <div className="text-xl font-bold">₹{vehicle.pricePerMonth}</div>
            </div>
          )}
        </div>
        
        <div className="pt-4">
          <h2 className="text-xl font-bold mb-2">About This Vehicle</h2>
          <p className="text-gray-700">{vehicle.description}</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-600">Brand</div>
            <div className="font-medium">{vehicle.brand}</div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-600">Model</div>
            <div className="font-medium">{vehicle.model}</div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-600">Year</div>
            <div className="font-medium">{vehicle.year || 'N/A'}</div>
          </div>
        </div>
        
        {vehicle.features && vehicle.features.length > 0 && (
          <div className="pt-2">
            <h2 className="text-xl font-bold mb-2">Features</h2>
            <ul className="grid grid-cols-2 gap-2">
              {vehicle.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Info size={16} className="mr-2 text-blue-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleDetails;
