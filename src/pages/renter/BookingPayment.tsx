
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PaymentProcessor from "@/components/payment/PaymentProcessor";
import { Booking } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const BookingPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [booking, setBooking] = useState<Booking | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Get booking data from location state
    if (location.state?.booking) {
      setBooking(location.state.booking);
    } else {
      // No booking data, redirect to search page
      toast({
        title: "Error",
        description: "No booking information found. Please try again.",
        variant: "destructive",
      });
      navigate("/search");
    }
  }, [location, navigate, toast]);

  const handlePaymentSuccess = () => {
    toast({
      title: "Payment Successful",
      description: "Your booking has been confirmed.",
    });
    navigate("/renter/bookings");
  };

  const handlePaymentCancel = () => {
    toast({
      description: "Payment cancelled. Your booking is pending until payment.",
    });
    navigate("/renter/bookings");
  };

  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
            <p className="mt-4 text-gray-600">Loading booking details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <PaymentProcessor 
            booking={booking}
            onSuccess={handlePaymentSuccess}
            onCancel={handlePaymentCancel}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookingPayment;
