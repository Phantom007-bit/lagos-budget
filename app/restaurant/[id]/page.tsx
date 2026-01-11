"use client";

import { locations } from "../../data";
import Link from "next/link";
import { ArrowLeft, MapPin, Navigation, Share2, Info, Utensils } from "lucide-react";
import { use } from "react"; 

export default function RestaurantPage({ params }: { params: Promise<{ id: string }> }) {

  const { id } = use(params);

  // Find location using the unwrapped ID
  const loc = locations.find((l) => l.id === parseInt(id));

  if (!loc) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Spot not found 😕</h1>
            <Link href="/" className="text-emerald-600 font-bold hover:underline">Go Home</Link>
        </div>
    );
  }

  return (
    <main className="min-h-screen bg-white pb-20">
      {/* --- HERO IMAGE --- */}
      <div className="relative h-72 w-full">
        <img src={loc.image} alt={loc.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        
        {/* Navigation Header */}
        <div className="absolute top-0 w-full p-4 flex justify-between items-center z-10">
          <Link href="/" className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/30 transition-all">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <button className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/30 transition-all">
            <Share2 className="h-6 w-6" />
          </button>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 w-full p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-md">
                {loc.category}
            </span>
            <span className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider rounded-md border border-white/30">
                {loc.price}
            </span>
          </div>
          <h1 className="text-3xl font-black leading-tight mb-1">{loc.name}</h1>
          <div className="flex items-center gap-1 text-gray-300 text-sm font-medium">
            <MapPin className="h-4 w-4 text-emerald-400" />
            <span>{loc.area}, {loc.type}</span>
          </div>
        </div>
      </div>

      {/* --- CONTENT --- */}
      <div className="px-5 py-8 max-w-2xl mx-auto space-y-8">
        
        {/* Description Section */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Info className="h-5 w-5 text-emerald-600" />
                The Vibe
            </h2>
            <p className="text-gray-600 leading-relaxed text-sm">
                {loc.description || "A great spot to visit in Lagos. Popular for its atmosphere and service."}
            </p>
        </div>

        {/* Menu Highlights Section */}
        {loc.menuHighlights && loc.menuHighlights.length > 0 && (
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Utensils className="h-5 w-5 text-orange-500" />
                    Must Try Items
                </h2>
                <div className="grid grid-cols-1 gap-3">
                    {loc.menuHighlights.map((item, index) => (
                        <div key={index} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                            <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-xs">
                                {index + 1}
                            </div>
                            <span className="text-gray-700 font-medium text-sm">{item}</span>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Action Button */}
        <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t border-gray-100 flex gap-3 z-50 md:relative md:border-none md:bg-transparent md:p-0">
          <a 
            href={loc.mapUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-1 py-4 bg-gray-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-gray-800 transition-transform active:scale-95"
          >
            <Navigation className="h-5 w-5" />
            Get Directions
          </a>
        </div>

      </div>
    </main>
  );
}