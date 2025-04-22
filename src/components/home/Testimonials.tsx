
import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    id: 1,
    content: "RENTO made my trip so much easier! I was able to find and book a car within minutes. The pickup was smooth, and the vehicle was in excellent condition.",
    author: "Priya Sharma",
    role: "Business Traveler",
    rating: 5,
    image: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    id: 2,
    content: "As a vehicle owner, I've been renting out my car on RENTO for 6 months now. The platform is user-friendly, and I've earned a good side income without any hassle.",
    author: "Rajesh Kumar",
    role: "Vehicle Owner",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: 3,
    content: "I needed a commercial vehicle for my business for a week. RENTO connected me with a reliable owner, and the process was transparent from start to finish.",
    author: "Amit Patel",
    role: "Small Business Owner",
    rating: 4,
    image: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    id: 4,
    content: "The variety of vehicles available on RENTO is impressive. I was able to rent a luxury car for my wedding at a reasonable price. Highly recommend!",
    author: "Neha Gupta",
    role: "Regular Customer",
    rating: 5,
    image: "https://randomuser.me/api/portraits/women/2.jpg",
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const previousTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const visibleTestimonials = () => {
    // For mobile, show one testimonial
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      return [testimonials[currentIndex]];
    }
    
    // For desktop, show three testimonials
    const indices = [
      currentIndex,
      (currentIndex + 1) % testimonials.length,
      (currentIndex + 2) % testimonials.length,
    ];
    
    return indices.map(index => testimonials[index]);
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">What Our Users Say</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Thousands of happy customers and vehicle owners share their experiences with RENTO
          </p>
        </div>

        <div className="relative">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-medium text-gray-900">Testimonials</h3>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={previousTestimonial}
                className="rounded-full"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={nextTestimonial}
                className="rounded-full"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {visibleTestimonials().map((testimonial) => (
              <div 
                key={testimonial.id}
                className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200"
              >
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      className={`${i < testimonial.rating ? 'text-rento-yellow fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-6">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.author}
                    className="h-10 w-10 rounded-full object-cover mr-3"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">{testimonial.author}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
