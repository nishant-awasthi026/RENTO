
import { Check, Car, Calendar, CreditCard, ThumbsUp } from "lucide-react";

const features = [
  {
    name: "Find Your Vehicle",
    description: "Browse through our extensive collection of vehicles and find the perfect match for your needs.",
    icon: Car,
  },
  {
    name: "Choose Dates",
    description: "Select your pickup and return dates. We offer flexible booking options to suit your schedule.",
    icon: Calendar,
  },
  {
    name: "Easy Payment",
    description: "Pay securely online with multiple payment options. No hidden fees, transparent pricing.",
    icon: CreditCard,
  },
  {
    name: "Enjoy Your Ride",
    description: "Pick up your vehicle and start your journey. Return it at the agreed time and location.",
    icon: ThumbsUp,
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">How RENTO Works</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            We've simplified the rental process so you can focus on your journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={feature.name} className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rento-yellow text-rento-dark mb-4">
                  <feature.icon className="h-8 w-8" />
                </div>
                <div className="mt-2">
                  <div className="flex items-center justify-center">
                    <span className="bg-rento-yellow text-rento-dark rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm mr-2">
                      {index + 1}
                    </span>
                    <h3 className="text-xl font-medium text-gray-900">{feature.name}</h3>
                  </div>
                  <p className="mt-2 text-gray-600">{feature.description}</p>
                </div>
              </div>
              {index < features.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-12 h-0.5 bg-gray-200" style={{ width: "calc(100% - 4rem)", left: "calc(50% + 2rem)" }}></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
