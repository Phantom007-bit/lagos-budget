"use client";

import { useState, useEffect } from "react";
import { locations } from "./data";
import Link from "next/link";
// IMPORTING DICE5 HERE
import { Search, MapPin, Navigation, Eye, Heart, Plus, Dice5, X } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("Mainland");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<number[]>([]);
  
  // Roulette State
  const [showRoulette, setShowRoulette] = useState(false);
  const [rouletteWinner, setRouletteWinner] = useState<typeof locations[0] | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("lagosBudgetFavs");
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  const toggleFavorite = (id: number) => {
    let newFavs;
    if (favorites.includes(id)) {
      newFavs = favorites.filter((favId) => favId !== id);
    } else {
      newFavs = [...favorites, id];
    }
    setFavorites(newFavs);
    localStorage.setItem("lagosBudgetFavs", JSON.stringify(newFavs));
  };

  const filteredLocations = locations.filter((loc) => {
    if (activeTab === "Saved") {
      return favorites.includes(loc.id);
    }
    const matchesTab = loc.type === activeTab;
    const matchesSearch =
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.category?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // THE ROULETTE LOGIC 🎲
  const handleSpin = () => {
    setShowRoulette(true);
    setIsSpinning(true);
    setRouletteWinner(null);

    setTimeout(() => {
      const listToPickFrom = filteredLocations.length > 0 ? filteredLocations : locations;
      const random = listToPickFrom[Math.floor(Math.random() * listToPickFrom.length)];
      setRouletteWinner(random);
      setIsSpinning(false);
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-20 font-sans relative">
      
      {/* --- ROULETTE MODAL --- */}
      {showRoulette && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 relative shadow-2xl animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => setShowRoulette(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-900"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="text-center">
              <div className="mx-auto h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <Dice5 className={`h-8 w-8 text-emerald-600 ${isSpinning ? "animate-spin" : ""}`} />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {isSpinning ? "Finding the perfect spot..." : "We found a match! 🎉"}
              </h3>

              {!isSpinning && rouletteWinner && (
                <div className="mt-6">
                  <div className="rounded-2xl overflow-hidden mb-4 border border-gray-100">
                    <img src={rouletteWinner.image} className="h-40 w-full object-cover" />
                    <div className="p-3 bg-gray-50 text-left">
                      <h4 className="font-bold text-gray-900">{rouletteWinner.name}</h4>
                      <p className="text-sm text-gray-500">{rouletteWinner.area}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={handleSpin}
                      className="py-3 bg-gray-100 text-gray-900 rounded-xl font-bold text-sm hover:bg-gray-200"
                    >
                      Spin Again
                    </button>
                    <Link 
                      href={`/restaurant/${rouletteWinner.id}`}
                      className="py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-emerald-700"
                    >
                      Let's Go!
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- Header --- */}
      <header className="fixed top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="mx-auto max-w-4xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">LB</span>
            </div>
            <h1 className="text-lg font-bold text-gray-900 tracking-tight">
              Lagos <span className="text-emerald-600">Budget</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            {/* --- DICE BUTTON IS HERE --- */}
            <button 
              onClick={handleSpin}
              className="bg-emerald-100 text-emerald-700 p-2 rounded-full hover:bg-emerald-200 transition-colors"
              title="Surprise Me!"
            >
              <Dice5 className="h-5 w-5" />
            </button>

            <Link href="/submit" className="flex items-center gap-1 bg-gray-900 text-white px-3 py-2 rounded-full text-xs font-bold">
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Add Spot</span>
            </Link>
          </div>
        </div>

        {/* --- Controls --- */}
        <div className="px-4 pb-4 max-w-4xl mx-auto space-y-4">
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
              <div className="relative h-56 w-full bg-gray-200">
                <img
                  src={loc.image}
                  alt={loc.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
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