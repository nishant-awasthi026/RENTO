/**
 * Centralized API configuration and utility functions
 */

// API base URL - update this if your server runs on a different port or host
export const API_BASE_URL = 'http://localhost:5000/api';

// Helper function for making authenticated API requests
export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('rento-token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  try {
    console.log(`Making request to ${endpoint} with token:`, token ? "Token present" : "No token");
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    // Handle non-2xx responses
    console.log(`API response for ${endpoint} - status:`, response.status);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`API error (${response.status}): ${errorData.error || response.statusText}`);
      throw new Error(errorData.error || `API error: ${response.status}`);
    }

    const data = await response.json();
    console.log(`API response data for ${endpoint}:`, data);
    return data;
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
}

// Vehicle Management APIs
export const vehicleAPI = {
  // Get all vehicles (public)
  getVehicles: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, String(value));
    });
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return fetchWithAuth(`/vehicles${queryString}`, { method: 'GET' });
  },
  
  // Get owner's vehicles
  getOwnerVehicles: async () => {
    console.log("getOwnerVehicles called");
    try {
      // Log the token status before making the request
      const token = localStorage.getItem('rento-token');
      console.log("Token status for getOwnerVehicles:", token ? "Present" : "Missing");
      
      const response = await fetchWithAuth('/vehicles/owner', { method: 'GET' });
      console.log("Owner vehicles response:", response);
      
      // Handle empty or null responses
      if (!response) {
        console.warn("API returned null/undefined for owner vehicles");
        return [];
      }
      
      // Handle non-array responses
      if (!Array.isArray(response)) {
        console.warn("API returned non-array for owner vehicles:", response);
        return Array.isArray(response) ? response : [response].filter(Boolean);
      }
      
      return response;
    } catch (error) {
      console.error("Error fetching owner vehicles:", error);
      throw error;
    }
  },
  
  // Get single vehicle by ID
  getVehicleById: async (id: string) => {
    return fetchWithAuth(`/vehicles/${id}`, { method: 'GET' });
  },
  
  // Add vehicle (owner only)
  addVehicle: async (vehicleData: FormData) => {
    const token = localStorage.getItem('rento-token');
    
    try {
      const response = await fetch(`${API_BASE_URL}/vehicles`, {
        method: 'POST',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          // NOTE: Don't set Content-Type with FormData
        },
        body: vehicleData
      });
      
      console.log("addVehicle response:", response);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to add vehicle:', error);
      throw error;
    }
  },
  
  // Update vehicle (owner only)
  updateVehicle: async (id: string, vehicleData: FormData) => {
    const token = localStorage.getItem('rento-token');
    
    try {
      const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
        method: 'PUT',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: vehicleData
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Failed to update vehicle ${id}:`, error);
      throw error;
    }
  },
  
  // Toggle vehicle availability (owner only)
  toggleAvailability: async (id: string, availability: boolean) => {
    return fetchWithAuth(`/vehicles/${id}/availability`, {
      method: 'PATCH',
      body: JSON.stringify({ availability })
    });
  },
  
  // Delete vehicle (owner only)
  deleteVehicle: async (id: string) => {
    return fetchWithAuth(`/vehicles/${id}`, { method: 'DELETE' });
  }
};

// Booking Management APIs
export const bookingAPI = {
  // Create new booking (renter only)
  createBooking: async (bookingData: {
    vehicleId: string;
    startDate: string;
    endDate: string;
  }) => {
    try {
      console.log("Creating booking with data:", bookingData);
      const token = localStorage.getItem('rento-token');
      console.log("Token status for createBooking:", token ? "Present" : "Missing");
      
      const response = await fetchWithAuth('/bookings', {
        method: 'POST',
        body: JSON.stringify(bookingData)
      });
      console.log("Booking created successfully:", response);
      return response;
    } catch (error) {
      console.error("Failed to create booking:", error);
      throw error;
    }
  },
  
  // Get user's bookings (both owner and renter)
  getUserBookings: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, String(value));
    });
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    try {
      const bookings = await fetchWithAuth(`/bookings${queryString}`, { method: 'GET' });
      
      // Format bookings to include vehicle and renter objects
      console.log("Raw bookings data:", bookings);
      
      return bookings.map((booking: any) => ({
        ...booking,
        vehicle: booking.vehicle || { 
          name: "Unknown Vehicle",
          brand: "",
          model: "",
          location: "Unknown location",
          image: "/placeholder.svg"
        },
        renter: booking.renter || { 
          name: "Unknown Renter",
          email: "unknown@example.com"
        },
        updatedAt: booking.updatedAt || null
      }));
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      throw error;
    }
  },
  
  // Update booking status (accept/reject/cancel)
  updateBookingStatus: async (id: string, status: 'confirmed' | 'cancelled' | 'completed') => {
    try {
      const response = await fetchWithAuth(`/bookings/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
      console.log(`Booking ${id} status updated to ${status}:`, response);
      return response;
    } catch (error) {
      console.error(`Failed to update booking status for ${id}:`, error);
      throw error;
    }
  }
};

// User Management APIs
export const userAPI = {
  // Register a new user
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    role: 'owner' | 'renter';
  }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Registration failed: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },
  
  // Login user
  login: async (credentials: { email: string; password: string }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Login failed: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },
  
  // Upload KYC documents (renter only)
  uploadDocument: async (documentData: FormData) => {
    const token = localStorage.getItem('rento-token');
    
    try {
      const response = await fetch(`${API_BASE_URL}/renters/documents`, {
        method: 'POST',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: documentData
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Document upload failed: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Document upload failed:', error);
      throw error;
    }
  }
};

// Payment APIs
export const paymentAPI = {
  // Process payment for booking
  processPayment: async (paymentData: {
    bookingId: string;
    method: 'upi' | 'cash';
    amount: number;
  }) => {
    try {
      const response = await fetchWithAuth('/payments', {
        method: 'POST',
        body: JSON.stringify(paymentData)
      });
      console.log("Payment processed successfully:", response);
      return response;
    } catch (error) {
      console.error("Failed to process payment:", error);
      throw error;
    }
  },
  
  // Get payment status
  getPaymentStatus: async (bookingId: string) => {
    try {
      const response = await fetchWithAuth(`/payments/status/${bookingId}`, { method: 'GET' });
      console.log(`Payment status for booking ${bookingId}:`, response);
      return response;
    } catch (error) {
      console.error(`Failed to get payment status for booking ${bookingId}:`, error);
      throw error;
    }
  },
  
  // Generate UPI payment link
  generateUpiLink: async (paymentData: {
    bookingId: string;
    amount: number;
    description: string;
  }) => {
    try {
      const response = await fetchWithAuth('/payments/upi/generate', {
        method: 'POST',
        body: JSON.stringify(paymentData)
      });
      console.log("UPI payment link generated:", response);
      return response;
    } catch (error) {
      console.error("Failed to generate UPI payment link:", error);
      throw error;
    }
  },
  
  // Verify UPI payment
  verifyUpiPayment: async (paymentId: string) => {
    try {
      const response = await fetchWithAuth(`/payments/upi/verify/${paymentId}`, { method: 'GET' });
      console.log(`UPI payment ${paymentId} verification:`, response);
      return response;
    } catch (error) {
      console.error(`Failed to verify UPI payment ${paymentId}:`, error);
      throw error;
    }
  }
};
