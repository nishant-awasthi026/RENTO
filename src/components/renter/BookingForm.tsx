
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CalendarIcon, Loader2, CreditCard, IndianRupee } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { bookingAPI } from "@/utils/api";
import { Vehicle } from "@/types";
import { useAuth } from "@/context/AuthContext";

interface BookingFormProps {
  vehicle: Vehicle;
  onBookingComplete?: () => void;
}

const BookingForm = ({ vehicle, onBookingComplete }: BookingFormProps) => {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "cash">("upi");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Calculate total days and price
  const calculateTotalDays = () => {
    if (startDate && endDate) {
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays || 1; // Minimum 1 day
    }
    return 0;
  };

  const calculateTotalPrice = () => {
    const days = calculateTotalDays();
    if (days >= 30 && vehicle.pricePerMonth) {
      const months = Math.floor(days / 30);
      const remainingDays = days % 30;
      return (months * vehicle.pricePerMonth) + (remainingDays * vehicle.pricePerDay);
    } else if (days >= 7 && vehicle.pricePerWeek) {
      const weeks = Math.floor(days / 7);
      const remainingDays = days % 7;
      return (weeks * vehicle.pricePerWeek) + (remainingDays * vehicle.pricePerDay);
    }
    return days * vehicle.pricePerDay;
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to book a vehicle",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (!startDate || !endDate) {
      toast({
        title: "Error",
        description: "Please select both start and end dates",
        variant: "destructive",
      });
      return;
    }

    if (startDate > endDate) {
      toast({
        title: "Error",
        description: "End date must be after start date",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Format dates for API
      const formattedStartDate = format(startDate, "yyyy-MM-dd");
      const formattedEndDate = format(endDate, "yyyy-MM-dd");
      
      console.log("Submitting booking with data:", {
        vehicleId: vehicle.id,
        startDate: formattedStartDate,
        endDate: formattedEndDate
      });
      
      const response = await bookingAPI.createBooking({
        vehicleId: vehicle.id,
        startDate: formattedStartDate,
        endDate: formattedEndDate
      });

      console.log("Booking created:", response);
      
      toast({
        title: "Booking Request Sent",
        description: "Your booking request has been sent to the owner",
      });
      
      // Call the callback if provided
      if (onBookingComplete) {
        onBookingComplete();
      }
      
    } catch (error) {
      console.error("Booking failed:", error);
      toast({
        title: "Error",
        description: "Failed to create booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalDays = calculateTotalDays();
  const totalPrice = calculateTotalPrice();

  return (
    <Card className="w-full sticky top-4">
      <CardHeader>
        <CardTitle>Book this Vehicle</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start-date">Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="start-date"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-gray-400"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                  disabled={(date) => date < new Date()}
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="end-date">End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="end-date"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-gray-400"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                  disabled={(date) => 
                    date < new Date() || (startDate ? date < startDate : false)
                  }
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        {totalDays > 0 && (
          <div className="rounded-md bg-gray-50 p-4">
            <div className="font-medium">Booking Summary</div>
            <div className="mt-2 space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Daily Rate:</span>
                <span>₹{vehicle.pricePerDay}</span>
              </div>
              <div className="flex justify-between">
                <span>Duration:</span>
                <span>{totalDays} {totalDays === 1 ? 'day' : 'days'}</span>
              </div>
              {vehicle.pricePerWeek && totalDays >= 7 && (
                <div className="flex justify-between text-green-600">
                  <span>Weekly Discount Applied</span>
                  <span>-₹{(totalDays * vehicle.pricePerDay) - calculateTotalPrice()}</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>₹{totalPrice}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="space-y-3">
          <Label>Payment Method</Label>
          <RadioGroup 
            value={paymentMethod} 
            onValueChange={(value) => setPaymentMethod(value as "upi" | "cash")}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50 cursor-pointer">
              <RadioGroupItem value="upi" id="upi" />
              <Label htmlFor="upi" className="flex-1 cursor-pointer">
                <div className="flex items-center">
                  <CreditCard className="w-5 h-5 text-blue-600 mr-2" />
                  <span>UPI Payment</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Pay using any UPI app like Google Pay, PhonePe, etc.
                </p>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50 cursor-pointer">
              <RadioGroupItem value="cash" id="cash" />
              <Label htmlFor="cash" className="flex-1 cursor-pointer">
                <div className="flex items-center">
                  <IndianRupee className="w-5 h-5 text-green-600 mr-2" />
                  <span>Cash on Delivery</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Pay in cash when you pick up the vehicle
                </p>
              </Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSubmit}
          disabled={!startDate || !endDate || isSubmitting}
          className="w-full bg-rento-yellow hover:bg-rento-gold text-rento-dark"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>Send Booking Request</>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookingForm;
