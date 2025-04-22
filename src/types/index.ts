
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'renter' | 'owner' | 'admin';
  createdAt: string;
  updatedAt: string;
  
  // Additional properties needed by components
  name?: string;
  phone?: string;
  profileImage?: string;
}

export interface Vehicle {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  category: string;
  description: string;
  pricePerDay: number;
  pricePerWeek: number;
  pricePerMonth: number;
  location: string;
  features: string[];
  specifications: string[] | Record<string, string>; // Updated to allow object form
  image: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  
  // Additional properties needed by components
  images?: string[];
  rating?: number;
  availability?: boolean;
  owner?: User;
}

export interface Booking {
  id: string;
  vehicleId: string;
  renterId: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled' | 'paid' | 'confirmed';
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  paymentStatus?: 'pending' | 'paid' | 'refunded';
  
  // Adding ownerId to match the mock data
  ownerId?: string;
  
  // These properties are populated through API joins
  vehicle?: Vehicle;
  renter?: User;
}

// Add Review interface to support VehicleDetails and other components
export interface Review {
  id: string;
  vehicleId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}
