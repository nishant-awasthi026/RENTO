
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Check, MapPin, X, Phone, Mail } from "lucide-react";
import { Booking } from "@/types";
import { format } from "date-fns";

interface BookingRequestCardProps {
  booking: Booking;
  onAccept: (id: string) => Promise<boolean>;
  onReject: (id: string) => Promise<boolean>;
}

const BookingRequestCard = ({ booking, onAccept, onReject }: BookingRequestCardProps) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(booking.status);
  
  const handleAccept = async () => {
    setLoading(true);
    const success = await onAccept(booking.id);
    if (success) {
      setStatus("confirmed");
    }
    setLoading(false);
    return success;
  };
  
  const handleReject = async () => {
    setLoading(true);
    const success = await onReject(booking.id);
    if (success) {
      setStatus("cancelled");
    }
    setLoading(false);
    return success;
  };
  
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };
  
  const getStatusBadge = () => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-400 text-yellow-900">Pending</Badge>;
      case "confirmed":
      case "accepted":
        return <Badge className="bg-green-400 text-green-900">Confirmed</Badge>;
      case "cancelled":
      case "rejected":
        return <Badge className="bg-red-400 text-red-900">Cancelled</Badge>;
      case "completed":
        return <Badge className="bg-blue-400 text-blue-900">Completed</Badge>;
      default:
        return <Badge className="bg-yellow-400 text-yellow-900">Pending</Badge>;
    }
  };
  
  return (
    <Card className="bg-white border-0 shadow-sm overflow-hidden">
      <CardContent className="p-0">
        <div className="relative">
          <img 
            src={booking.vehicle?.image || "/placeholder.svg"} 
            alt={booking.vehicle?.name || "Vehicle"} 
            className="w-full h-40 object-cover"
          />
          <div className="absolute top-2 right-2">
            {getStatusBadge()}
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-medium text-lg">{booking.vehicle?.name || "Vehicle"}</h3>
          
          <div className="mt-2 space-y-2 text-sm">
            <div className="flex items-center text-gray-600">
              <Calendar className="mr-2 h-4 w-4 text-gray-400" />
              <span>
                {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
              </span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <MapPin className="mr-2 h-4 w-4 text-gray-400" />
              <span>{booking.vehicle?.location || "Location not specified"}</span>
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t border-gray-100">
            <h4 className="font-medium">Renter Details:</h4>
            
            {booking.renter ? (
              <div className="mt-1 space-y-1 text-sm">
                <div className="font-medium">{booking.renter.name || `${booking.renter.firstName} ${booking.renter.lastName}`}</div>
                <div className="flex items-center text-gray-600">
                  <Mail className="mr-2 h-4 w-4 text-gray-400" />
                  <span>{booking.renter.email}</span>
                </div>
                {booking.renter.phone && (
                  <div className="flex items-center text-gray-600">
                    <Phone className="mr-2 h-4 w-4 text-gray-400" />
                    <span>{booking.renter.phone}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-gray-500">Renter details not available</div>
            )}
          </div>
          
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <div className="font-medium">Total Amount:</div>
              <div className="font-bold text-lg">₹{booking.totalAmount}</div>
            </div>
            
            {(status === "pending") && (
              <div className="mt-4 flex space-x-2">
                <Button 
                  onClick={handleAccept}
                  disabled={loading}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                >
                  <Check className="mr-1 h-4 w-4" />
                  Accept
                </Button>
                
                <Button 
                  onClick={handleReject}
                  disabled={loading}
                  variant="outline"
                  className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
                >
                  <X className="mr-1 h-4 w-4" />
                  Reject
                </Button>
              </div>
            )}
            
            {(status !== "pending") && (
              <div className="mt-4">
                <div className="text-sm text-gray-500">
                  Status updated on {formatDate(booking.updatedAt || new Date().toISOString())}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingRequestCard;
