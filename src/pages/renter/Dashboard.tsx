
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { 
  CalendarDays, 
  Car, 
  MessageSquare,
  Search,
  CreditCard,
  Map,
  Clock,
  StarIcon,
  ArrowUpRight,
  Calendar,
  Wallet,
  Receipt,
  TagIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockVehicles, mockBookings } from "@/data/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VehicleCard from "@/components/vehicle/VehicleCard";
import { Vehicle, Booking } from "@/types";

const RenterDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      if (user) {
        // Get bookings for this user
        const userBookings = mockBookings.filter(b => b.renterId === "r1"); // Using r1 for demo
        setBookings(userBookings);
        
        // Get recently viewed vehicles (random selection for demo)
        const randomVehicles = [...mockVehicles]
          .sort(() => 0.5 - Math.random())
          .slice(0, 4);
        setRecentlyViewed(randomVehicles);
      }
      
      setLoading(false);
    }, 1000);
  }, [user]);

  const upcomingBookings = bookings.filter(b => b.status === "confirmed");
  const pastBookings = bookings.filter(b => b.status === "completed");

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-gray-50 p-4">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-60 mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="h-32 bg-gray-200 rounded"></div>
                ))}
              </div>
              <div className="h-64 bg-gray-200 rounded mb-8"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Renter Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {user?.name || "Renter"}</p>
          </div>
          
          {/* Search and Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Find Your Next Ride</h2>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search for vehicles by name, type, or location"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rento-yellow"
                />
              </div>
              <Link to="/search">
                <Button className="w-full md:w-auto bg-rento-yellow hover:bg-rento-gold text-rento-dark">
                  Search Vehicles
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mt-6">
              <Link to="/search?category=2-wheeler" className="flex flex-col items-center justify-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="bg-rento-yellow/10 p-2 rounded-full mb-2">
                  <Car size={24} className="text-rento-yellow" />
                </div>
                <span className="text-sm text-gray-700">2-Wheelers</span>
              </Link>
              <Link to="/search?category=4-wheeler" className="flex flex-col items-center justify-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="bg-rento-yellow/10 p-2 rounded-full mb-2">
                  <Car size={24} className="text-rento-yellow" />
                </div>
                <span className="text-sm text-gray-700">4-Wheelers</span>
              </Link>
              <Link to="/search?category=6-wheeler" className="flex flex-col items-center justify-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="bg-rento-yellow/10 p-2 rounded-full mb-2">
                  <Car size={24} className="text-rento-yellow" />
                </div>
                <span className="text-sm text-gray-700">6-Wheelers</span>
              </Link>
              <Link to="/search?category=10-wheeler" className="flex flex-col items-center justify-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="bg-rento-yellow/10 p-2 rounded-full mb-2">
                  <Car size={24} className="text-rento-yellow" />
                </div>
                <span className="text-sm text-gray-700">10-Wheelers</span>
              </Link>
              <Link to="/search?category=20-wheeler" className="flex flex-col items-center justify-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="bg-rento-yellow/10 p-2 rounded-full mb-2">
                  <Car size={24} className="text-rento-yellow" />
                </div>
                <span className="text-sm text-gray-700">20-Wheelers</span>
              </Link>
              <Link to="/search" className="flex flex-col items-center justify-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="bg-rento-yellow/10 p-2 rounded-full mb-2">
                  <Search size={24} className="text-rento-yellow" />
                </div>
                <span className="text-sm text-gray-700">All Vehicles</span>
              </Link>
            </div>
          </div>
          
          {/* My Bookings */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">My Bookings</h2>
              <Link to="/renter/bookings">
                <Button variant="ghost" size="sm" className="flex items-center text-sm">
                  View all <ArrowUpRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="past">Past</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming">
                {upcomingBookings.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No upcoming bookings</h3>
                    <p className="mt-2 text-gray-500">Start exploring and book your next ride</p>
                    <Link to="/search">
                      <Button className="mt-4 bg-rento-yellow hover:bg-rento-gold text-rento-dark">
                        Find Vehicles
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {upcomingBookings.map(booking => {
                      const vehicle = mockVehicles.find(v => v.id === booking.vehicleId);
                      return (
                        <Card key={booking.id} className="bg-white border-0 shadow-sm">
                          <div className="aspect-[16/9] relative">
                            <img 
                              src={vehicle?.image || "/placeholder.svg"} 
                              alt={vehicle?.name} 
                              className="w-full h-full object-cover rounded-t-lg"
                            />
                            <div className="absolute top-2 right-2">
                              <Badge className="bg-green-500 text-white">Confirmed</Badge>
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-medium text-lg mb-2">{vehicle?.name}</h3>
                            <div className="flex items-center text-sm text-gray-500 mb-2">
                              <CalendarDays size={16} className="mr-2 text-gray-400" />
                              <span>
                                {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                              </span>
                            </div>
                            <div className="flex items-center text-sm text-gray-500 mb-4">
                              <Map size={16} className="mr-2 text-gray-400" />
                              <span>{vehicle?.location}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="font-medium">₹{booking.totalAmount}</div>
                              <Link to={`/renter/bookings/${booking.id}`}>
                                <Button variant="outline" size="sm">View Details</Button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="past">
                {pastBookings.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No past bookings</h3>
                    <p className="mt-2 text-gray-500">Your booking history will appear here</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pastBookings.map(booking => {
                      const vehicle = mockVehicles.find(v => v.id === booking.vehicleId);
                      return (
                        <Card key={booking.id} className="bg-white border-0 shadow-sm">
                          <div className="aspect-[16/9] relative">
                            <img 
                              src={vehicle?.image || "/placeholder.svg"} 
                              alt={vehicle?.name} 
                              className="w-full h-full object-cover rounded-t-lg"
                            />
                            <div className="absolute top-2 right-2">
                              <Badge className="bg-blue-500 text-white">Completed</Badge>
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-medium text-lg mb-2">{vehicle?.name}</h3>
                            <div className="flex items-center text-sm text-gray-500 mb-2">
                              <CalendarDays size={16} className="mr-2 text-gray-400" />
                              <span>
                                {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                              </span>
                            </div>
                            <div className="flex items-center text-sm text-gray-500 mb-4">
                              <Map size={16} className="mr-2 text-gray-400" />
                              <span>{vehicle?.location}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="font-medium">₹{booking.totalAmount}</div>
                              <Button variant="outline" size="sm">
                                <StarIcon size={16} className="mr-1" />
                                Rate & Review
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Recently Viewed Vehicles */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Recently Viewed</h2>
              <Link to="/search">
                <Button variant="ghost" size="sm" className="flex items-center text-sm">
                  View all <ArrowUpRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentlyViewed.map(vehicle => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <CreditCard className="mr-2 h-5 w-5 text-rento-yellow" />
                  Manage Payments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start text-sm">
                  <Wallet size={16} className="mr-2" />
                  Add Payment Method
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm">
                  <Receipt size={16} className="mr-2" />
                  View Receipts
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <TagIcon className="mr-2 h-5 w-5 text-rento-yellow" />
                  Special Offers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-rento-yellow/10 p-3 rounded-lg">
                  <div className="font-medium">Weekend Special: 10% OFF</div>
                  <p className="text-sm text-gray-600 mt-1">Use code WEEKEND10 on your next booking</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <MessageSquare className="mr-2 h-5 w-5 text-rento-yellow" />
                  Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start text-sm">
                  Contact Customer Service
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm">
                  Report an Issue
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RenterDashboard;
