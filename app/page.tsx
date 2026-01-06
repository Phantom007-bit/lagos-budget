"use client";

import { useState } from "react";
import { locations } from "./data";
import { Search, MapPin, ExternalLink, Navigation } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("Mainland");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLocations = locations.filter((loc) => {
    const matchesTab = loc.type === activeTab;
    const matchesSearch =
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.area.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-gray-50 pb-20 font-sans">
      {/* --- Sticky Glass Header --- */}
      <header className="fixed top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="mx-auto max-w-md px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">LB</span>
            </div>
            {/* NAME CHANGE IS HERE */}
            <h1 className="text-lg font-bold text-gray-900 tracking-tight">
              Lagos <span className="text-emerald-600">on a budget</span>
            </h1>
          </div>
        </div>

        {/* --- Toggle & Search Container --- */}
        <div className="px-6 pb-4 max-w-md mx-auto space-y-4">
          {/* Toggle Switch */}
          <div className="flex p-1 bg-gray-100 rounded-full relative">
            <button
              onClick={() => setActiveTab("Mainland")}
              className={`flex-1 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${
                activeTab === "Mainland"
                  ? "bg-white text-emerald-700 shadow-sm ring-1 ring-black/5"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Mainland
            </button>
            <button
              onClick={() => setActiveTab("Island")}
              className={`flex-1 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${
                activeTab === "Island"
                  ? "bg-white text-emerald-700 shadow-sm ring-1 ring-black/5"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Island
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search Ikeja, Date night..."
              className="w-full pl-11 pr-4 py-3 bg-white border-0 ring-1 ring-gray-200 rounded-2xl text-gray-700 focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm placeholder:text-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* --- Main Feed --- */}
      <div className="pt-48 px-6 max-w-md mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            {activeTab} Spots
          </h2>
          <span className="text-xs font-medium px-2 py-1 bg-gray-200 rounded-lg text-gray-600">
            {filteredLocations.length} results
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {filteredLocations.map((loc) => (
            <div
              key={loc.id}
              className="group bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 transition-transform hover:scale-[1.02] duration-300"
            >
              {/* Image Section */}
              <div className="relative h-64 w-full bg-gray-200">
                <img
                  src={loc.image}
                  alt={loc.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full">
                  <span className="text-white font-bold text-sm">
                    {loc.price}
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 leading-tight">
                      {loc.name}
                    </h3>
                    <div className="flex items-center gap-1 text-gray-500 mt-1">
                      <MapPin className="h-3.5 w-3.5" />
                      <span className="text-sm font-medium">{loc.area}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 mt-6">
                  <a
                    href={loc.tiktokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3 bg-black text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Watch
                  </a>
                  <a
                    href={loc.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3 bg-emerald-100 text-emerald-800 rounded-xl text-sm font-semibold hover:bg-emerald-200 transition-colors"
                  >
                    <Navigation className="h-4 w-4" />
                    Map
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Empty State */}
        {filteredLocations.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400">No spots found in {activeTab}.</p>
          </div>
        )}
      </div>
    </main>
  );
}