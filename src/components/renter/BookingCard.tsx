
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Check, XCircle } from "lucide-react";
import { Booking } from "@/types";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { bookingAPI } from "@/utils/api";

interface BookingCardProps {
  booking: Booking;
}

const BookingCard = ({ booking }: BookingCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(booking.status);
  const { toast } = useToast();

  const cancelBooking = async () => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        setIsLoading(true);
        await bookingAPI.updateBookingStatus(booking.id, "cancelled");
        setStatus("cancelled");
        toast({
          title: "Success",
          description: "Booking cancelled successfully",
        });
      } catch (error) {
        console.error("Failed to cancel booking:", error);
        toast({
          title: "Error",
          description: "Failed to cancel booking. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const renderStatusBadge = () => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>;
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative h-48">
        <img
          src={booking.vehicle?.image || "/placeholder.svg"}
          alt={booking.vehicle?.name || "Vehicle"}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          {renderStatusBadge()}
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="text-lg font-bold mb-1">{booking.vehicle?.name || "Vehicle"}</h3>
        <p className="text-sm text-gray-500 mb-3">
          {booking.vehicle?.brand} {booking.vehicle?.model}
        </p>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
            <span>
              {format(new Date(booking.startDate), "dd MMM yyyy")} - {format(new Date(booking.endDate), "dd MMM yyyy")}
            </span>
          </div>
          
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
            <span>{booking.vehicle?.location || "Location not available"}</span>
          </div>
          
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-gray-500" />
            <span>Booked on {format(new Date(booking.createdAt || new Date()), "dd MMM yyyy")}</span>
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <div className="font-medium">Total Amount:</div>
            <div className="text-lg font-bold">₹{booking.totalAmount}</div>
          </div>
        </div>
        
        {status === "pending" && (
          <div className="mt-4">
            <Button 
              variant="outline" 
              className="w-full border-red-300 text-red-600 hover:bg-red-50"
              onClick={cancelBooking}
              disabled={isLoading}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Cancel Request
            </Button>
          </div>
        )}
        
        {status === "confirmed" && (
          <div className="mt-4">
            <div className="bg-green-50 p-3 rounded-md text-green-800 text-sm flex items-start">
              <Check className="h-5 w-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Booking Confirmed!</p>
                <p className="mt-1">Your booking has been confirmed by the owner.</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingCard;
