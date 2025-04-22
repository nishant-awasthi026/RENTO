
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import VehicleForm from "@/components/owner/VehicleForm";

const AddVehicle = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Add New Vehicle</h1>
            <p className="text-gray-600 mt-1">List your vehicle for rent on Rento</p>
          </div>
          
          <VehicleForm />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AddVehicle;
