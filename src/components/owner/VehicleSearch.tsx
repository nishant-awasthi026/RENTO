
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Vehicle } from "@/types";
import VehicleList from "./VehicleList";

interface VehicleSearchProps {
  vehicles: Vehicle[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onDeleteVehicle: (id: string) => Promise<void>;
  onToggleAvailability: (id: string) => Promise<void>;
}

const VehicleSearch = ({ 
  vehicles, 
  searchQuery, 
  onSearchChange,
  onDeleteVehicle,
  onToggleAvailability
}: VehicleSearchProps) => {
  return (
    <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <Input
          type="text"
          placeholder="Search by name, brand, or location"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <Tabs defaultValue="all" className="w-full sm:w-auto">
        <TabsList>
          <TabsTrigger value="all">All Vehicles</TabsTrigger>
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="unavailable">Unavailable</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <VehicleList 
            vehicles={vehicles} 
            onDeleteVehicle={onDeleteVehicle}
            onToggleAvailability={onToggleAvailability}
          />
        </TabsContent>
        
        <TabsContent value="available">
          <VehicleList 
            vehicles={vehicles.filter(v => v.availability)} 
            onDeleteVehicle={onDeleteVehicle}
            onToggleAvailability={onToggleAvailability}
          />
        </TabsContent>
        
        <TabsContent value="unavailable">
          <VehicleList 
            vehicles={vehicles.filter(v => !v.availability)} 
            onDeleteVehicle={onDeleteVehicle}
            onToggleAvailability={onToggleAvailability}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VehicleSearch;
