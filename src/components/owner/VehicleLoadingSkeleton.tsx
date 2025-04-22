
import { Skeleton } from "@/components/ui/skeleton";

const VehicleLoadingSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-60 mb-6"></div>
      <div className="h-12 bg-gray-200 rounded mb-6"></div>
      <div className="space-y-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="h-24 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  );
};

export default VehicleLoadingSkeleton;
