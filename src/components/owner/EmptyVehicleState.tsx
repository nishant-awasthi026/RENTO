
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyVehicleStateProps {
  searchQuery: string;
}

const EmptyVehicleState = ({ searchQuery }: EmptyVehicleStateProps) => {
  return (
    <div className="text-center py-12 bg-white rounded-lg shadow-sm">
      <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <Search className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900">No vehicles found</h3>
      <p className="mt-2 text-gray-500">
        {searchQuery 
          ? "Try adjusting your search terms" 
          : "You haven't listed any vehicles yet"}
      </p>
      {!searchQuery && (
        <Link to="/owner/vehicles/new">
          <Button className="mt-4 bg-rento-yellow hover:bg-rento-gold text-rento-dark">
            Add Your First Vehicle
          </Button>
        </Link>
      )}
    </div>
  );
};

export default EmptyVehicleState;
