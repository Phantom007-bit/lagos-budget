"use client";

import { useState, useEffect } from "react";
import { locations } from "./data";
import Link from "next/link";
import { Search, MapPin, Navigation, Eye, Heart, Plus } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("Mainland");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<number[]>([]);

  // Load favorites from phone memory on startup
  useEffect(() => {
    const saved = localStorage.getItem("lagosBudgetFavs");
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  // Function to toggle likes
  const toggleFavorite = (id: number) => {
    let newFavs;
    if (favorites.includes(id)) {
      newFavs = favorites.filter((favId) => favId !== id); // Remove
    } else {
      newFavs = [...favorites, id]; // Add
    }
    setFavorites(newFavs);
    localStorage.setItem("lagosBudgetFavs", JSON.stringify(newFavs));
  };

  const filteredLocations = locations.filter((loc) => {
    // If we are on the "Saved" tab, only show liked items
    if (activeTab === "Saved") {
      return favorites.includes(loc.id);
    }
    // Otherwise filter by Mainland/Island
    const matchesTab = loc.type === activeTab;
    const matchesSearch =
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.category?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-gray-50 pb-20 font-sans">
      {/* --- Header --- */}
      <header className="fixed top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="mx-auto max-w-4xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">LB</span>
            </div>
            <h1 className="text-lg font-bold text-gray-900 tracking-tight">
              Lagos <span className="text-emerald-600">on a budget</span>
            </h1>
          </div>
          
          {/* Submit Button (New!) */}
          <Link href="/submit" className="flex items-center gap-1 bg-gray-900 text-white px-3 py-1.5 rounded-full text-xs font-bold">
            <Plus className="h-3 w-3" />
            Add Spot
          </Link>
        </div>

        {/* --- Controls --- */}
        <div className="px-4 pb-4 max-w-4xl mx-auto space-y-4">
          {/* Toggle with Saved Tab */}
          <div className="flex p-1 bg-gray-100 rounded-xl relative max-w-sm mx-auto">
            {["Mainland", "Island", "Saved"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
                  activeTab === tab
                    ? "bg-white text-emerald-700 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search Lekki, Beach, or Date night..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-gray-700 focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm placeholder:text-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* --- Content --- */}
      <div className="pt-48 px-4 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {activeTab === "Saved" ? "Your Favorites" : `${activeTab} Collection`}
          </h2>
          <span className="text-xs font-medium px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full">
            {filteredLocations.length} Found
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLocations.map((loc) => (
            <div
              key={loc.id}
              className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-1 relative"
            >
              {/* Image */}
              <div className="relative h-56 w-full bg-gray-200">
                <img
                  src={loc.image}
                  alt={loc.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Heart Button */}
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    toggleFavorite(loc.id);
                  }}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 transition-all"
                >
                  <Heart 
                    className={`h-5 w-5 transition-colors ${favorites.includes(loc.id) ? "fill-red-500 text-red-500" : "text-white"}`} 
                  />
                </button>

                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg">
                  <span className="text-emerald-800 font-bold text-[10px] uppercase tracking-wider">
                    {loc.category}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="p-5">
                <div className="mb-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-gray-900 leading-snug mb-1">
                        {loc.name}
                    </h3>
                    <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                        {loc.price}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1 text-gray-500">
                    <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="text-sm font-medium">{loc.area}</span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href={`/restaurant/${loc.id}`}
                    className="flex items-center justify-center gap-2 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-colors"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View
                  </Link>

                  <a
                    href={loc.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors border border-gray-200"
                  >
                    <Navigation className="h-3.5 w-3.5" />
                    Map
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredLocations.length === 0 && (
          <div className="text-center py-20">
            <Heart className="h-12 w-12 text-gray-200 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900">
                {activeTab === "Saved" ? "No favorites yet" : "No matches found"}
            </h3>
            <p className="text-gray-500 mt-1">
                {activeTab === "Saved" ? "Tap the heart icon on any spot to save it here." : "Try searching for something else."}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}