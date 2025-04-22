
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Calendar,
  Star,
  MapPin,
  Clock,
  User,
  Phone,
  ShieldCheck,
  ArrowRight,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockVehicles, mockReviews } from "@/data/mockData";
import { Vehicle, Review } from "@/types";

const VehicleDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalDays, setTotalDays] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);
  const [favorite, setFavorite] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundVehicle = mockVehicles.find(v => v.id === id);
      if (foundVehicle) {
        setVehicle(foundVehicle);
        
        // Create mock images array if not available
        if (!foundVehicle.images || foundVehicle.images.length === 0) {
          foundVehicle.images = [
            foundVehicle.image,
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80",
          ];
        }
        
        // Set initial total amount
        setTotalAmount(foundVehicle.pricePerDay);
      }
      
      // Get reviews for this vehicle
      const vehicleReviews = mockReviews.filter(r => r.vehicleId === id);
      setReviews(vehicleReviews);
      
      setLoading(false);
    }, 1000);
  }, [id]);

  useEffect(() => {
    // Calculate total days and amount when dates change
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      setTotalDays(diffDays || 1);
      if (vehicle) {
        setTotalAmount(vehicle.pricePerDay * (diffDays || 1));
      }
    }
  }, [startDate, endDate, vehicle]);

  const handlePrevImage = () => {
    if (vehicle?.images) {
      setSelectedImageIndex((prev) => 
        prev === 0 ? vehicle.images!.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = () => {
    if (vehicle?.images) {
      setSelectedImageIndex((prev) => 
        prev === vehicle.images!.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handleBookNow = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to book this vehicle",
        variant: "destructive",
      });
      return;
    }
    
    if (!startDate || !endDate) {
      toast({
        title: "Dates Required",
        description: "Please select start and end dates",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Booking Successful",
      description: "Your booking request has been sent to the owner",
    });
  };

  const toggleFavorite = () => {
    setFavorite(!favorite);
    
    toast({
      title: favorite ? "Removed from favorites" : "Added to favorites",
      description: favorite 
        ? "Vehicle removed from your favorites list" 
        : "Vehicle added to your favorites list",
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: vehicle?.name,
          text: `Check out this ${vehicle?.name} on RENTO!`,
          url: window.location.href,
        })
        .then(() => console.log("Shared successfully"))
        .catch((error) => console.log("Error sharing:", error));
    } else {
      // Fallback
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Vehicle link copied to clipboard",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-60 mb-6"></div>
            <div className="h-64 bg-gray-200 rounded-lg w-full max-w-3xl mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full max-w-3xl mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 max-w-2xl"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Vehicle Not Found</h1>
            <p className="text-gray-600 mb-6">The vehicle you're looking for doesn't exist or has been removed.</p>
            <Link to="/search">
              <Button className="bg-rento-yellow hover:bg-rento-gold text-rento-dark">
                Browse Other Vehicles
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <div className="mb-4 text-sm text-gray-500">
            <Link to="/" className="hover:text-gray-900">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/search" className="hover:text-gray-900">Vehicles</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{vehicle.name}</span>
          </div>
          
          {/* Vehicle Details Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Images and Details */}
            <div className="lg:col-span-2">
              {/* Image Gallery */}
              <div className="mb-6 bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                <div className="relative pb-[56.25%]">
                  <img
                    src={vehicle.images?.[selectedImageIndex] || vehicle.image}
                    alt={vehicle.name}
                    className="absolute h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-between px-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handlePrevImage}
                      className="rounded-full bg-white/80 hover:bg-white text-gray-900"
                    >
                      <ChevronLeft size={20} />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleNextImage}
                      className="rounded-full bg-white/80 hover:bg-white text-gray-900"
                    >
                      <ChevronRight size={20} />
                    </Button>
                  </div>
                </div>
                
                {/* Thumbnail Gallery */}
                {vehicle.images && vehicle.images.length > 1 && (
                  <div className="flex p-2 space-x-2 overflow-x-auto">
                    {vehicle.images.map((image, index) => (
                      <div
                        key={index}
                        className={`relative cursor-pointer w-20 h-16 flex-shrink-0 rounded overflow-hidden ${
                          selectedImageIndex === index ? "ring-2 ring-rento-yellow" : "opacity-60"
                        }`}
                        onClick={() => setSelectedImageIndex(index)}
                      >
                        <img
                          src={image}
                          alt={`${vehicle.name} view ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Vehicle Info */}
              <div className="mb-8 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{vehicle.name}</h1>
                    <div className="flex items-center mt-2 text-gray-600">
                      <MapPin size={18} className="mr-2 text-gray-400" />
                      <span>{vehicle.location}</span>
                    </div>
                  </div>
                  <div className="flex">
                    <Button
                      variant="outline"
                      size="icon"
                      className={`mr-2 ${favorite ? "text-red-500" : "text-gray-400"}`}
                      onClick={toggleFavorite}
                    >
                      <Heart size={20} className={favorite ? "fill-current" : ""} />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-gray-400"
                      onClick={handleShare}
                    >
                      <Share2 size={20} />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center text-rento-yellow">
                    <Star size={20} className="fill-current" />
                    <span className="ml-1 font-medium">{vehicle.rating}</span>
                    <span className="text-gray-500 ml-1">({reviews.length} reviews)</span>
                  </div>
                  <div className="text-gray-600">
                    <span className="bg-gray-100 px-2 py-1 rounded text-sm font-medium">
                      {vehicle.category}
                    </span>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <p className="text-gray-700 mb-6">{vehicle.description}</p>
                
                <Tabs defaultValue="specifications">
                  <TabsList className="w-full">
                    <TabsTrigger value="specifications" className="flex-1">Specifications</TabsTrigger>
                    <TabsTrigger value="features" className="flex-1">Features</TabsTrigger>
                    <TabsTrigger value="reviews" className="flex-1">Reviews</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="specifications" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {vehicle.specifications && Object.entries(vehicle.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between p-2 bg-gray-50 rounded">
                          <span className="text-gray-600">{key}</span>
                          <span className="font-medium text-gray-900">{value}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="features" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {vehicle.features?.map((feature, index) => (
                        <div key={index} className="flex items-center p-2">
                          <ShieldCheck size={18} className="mr-2 text-rento-yellow" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="reviews" className="mt-4">
                    <div className="space-y-4">
                      {reviews.length > 0 ? (
                        reviews.map((review) => (
                          <div key={review.id} className="border-b border-gray-100 pb-4">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center">
                                <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center text-gray-600 mr-3">
                                  <User size={20} />
                                </div>
                                <div>
                                  <div className="font-medium">{review.userName}</div>
                                  <div className="text-sm text-gray-500">{review.date}</div>
                                </div>
                              </div>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    size={16} 
                                    className={`${i < review.rating ? "text-rento-yellow fill-current" : "text-gray-300"}`} 
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="mt-2 text-gray-700">{review.comment}</p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-500">No reviews yet for this vehicle</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
            
            {/* Right Column - Booking Form */}
            <div>
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 sticky top-4">
                <div className="mb-4 pb-4 border-b border-gray-100">
                  <div className="text-2xl font-bold text-gray-900">₹{vehicle.pricePerDay}<span className="text-gray-500 text-base font-normal">/day</span></div>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <div className="relative">
                      <Calendar size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <div className="relative">
                      <Calendar size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={startDate || new Date().toISOString().split('T')[0]}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6 bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between">
                    <div className="text-gray-600">₹{vehicle.pricePerDay} x {totalDays} day{totalDays > 1 ? 's' : ''}</div>
                    <div className="font-medium">₹{vehicle.pricePerDay * totalDays}</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-gray-600">Service fee</div>
                    <div className="font-medium">₹{Math.round(totalAmount * 0.05)}</div>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between text-lg font-bold">
                    <div>Total</div>
                    <div>₹{totalAmount + Math.round(totalAmount * 0.05)}</div>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-rento-yellow hover:bg-rento-gold text-rento-dark font-medium"
                  onClick={handleBookNow}
                >
                  Book Now
                </Button>
                
                <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
                  <ShieldCheck size={16} className="mr-1 text-gray-400" />
                  <span>Secure payment process</span>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="bg-gray-200 rounded-full w-12 h-12 flex items-center justify-center text-gray-600 mr-3">
                      <User size={20} />
                    </div>
                    <div>
                      <div className="font-medium">Owner: {vehicle.ownerId.startsWith("o") ? `Owner ${vehicle.ownerId.substring(1)}` : vehicle.ownerId}</div>
                      <div className="text-sm text-gray-500">Joined 2022</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock size={16} className="mr-2 text-gray-400" />
                    <span className="text-sm text-gray-600">Usually responds within 1 hour</span>
                  </div>
                  
                  {user && (
                    <div className="flex justify-between">
                      <Button variant="outline" className="w-[48%]" disabled={!user}>
                        <Phone size={16} className="mr-2" /> Contact
                      </Button>
                      <Button variant="outline" className="w-[48%]" disabled={!user}>
                        Message <ArrowRight size={16} className="ml-2" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default VehicleDetails;
