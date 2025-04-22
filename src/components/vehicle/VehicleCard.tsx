
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Vehicle } from "@/types";

interface VehicleCardProps {
  vehicle: Vehicle;
}

const VehicleCard = ({ vehicle }: VehicleCardProps) => {
  return (
    <div className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 bg-white border border-gray-200">
      <div className="relative pb-[56.25%]">
        <img
          src={vehicle.image || "/placeholder.svg"}
          alt={vehicle.name}
          className="absolute h-full w-full object-cover"
        />
        <div className="absolute top-0 right-0 p-2">
          <Badge className="bg-rento-yellow text-rento-dark font-medium">
            {vehicle.category}
          </Badge>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 truncate">{vehicle.name}</h3>
          <div className="flex items-center text-rento-yellow">
            <Star size={16} className="fill-current" />
            <span className="ml-1 text-sm font-medium">{vehicle.rating}</span>
          </div>
        </div>
        
        <p className="text-gray-500 text-sm mb-2 line-clamp-2">{vehicle.description}</p>
        
        <div className="flex justify-between items-center pt-2 border-t border-gray-100 mt-2">
          <div className="text-lg font-bold text-gray-900">₹{vehicle.pricePerDay}<span className="text-gray-500 text-sm font-normal">/day</span></div>
          <Link to={`/rent/${vehicle.id}`}>
            <Button size="sm" className="bg-rento-yellow hover:bg-rento-gold text-rento-dark">
              Rent Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
