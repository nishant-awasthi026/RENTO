import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Camera, Loader2, Plus, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { vehicleAPI } from "@/utils/api";

const categories = [
  { value: "2-wheeler", label: "2 Wheeler" },
  { value: "4-wheeler", label: "4 Wheeler" },
  { value: "6-wheeler", label: "6 Wheeler" },
  { value: "10-wheeler", label: "10 Wheeler" },
  { value: "20-wheeler", label: "20 Wheeler" },
];

interface VehicleFormProps {
  vehicleId?: string;
  isEditing?: boolean;
}

const VehicleForm = ({ vehicleId, isEditing = false }: VehicleFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    category: "4-wheeler",
    description: "",
    pricePerDay: 0,
    pricePerWeek: 0,
    pricePerMonth: 0,
    location: "",
    features: "",
    specifications: ""
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === "" ? 0 : parseInt(value, 10)
    }));
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const vehicleFormData = new FormData();
      
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'features' || key === 'specifications') {
          const strValue = String(value);
          vehicleFormData.append(key, JSON.stringify(strValue.split(',').map(item => item.trim())));
        } else {
          vehicleFormData.append(key, String(value));
        }
      });
      
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput?.files?.[0]) {
        vehicleFormData.append('image', fileInput.files[0]);
      }
      
      if (isEditing && vehicleId) {
        await vehicleAPI.updateVehicle(vehicleId, vehicleFormData);
        toast({
          title: "Success",
          description: "Vehicle updated successfully",
        });
      } else {
        await vehicleAPI.addVehicle(vehicleFormData);
        toast({
          title: "Success",
          description: "Vehicle added successfully",
        });
      }
      
      navigate('/owner/vehicles');
    } catch (error) {
      console.error('Failed to save vehicle:', error);
      toast({
        title: "Error",
        description: "Failed to save vehicle. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{isEditing ? "Edit Vehicle" : "Add New Vehicle"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Vehicle Name*</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Toyota Innova XL"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Vehicle Category*</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => handleSelectChange("category", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="brand">Brand*</Label>
                <Input
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="e.g. Toyota"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="model">Model*</Label>
                <Input
                  id="model"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  placeholder="e.g. Innova"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="year">Year*</Label>
                <Input
                  id="year"
                  name="year"
                  type="number"
                  value={formData.year}
                  onChange={handleNumberChange}
                  min={1990}
                  max={new Date().getFullYear() + 1}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location*</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Mumbai, Maharashtra"
                  required
                />
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label htmlFor="description">Description*</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your vehicle..."
                rows={4}
                required
              />
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="pricePerDay">Daily Rate (₹)*</Label>
                <Input
                  id="pricePerDay"
                  name="pricePerDay"
                  type="number"
                  value={formData.pricePerDay || ""}
                  onChange={handleNumberChange}
                  min={0}
                  placeholder="0"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pricePerWeek">Weekly Rate (₹)</Label>
                <Input
                  id="pricePerWeek"
                  name="pricePerWeek"
                  type="number"
                  value={formData.pricePerWeek || ""}
                  onChange={handleNumberChange}
                  min={0}
                  placeholder="0"
                />
                <p className="text-xs text-gray-500">Leave empty for no weekly discount</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pricePerMonth">Monthly Rate (₹)</Label>
                <Input
                  id="pricePerMonth"
                  name="pricePerMonth"
                  type="number"
                  value={formData.pricePerMonth || ""}
                  onChange={handleNumberChange}
                  min={0}
                  placeholder="0"
                />
                <p className="text-xs text-gray-500">Leave empty for no monthly discount</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="features">Features</Label>
                <Input
                  id="features"
                  name="features"
                  value={formData.features}
                  onChange={handleChange}
                  placeholder="AC, Music System, GPS (comma separated)"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="specifications">Specifications</Label>
                <Input
                  id="specifications"
                  name="specifications"
                  value={formData.specifications}
                  onChange={handleChange}
                  placeholder="Engine, Fuel Type, Transmission (comma separated)"
                />
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label>Vehicle Image*</Label>
              <div className="flex items-center space-x-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center w-full h-48">
                  {imagePreview ? (
                    <div className="relative w-full h-full">
                      <img 
                        src={imagePreview} 
                        alt="Vehicle preview" 
                        className="w-full h-full object-cover rounded-md"
                      />
                      <Button 
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="absolute top-2 right-2"
                        onClick={() => setImagePreview(null)}
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Camera className="h-10 w-10 text-gray-400 mb-2" />
                      <div className="text-sm text-gray-500 text-center">
                        <label htmlFor="image" className="text-rento-yellow hover:underline cursor-pointer font-medium">
                          Click to upload
                        </label>
                        <p>or drag and drop</p>
                        <p className="text-xs mt-1">PNG, JPG up to 5MB</p>
                      </div>
                      <input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        required={!isEditing}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => navigate('/owner/vehicles')}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-rento-yellow hover:bg-rento-gold text-rento-dark"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Update Vehicle' : 'Add Vehicle'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </form>
  );
};

export default VehicleForm;
