import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, CheckCircle, Clock, XCircle, User, MapPin, Car } from "lucide-react";
import { bookingAPI } from "@/utils/api";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface BookingManagementProps {
  filter?: string;
}

interface Booking {
  id: string;
  vehicleId: string;
  renterId: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  vehicle: {
    name: string;
    brand: string;
    model: string;
    image: string;
  };
  renter: {
    name: string;
    email: string;
  };
}

const BookingManagement = ({ filter = "all" }: BookingManagementProps) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(filter);
  const { toast } = useToast();

  useEffect(() => {
    fetchBookings();
  }, [activeTab]);

  useEffect(() => {
    setActiveTab(filter);
  }, [filter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingAPI.getUserBookings({ status: activeTab === "all" ? undefined : activeTab });
      setBookings(data);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      toast({
        title: "Error",
        description: "Failed to load bookings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId: string, newStatus: 'confirmed' | 'cancelled' | 'completed') => {
    try {
      await bookingAPI.updateBookingStatus(bookingId, newStatus);
      
      setBookings(bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: newStatus } 
          : booking
      ));
      
      toast({
        title: "Success",
        description: `Booking ${newStatus} successfully`,
      });
    } catch (error) {
      console.error(`Failed to update booking status:`, error);
      toast({
        title: "Error",
        description: "Failed to update booking status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMM yyyy");
  };

  const renderBookingStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Pending</Badge>;
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800 border-green-300">Confirmed</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 border-red-300">Cancelled</Badge>;
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const renderPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="border-yellow-300 text-yellow-800">Payment Pending</Badge>;
      case "paid":
        return <Badge variant="outline" className="border-green-300 text-green-800">Paid</Badge>;
      case "refunded":
        return <Badge variant="outline" className="border-blue-300 text-blue-800">Refunded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Booking Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
            
            <div className="mt-4">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="h-32 bg-gray-200 rounded-md"></div>
                    </div>
                  ))}
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No bookings found</h3>
                  <p className="mt-2 text-gray-500">
                    {activeTab === "pending" 
                      ? "You don't have any pending booking requests" 
                      : `You don't have any ${activeTab} bookings`}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div 
                      key={booking.id}
                      className="border rounded-md p-4 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="sm:w-28 h-28 rounded-md overflow-hidden flex-shrink-0">
                          <img 
                            src={booking.vehicle.image || "/placeholder.svg"} 
                            alt={booking.vehicle.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-grow space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{booking.vehicle.name}</h3>
                              <p className="text-sm text-gray-500">
                                {booking.vehicle.brand} {booking.vehicle.model}
                              </p>
                            </div>
                            <div className="flex flex-col gap-2 items-end">
                              {renderBookingStatusBadge(booking.status)}
                              {renderPaymentStatusBadge(booking.paymentStatus)}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                            <div className="flex items-center text-gray-600">
                              <Calendar size={16} className="mr-1 text-gray-400" />
                              <span>
                                {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                              </span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <User size={16} className="mr-1 text-gray-400" />
                              {booking.renter.name}
                            </div>
                            <div className="flex items-center text-gray-600">
                              <MapPin size={16} className="mr-1 text-gray-400" />
                              Local pickup
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center pt-2">
                            <div className="font-medium">
                              Total: ₹{booking.totalAmount}
                            </div>
                            
                            <div className="flex gap-2">
                              {booking.status === "pending" && (
                                <>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="border-red-300 text-red-600 hover:bg-red-50"
                                    onClick={() => handleStatusUpdate(booking.id, "cancelled")}
                                  >
                                    <XCircle size={16} className="mr-1" />
                                    Reject
                                  </Button>
                                  <Button 
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                    onClick={() => handleStatusUpdate(booking.id, "confirmed")}
                                  >
                                    <CheckCircle size={16} className="mr-1" />
                                    Accept
                                  </Button>
                                </>
                              )}
                              
                              {booking.status === "confirmed" && (
                                <Button 
                                  size="sm"
                                  className="bg-blue-600 hover:bg-blue-700 text-white"
                                  onClick={() => handleStatusUpdate(booking.id, "completed")}
                                >
                                  <CheckCircle size={16} className="mr-1" />
                                  Mark as Completed
                                </Button>
                              )}
                              
                              <Button 
                                size="sm" 
                                variant="outline"
                              >
                                <Car size={16} className="mr-1" />
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingManagement;
