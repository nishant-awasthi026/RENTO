
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BookingManagement from "@/components/owner/BookingManagement";
import { useAuth } from "@/context/AuthContext";

const ManageBookings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "owner") {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Manage Bookings</h1>
      
      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Bookings</TabsTrigger>
          <TabsTrigger value="pending">Pending Requests</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <BookingManagement filter="all" />
        </TabsContent>
        
        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Booking Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <BookingManagement filter="pending" />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="confirmed">
          <Card>
            <CardHeader>
              <CardTitle>Confirmed Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <BookingManagement filter="confirmed" />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Completed Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <BookingManagement filter="completed" />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="cancelled">
          <Card>
            <CardHeader>
              <CardTitle>Cancelled Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <BookingManagement filter="cancelled" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManageBookings;
