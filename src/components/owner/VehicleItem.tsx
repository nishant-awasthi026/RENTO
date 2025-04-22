
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Star,
  PenLine,
  Trash2,
  X,
  Check,
  Upload,
  Calendar,
  DollarSign,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Vehicle } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface VehicleItemProps {
  vehicle: Vehicle;
  onDelete: (id: string) => Promise<void>;
  onToggleAvailability: (id: string) => Promise<void>;
}

const VehicleItem = ({ vehicle, onDelete, onToggleAvailability }: VehicleItemProps) => {
  return (
    <div 
      key={vehicle.id} 
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col sm:flex-row gap-4"
    >
      <div className="relative sm:w-40 h-32 rounded-md overflow-hidden flex-shrink-0">
        <img 
          src={vehicle.image || "/placeholder.svg"} 
          alt={vehicle.name} 
          className="h-full w-full object-cover"
        />
        <div className="absolute top-2 left-2">
          <Badge 
            variant="outline" 
            className={vehicle.availability 
              ? "bg-green-50 text-green-700 border-green-200" 
              : "bg-red-50 text-red-700 border-red-200"
            }
          >
            {vehicle.availability ? "Available" : "Unavailable"}
          </Badge>
        </div>
      </div>
      
      <div className="flex-grow">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-lg text-gray-900">{vehicle.name}</h3>
            <p className="text-sm text-gray-500">
              {vehicle.brand} {vehicle.model} • {vehicle.year} • {vehicle.category}
            </p>
          </div>
          <div className="flex items-center text-rento-yellow">
            <Star size={16} className="fill-current" />
            <span className="ml-1 text-sm font-medium">{vehicle.rating || 0}</span>
          </div>
        </div>
        
        <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
          <div className="flex items-center text-gray-600">
            <MapPin size={16} className="mr-1 text-gray-400" />
            {vehicle.location}
          </div>
          <div className="flex items-center text-gray-600">
            <DollarSign size={16} className="mr-1 text-gray-400" />
            ₹{vehicle.pricePerDay}/day
          </div>
          <div className="flex items-center text-gray-600">
            <Calendar size={16} className="mr-1 text-gray-400" />
            {vehicle.createdAt 
              ? new Date(vehicle.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
              : 'No date'
            }
          </div>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onToggleAvailability(vehicle.id)}
            className={vehicle.availability ? "border-red-500 text-red-600" : "border-green-500 text-green-600"}
          >
            {vehicle.availability ? (
              <>
                <X size={14} className="mr-1" />
                Mark Unavailable
              </>
            ) : (
              <>
                <Check size={14} className="mr-1" />
                Mark Available
              </>
            )}
          </Button>
          <Link to={`/owner/vehicles/${vehicle.id}/edit`}>
            <Button variant="outline" size="sm">
              <PenLine size={14} className="mr-1" />
              Edit
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onDelete(vehicle.id)}
            className="border-red-500 text-red-600"
          >
            <Trash2 size={14} className="mr-1" />
            Delete
          </Button>
          <Button variant="outline" size="sm">
            <Upload size={14} className="mr-1" />
            Update Photos
          </Button>
          <Link to={`/owner/vehicles/${vehicle.id}/calendar`}>
            <Button variant="outline" size="sm">
              <Calendar size={14} className="mr-1" />
              Manage Availability
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VehicleItem;
