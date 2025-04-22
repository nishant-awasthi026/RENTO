import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { 
  CalendarDays, 
  Car, 
  MessageSquare, 
  Bell,
  Star,
  DollarSign,
  Clock,
  ArrowUpRight,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Vehicle, Booking } from "@/types";
import { useBookings } from "@/hooks/useBookings";
import { useVehicles } from "@/hooks/useVehicles";
import { useToast } from "@/hooks/use-toast";

const OwnerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { vehicles, loading: loadingVehicles, refreshVehicles } = useVehicles({ isOwner: true, autoRefresh: true });
  const { allBookings: bookings, loading: loadingBookings, updateBookingStatus, refreshBookings } = useBookings({ isOwner: true, autoRefresh: true });
  const { toast } = useToast();
  
  const [stats, setStats] = useState({
    totalEarnings: 0,
    activeBookings: 0,
    pendingRequests: 0,
    averageRating: 0,
  });

  useEffect(() => {
    // Calculate stats based on actual bookings
    calculateStats(vehicles, bookings);
  }, [vehicles, bookings]);

  const calculateStats = (vehicles: Vehicle[], bookings: Booking[]) => {
    const totalEarnings = bookings
      .filter(b => b.status === "completed" || b.status === "confirmed")
      .reduce((sum, booking) => sum + booking.totalAmount, 0);
      
    const activeBookings = bookings
      .filter(b => b.status === "confirmed")
      .length;
      
    const pendingRequests = bookings
      .filter(b => b.status === "pending")
      .length;
      
    const ratings = vehicles
      .filter(v => v.rating !== undefined)
      .map(v => v.rating || 0);
      
    const averageRating = ratings.length 
      ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
      : 0;
      
    setStats({
      totalEarnings,
      activeBookings,
      pendingRequests,
      averageRating,
    });
  };

  const handleAcceptBooking = async (id: string) => {
    try {
      const success = await updateBookingStatus(id, "confirmed");
      if (success) {
        toast({
          title: "Booking Accepted",
          description: "The booking has been accepted successfully."
        });
        refreshBookings();
      }
    } catch (error) {
      console.error("Failed to accept booking:", error);
      toast({
        title: "Error",
        description: "Failed to accept booking. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeclineBooking = async (id: string) => {
    try {
      const success = await updateBookingStatus(id, "cancelled");
      if (success) {
        toast({
          title: "Booking Declined",
          description: "The booking has been declined successfully."
        });
        refreshBookings();
      }
    } catch (error) {
      console.error("Failed to decline booking:", error);
      toast({
        title: "Error",
        description: "Failed to decline booking. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getBookingStatus = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case "confirmed":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Confirmed</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loadingVehicles || loadingBookings) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-gray-50 p-4">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-60 mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[1, 2, 3, 4].map((item) => (
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
            <h1 className="text-3xl font-bold text-gray-900">Owner Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {user?.name || "Owner"}</p>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="bg-white border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardDescription>Total Earnings</CardDescription>
                <CardTitle className="text-2xl flex items-center">
                  <DollarSign className="mr-1 h-5 w-5 text-green-500" />
                  ₹{stats.totalEarnings.toLocaleString()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">From all confirmed bookings</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardDescription>Active Bookings</CardDescription>
                <CardTitle className="text-2xl flex items-center">
                  <CalendarDays className="mr-1 h-5 w-5 text-blue-500" />
                  {stats.activeBookings}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">Currently ongoing rentals</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardDescription>Pending Requests</CardDescription>
                <CardTitle className="text-2xl flex items-center">
                  <Clock className="mr-1 h-5 w-5 text-yellow-500" />
                  {stats.pendingRequests}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">Awaiting your response</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardDescription>Average Rating</CardDescription>
                <CardTitle className="text-2xl flex items-center">
                  <Star className="mr-1 h-5 w-5 text-rento-yellow fill-current" />
                  {stats.averageRating.toFixed(1)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">Across all your vehicles</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Recent Booking Requests */}
              <Card className="bg-white border-0 shadow-sm mb-8">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle>Recent Booking Requests</CardTitle>
                    <Link to="/owner/bookings">
                      <Button variant="ghost" size="sm" className="flex items-center text-sm">
                        View all <ArrowUpRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  {bookings.filter(b => b.status === "pending").length === 0 ? (
                    <div className="text-center py-8">
                      <Bell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">No pending booking requests</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bookings
                        .filter(b => b.status === "pending")
                        .slice(0, 3) // Show only the first 3
                        .map(booking => {
                          const vehicle = booking.vehicle;
                          return (
                            <div key={booking.id} className="flex justify-between items-start border-b border-gray-100 pb-4">
                              <div className="flex">
                                <div className="relative h-16 w-16 rounded overflow-hidden mr-3 flex-shrink-0">
                                  <img 
                                    src={vehicle?.image || "/placeholder.svg"} 
                                    alt={vehicle?.name} 
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div>
                                  <h4 className="font-medium">{vehicle?.name}</h4>
                                  <p className="text-sm text-gray-500">
                                    {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                                  </p>
                                  <p className="text-sm font-medium mt-1">₹{booking.totalAmount}</p>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="border-green-500 text-green-600 hover:bg-green-50"
                                  onClick={() => handleAcceptBooking(booking.id)}
                                >
                                  <Check size={16} className="mr-1" />
                                  Accept
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="border-red-500 text-red-600 hover:bg-red-50"
                                  onClick={() => handleDeclineBooking(booking.id)}
                                >
                                  <X size={16} className="mr-1" />
                                  Decline
                                </Button>
                              </div>
                            </div>
                          );
                        })
                      }
                      {bookings.filter(b => b.status === "pending").length > 3 && (
                        <div className="text-center pt-2">
                          <Link to="/owner/bookings">
                            <Button variant="link" size="sm" className="text-gray-500">
                              View all {bookings.filter(b => b.status === "pending").length} pending requests
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Confirmed Bookings */}
              <Card className="bg-white border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle>Confirmed Bookings</CardTitle>
                    <Link to="/owner/bookings">
                      <Button variant="ghost" size="sm" className="flex items-center text-sm">
                        View all <ArrowUpRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  {bookings.filter(b => b.status === "confirmed").length === 0 ? (
                    <div className="text-center py-8">
                      <CalendarDays className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">No confirmed bookings</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bookings
                        .filter(b => b.status === "confirmed")
                        .slice(0, 3) // Show only the first 3
                        .map(booking => {
                          const vehicle = booking.vehicle;
                          return (
                            <div key={booking.id} className="flex justify-between items-start border-b border-gray-100 pb-4">
                              <div className="flex">
                                <div className="relative h-16 w-16 rounded overflow-hidden mr-3 flex-shrink-0">
                                  <img 
                                    src={vehicle?.image || "/placeholder.svg"} 
                                    alt={vehicle?.name} 
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div>
                                  <h4 className="font-medium">{vehicle?.name}</h4>
                                  <div className="flex items-center text-sm text-gray-500">
                                    <CalendarDays size={14} className="mr-1" />
                                    {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                                  </div>
                                  <div className="flex justify-between items-center mt-1">
                                    <p className="text-sm font-medium">₹{booking.totalAmount}</p>
                                    {getBookingStatus(booking.status)}
                                  </div>
                                </div>
                              </div>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="whitespace-nowrap"
                                onClick={() => navigate(`/owner/bookings`)}
                              >
                                <MessageSquare size={16} className="mr-1" />
                                View Details
                              </Button>
                            </div>
                          );
                        })
                      }
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div>
              {/* My Vehicles */}
              <Card className="bg-white border-0 shadow-sm mb-8">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle>My Vehicles</CardTitle>
                    <Link to="/owner/vehicles">
                      <Button variant="ghost" size="sm" className="flex items-center text-sm">
                        View all <ArrowUpRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  {vehicles.length === 0 ? (
                    <div className="text-center py-8">
                      <Car className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">No vehicles listed yet</p>
                      <Link to="/owner/vehicles/new">
                        <Button className="mt-4 bg-rento-yellow hover:bg-rento-gold text-rento-dark">
                          Add Vehicle
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {vehicles.slice(0, 3).map(vehicle => (
                        <div key={vehicle.id} className="flex border-b border-gray-100 pb-4">
                          <div className="relative h-16 w-16 rounded overflow-hidden mr-3 flex-shrink-0">
                            <img 
                              src={vehicle.image} 
                              alt={vehicle.name} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-grow">
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium">{vehicle.name}</h4>
                              <Badge 
                                variant="outline" 
                                className={vehicle.availability ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}
                              >
                                {vehicle.availability ? "Available" : "Unavailable"}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500">{vehicle.location}</p>
                            <div className="flex justify-between items-center mt-1">
                              <p className="text-sm font-medium">₹{vehicle.pricePerDay}/day</p>
                              <div className="flex items-center text-rento-yellow">
                                <Star size={14} className="fill-current" />
                                <span className="ml-1 text-xs">{vehicle.rating}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <Link to="/owner/vehicles/new">
                        <Button className="w-full bg-rento-yellow hover:bg-rento-gold text-rento-dark">
                          Add New Vehicle
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Quick Actions */}
              <Card className="bg-white border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link to="/owner/vehicles">
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarDays size={16} className="mr-2" />
                      Manage Vehicles
                    </Button>
                  </Link>
                  <Link to="/owner/bookings">
                    <Button variant="outline" className="w-full justify-start">
                      <DollarSign size={16} className="mr-2" />
                      Manage Bookings
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare size={16} className="mr-2" />
                    Messages
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Bell size={16} className="mr-2" />
                    Notifications
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OwnerDashboard;
