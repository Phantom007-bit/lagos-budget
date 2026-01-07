"use client";

// This file is the main page component for individual restaurant locations.
// It displays the restaurant's information, an image, and a back button.
// Data about the locations is imported, and the Next.js router is used for navigation.



import { useParams, useRouter } from "next/navigation";
import { locations } from "@/app/data";
import { ArrowLeft, MapPin, Navigation, Globe } from "lucide-react";

export default function RestaurantPage() {
  const params = useParams();
  const router = useRouter();
  
  const id = Number(params.id);
  const location = locations.find((loc) => loc.id === id);

  if (!location) {
    return <div className="p-10 text-center">Location not found!</div>;
  }

  return (
    <main className="min-h-screen bg-white pb-20">
      {/* Header Image */}
      <div className="relative h-72 w-full">
        <img
          src={location.image}
          alt={location.name}
          className="h-full w-full object-cover"
        />
        <button 
          onClick={() => router.back()}
          className="absolute top-4 left-4 h-10 w-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm"
        >
          <ArrowLeft className="h-5 w-5 text-gray-800" />
        </button>
      </div>
      // Main content area starts here
      // Header image with back button above content

      {/* Content */}
      <div className="px-6 -mt-8 relative z-10">
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-50">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{location.name}</h1>
              <div className="flex items-center gap-1.5 text-gray-500 mt-1">
                <MapPin className="h-4 w-4 text-emerald-600" />
                <span className="font-medium">{location.area}, {location.type}</span>
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-sm font-bold rounded-lg">
              {location.price}
            </span>
          </div>

          <hr className="border-gray-100 my-6" />

          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">About this spot</h2>
          <p className="text-gray-600 leading-relaxed">
            {location.description}
          </p>

          {/* --- NEW BUTTONS --- */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            <a 
              href={location.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3.5 bg-gray-100 text-gray-900 rounded-xl font-semibold hover:bg-gray-200 transition-all"
            >
              <Navigation className="h-4 w-4" />
              Directions
            </a>
            
            {/* The New Website Button */}
            <a 
              href={location.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3.5 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all"
            >
              <Globe className="h-4 w-4" />
              Visit Website
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}