
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Booking } from "@/types";
import { paymentAPI } from "@/utils/api";
import { CheckCircle, CreditCard, IndianRupee, DollarSign, Smartphone } from "lucide-react";

interface PaymentProcessorProps {
  booking: Booking;
  onSuccess: () => void;
  onCancel: () => void;
}

const PaymentProcessor = ({ booking, onSuccess, onCancel }: PaymentProcessorProps) => {
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "cash">("upi");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handlePaymentSubmit = async () => {
    try {
      setIsProcessing(true);
      
      const paymentData = {
        bookingId: booking.id,
        method: paymentMethod,
        amount: booking.totalAmount
      };
      
      // Start the payment process
      const payment = await paymentAPI.processPayment(paymentData);
      
      // If using UPI, we might get a payment link or QR code
      if (paymentMethod === "upi") {
        // For now, we'll just simulate successful payment after a delay
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      
      // Check payment status (for real implementation)
      // const status = await paymentAPI.getPaymentStatus(booking.id);
      
      setIsSuccess(true);
      toast({
        title: "Payment Successful",
        description: `Your payment of ₹${booking.totalAmount} has been processed successfully.`,
      });
      
      // Wait a bit before redirecting
      setTimeout(() => {
        onSuccess();
      }, 2000);
      
    } catch (error) {
      console.error("Payment processing failed:", error);
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <CardTitle>Payment Successful!</CardTitle>
          <CardDescription>
            Your booking has been confirmed. Thank you for your payment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="font-medium">Amount Paid:</span>
              <span>₹{booking.totalAmount}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Payment Method:</span>
              <span>{paymentMethod === "upi" ? "UPI" : "Cash"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Booking ID:</span>
              <span>{booking.id.slice(-8).toUpperCase()}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full bg-green-600 hover:bg-green-700"
            onClick={onSuccess}
          >
            View Booking Details
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Complete Payment</CardTitle>
        <CardDescription>
          Please choose your preferred payment method
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="font-medium">Booking Summary</h3>
            <div className="mt-2 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Vehicle:</span>
                <span className="font-medium">{booking.vehicle?.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Duration:</span>
                <span className="font-medium">
                  {new Date(booking.startDate).toLocaleDateString()} to {new Date(booking.endDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t">
                <span>Total Amount:</span>
                <span>₹{booking.totalAmount}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-medium">Choose Payment Method</h3>
            <RadioGroup 
              value={paymentMethod} 
              onValueChange={(value) => setPaymentMethod(value as "upi" | "cash")}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50 cursor-pointer">
                <RadioGroupItem value="upi" id="upi" />
                <Label htmlFor="upi" className="flex-1 cursor-pointer">
                  <div className="flex items-center">
                    <Smartphone className="w-5 h-5 text-blue-600 mr-2" />
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
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        <Button 
          className="w-full bg-rento-yellow hover:bg-rento-gold text-black"
          onClick={handlePaymentSubmit}
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : `Pay ₹${booking.totalAmount}`}
        </Button>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={onCancel}
          disabled={isProcessing}
        >
          Cancel
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaymentProcessor;
