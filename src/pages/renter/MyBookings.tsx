
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { useBookings } from "@/hooks/useBookings";
import BookingCard from "@/components/renter/BookingCard";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, Search } from "lucide-react";

const MyBookings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { bookings, loading, error, refreshBookings } = useBookings({ 
    isOwner: false,
    autoRefresh: true
  });

  useEffect(() => {
    if (!user || user.role !== "renter") {
      navigate("/login");
    }
  }, [user, navigate]);

  const pendingBookings = bookings.filter(booking => booking.status === "pending");
  const confirmedBookings = bookings.filter(booking => booking.status === "confirmed");
  const completedBookings = bookings.filter(booking => booking.status === "completed");
  const cancelledBookings = bookings.filter(booking => booking.status === "cancelled");

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        <p className="mt-2">Loading your bookings...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
      
      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Bookings</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          {bookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-10 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium">No Bookings Found</h3>
                <p className="mt-2 text-gray-500 mb-6">You haven't made any bookings yet.</p>
                <Button
                  onClick={() => navigate("/search")}
                  className="bg-rento-yellow hover:bg-rento-gold text-rento-dark"
                >
                  <Search className="mr-2 h-4 w-4" />
                  Find Vehicles
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingBookings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pendingBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p>No pending bookings</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="confirmed">
          <Card>
            <CardHeader>
              <CardTitle>Confirmed Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              {confirmedBookings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {confirmedBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p>No confirmed bookings</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Completed Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              {completedBookings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {completedBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p>No completed bookings</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="cancelled">
          <Card>
            <CardHeader>
              <CardTitle>Cancelled Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              {cancelledBookings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cancelledBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p>No cancelled bookings</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyBookings;
