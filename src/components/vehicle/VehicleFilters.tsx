
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { FilterX } from "lucide-react";

interface FiltersProps {
  onFilterChange: (filters: any) => void;
}

const VehicleFilters = ({ onFilterChange }: FiltersProps) => {
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [categories, setCategories] = useState<string[]>([]);
  const [location, setLocation] = useState("");

  const categoryOptions = [
    { id: "2-wheeler", label: "2-Wheeler" },
    { id: "4-wheeler", label: "4-Wheeler" },
    { id: "6-wheeler", label: "6-Wheeler" },
    { id: "10-wheeler", label: "10-Wheeler" },
    { id: "20-wheeler", label: "20-Wheeler" },
  ];

  const handleCategoryChange = (categoryId: string) => {
    setCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const handleApplyFilters = () => {
    onFilterChange({
      priceRange,
      categories,
      location,
    });
  };

  const handleResetFilters = () => {
    setPriceRange([0, 10000]);
    setCategories([]);
    setLocation("");
    
    onFilterChange({
      priceRange: [0, 10000],
      categories: [],
      location: "",
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-gray-900">Filters</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleResetFilters}
          className="text-gray-500 hover:text-gray-900"
        >
          <FilterX size={16} className="mr-1" />
          Reset
        </Button>
      </div>

      <div className="space-y-6">
        {/* Price Range */}
        <div>
          <Label className="text-sm font-medium text-gray-900 mb-2 block">Price Range (₹/day)</Label>
          <Slider
            defaultValue={priceRange}
            max={10000}
            step={100}
            value={priceRange}
            onValueChange={setPriceRange}
            className="my-4"
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-gray-500">₹{priceRange[0]}</span>
            <span className="text-sm text-gray-500">₹{priceRange[1]}</span>
          </div>
        </div>

        {/* Categories */}
        <div>
          <Label className="text-sm font-medium text-gray-900 mb-2 block">Vehicle Type</Label>
          <div className="space-y-2">
            {categoryOptions.map((category) => (
              <div key={category.id} className="flex items-center">
                <Checkbox
                  id={category.id}
                  checked={categories.includes(category.id)}
                  onCheckedChange={() => handleCategoryChange(category.id)}
                  className="text-rento-yellow focus:ring-rento-yellow"
                />
                <label
                  htmlFor={category.id}
                  className="ml-2 text-sm text-gray-700 cursor-pointer"
                >
                  {category.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Location */}
        <div>
          <Label htmlFor="location" className="text-sm font-medium text-gray-900 mb-2 block">
            Location
          </Label>
          <Input
            id="location"
            placeholder="Enter city, area or landmark"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border-gray-300 focus:border-rento-yellow focus:ring-rento-yellow"
          />
        </div>

        <Button 
          className="w-full mt-4 bg-rento-yellow hover:bg-rento-gold text-rento-dark font-medium"
          onClick={handleApplyFilters}
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default VehicleFilters;
