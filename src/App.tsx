
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from './context/AuthContext';
import Index from './pages/Index';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import NotFound from './pages/NotFound';
import VehicleSearch from './pages/VehicleSearch';
import VehicleDetails from './pages/VehicleDetails';
import RenterDashboard from './pages/renter/Dashboard';
import MyBookings from './pages/renter/MyBookings';
import BookingPayment from './pages/renter/BookingPayment';
import OwnerDashboard from './pages/owner/Dashboard';
import OwnerVehicles from './pages/owner/Vehicles';
import AddVehicle from './pages/owner/AddVehicle';
import ManageBookings from './pages/owner/ManageBookings';
import RentNow from './pages/renter/RentNow';
import { Route, Routes } from 'react-router-dom';

function App() { 
    return ( 
        <AuthProvider> 
            <Routes> 
                {/* Public Routes */} 
                <Route path="/" element={<Index />} /> 
                <Route path="/login" element={<Login />} /> 
                <Route path="/register" element={<Register />} /> 
                <Route path="/search" element={<VehicleSearch />} /> 
                <Route path="/vehicle/:id" element={<VehicleDetails />} /> 
                <Route path="/rent/:id" element={<RentNow />} /> 
                 
                {/* Renter Routes */} 
                <Route path="/renter/dashboard" element={<RenterDashboard />} /> 
                <Route path="/renter/bookings" element={<MyBookings />} /> 
                <Route path="/renter/payment" element={<BookingPayment />} /> 
                 
                {/* Owner Routes */} 
                <Route path="/owner/dashboard" element={<OwnerDashboard />} /> 
                <Route path="/owner/vehicles" element={<OwnerVehicles />} /> 
                <Route path="/owner/vehicles/new" element={<AddVehicle />} /> 
                <Route path="/owner/bookings" element={<ManageBookings />} /> 
                 
                {/* 404 Page */} 
                <Route path="*" element={<NotFound />} /> 
            </Routes> 
            <Toaster />
        </AuthProvider> 
    );
}

export default App;
