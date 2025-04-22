
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { Booking } from "@/types";
import { bookingAPI } from "@/utils/api";
import { useAuth } from "@/context/AuthContext";

interface UseBookingsProps {
  filter?: string;
  isOwner?: boolean;
  autoRefresh?: boolean;
}

export const useBookings = ({ filter, isOwner = false, autoRefresh = false }: UseBookingsProps = {}) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { token } = useAuth();

  // Create memoized fetchBookings function to prevent unnecessary re-renders
  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!token) {
        console.log("No token available, skipping bookings fetch");
        setBookings([]);
        return [];
      }
      
      console.log("Fetching bookings...");
      const userBookings = await bookingAPI.getUserBookings(filter ? { status: filter } : {});
      console.log("Bookings fetched:", userBookings);
      
      // Ensure we always set an array even if the API returns null or a single object
      const bookingsArray = Array.isArray(userBookings) ? userBookings : userBookings ? [userBookings] : [];
      setBookings(bookingsArray);
      return bookingsArray;
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      setError("Failed to load bookings. Please try again.");
      toast({
        title: "Error",
        description: "Failed to load bookings. Please try again later.",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [filter, toast, token]);

  useEffect(() => {
    if (token) {
      console.log("Token exists, fetching bookings");
      fetchBookings();
    } else {
      console.log("No token available, skipping bookings fetch");
      setBookings([]);
      setLoading(false);
    }
    
    // Set up auto-refresh interval if enabled
    let interval: ReturnType<typeof setInterval>;
    if (autoRefresh && token) {
      interval = setInterval(() => {
        fetchBookings();
      }, 30000); // Refresh every 30 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, token, fetchBookings]);

  useEffect(() => {
    if (filter && filter !== "all") {
      setFilteredBookings(bookings.filter(booking => booking.status === filter));
    } else {
      setFilteredBookings(bookings);
    }
  }, [bookings, filter]);

  const updateBookingStatus = async (id: string, status: 'confirmed' | 'cancelled' | 'completed') => {
    try {
      await bookingAPI.updateBookingStatus(id, status);
      
      // Update local state with the new status
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === id 
            ? { ...booking, status, updatedAt: new Date().toISOString() } 
            : booking
        )
      );
      
      // Show success message
      const statusMessages = {
        confirmed: "Booking confirmed successfully",
        cancelled: "Booking cancelled successfully",
        completed: "Booking marked as completed"
      };
      
      toast({
        title: "Success",
        description: statusMessages[status],
      });
      
      // Refresh bookings to ensure we have the latest data
      fetchBookings();
      
      return true;
    } catch (error) {
      console.error(`Failed to update booking status:`, error);
      toast({
        title: "Error",
        description: "Failed to update booking status. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    bookings: filteredBookings,
    allBookings: bookings,
    loading,
    error,
    refreshBookings: fetchBookings,
    updateBookingStatus
  };
};
