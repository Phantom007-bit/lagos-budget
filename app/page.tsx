"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { locations } from "./data"; 
import { Search, MapPin, Dice5, X, ChevronRight, PlusCircle, Filter, DollarSign, PartyPopper } from "lucide-react";

export default function Home() {
  const [search, setSearch] = useState("");
  const [mainFilter, setMainFilter] = useState<"All" | "Mainland" | "Island">("All");

  // --- MODAL STATES ---
  const [isAddSpotOpen, setIsAddSpotOpen] = useState(false);
  const [isRouletteOpen, setIsRouletteOpen] = useState(false);
  
  // --- ROULETTE STATES ---
  const [rouletteResult, setRouletteResult] = useState<any | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rouletteFilters, setRouletteFilters] = useState({
    type: "All",
    price: "Any",
    vibe: "Any"
  });

  // --- DYNAMIC CATEGORY LIST ---
  const uniqueCategories = useMemo(() => {
    const allCats = locations.map((loc: any) => loc.category || "General");
    const unique = Array.from(new Set(allCats));
    return ["Any", ...unique.sort()];
  }, []);

  // --- HELPER: Traffic Light Logic 🚦 ---
  const getPriceColor = (priceString: string) => {
    if (!priceString) return "bg-gray-100 text-gray-800 border-gray-200";
    const price = parseInt(priceString.toString().replace(/[^0-9]/g, ""));
    if (isNaN(price)) return "bg-gray-100 text-gray-800 border-gray-200"; 
    if (price <= 5000) return "bg-emerald-100 text-emerald-800 border-emerald-200"; // 🟢 Budget
    if (price <= 20000) return "bg-orange-100 text-orange-800 border-orange-200";   // 🟠 Mid
    return "bg-rose-100 text-rose-800 border-rose-200";                              // 🔴 Splurge
  };

  // --- HELPER: Get Price Category ---
  const getPriceCategory = (priceString: string) => {
    const price = parseInt(priceString.toString().replace(/[^0-9]/g, ""));
    if (price <= 5000) return "Budget";
    if (price <= 20000) return "Mid";
    return "Splurge";
  };

  // --- MAIN PAGE FILTER LOGIC ---
  const filteredLocations = locations.filter((loc: any) => {
    const name = loc?.name || "";
    const category = loc?.category || "";
    const type = loc?.type || "";
    const searchTerm = search.toLowerCase();

    const matchesSearch =
      name.toLowerCase().includes(searchTerm) ||
      category.toLowerCase().includes(searchTerm);

    const matchesFilter = mainFilter === "All" || type === mainFilter;
    
    return matchesSearch && matchesFilter;
  });

  // --- ROULETTE SPIN LOGIC 🎰 ---
  const handleSpin = () => {
    const candidates = locations.filter((loc: any) => {
        const matchesType = rouletteFilters.type === "All" || loc.type === rouletteFilters.type;
        
        const priceCat = getPriceCategory(loc.price || "0");
        const matchesPrice = rouletteFilters.price === "Any" || priceCat === rouletteFilters.price;
        
        const matchesVibe = rouletteFilters.vibe === "Any" || loc.category === rouletteFilters.vibe;

        return matchesType && matchesPrice && matchesVibe;
    });

    if (candidates.length === 0) {
        alert("No spots found with those exact filters! Try selecting 'Any' for one of the options.");
        return;
    }

    setIsSpinning(true);
    setRouletteResult(null);
    
    setTimeout(() => {
      const random = candidates[Math.floor(Math.random() * candidates.length)];
      setRouletteResult(random);
      setIsSpinning(false);
    }, 1500);
  };

  // --- ROULETTE OPTIONS ---
  const priceOptions = [
    { label: "Any Price", value: "Any" },
    { label: "Budget (₦0 - 5k)", value: "Budget" },
    { label: "Mid (₦5k - 20k)", value: "Mid" },
    { label: "Splurge (₦20k+)", value: "Splurge" }
  ];

  return (
    <main className="min-h-screen bg-gray-50 pb-20 selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* --- 1. PREMIUM GLASS NAVBAR --- */}
      <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl border-b border-gray-100 px-6 py-4 flex justify-between items-center transition-all">
        <div className="flex items-center gap-3">
           <div className="h-9 w-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-emerald-200 shadow-lg transform rotate-3">
             G
           </div>
           <span className="font-bold text-xl tracking-tight text-gray-900">GidiSpots</span>
        </div>

        <div className="flex items-center gap-3">
            {/* Add Spot Button */}
            <button 
                onClick={() => setIsAddSpotOpen(true)}
                className="hidden md:flex items-center gap-2 text-gray-600 font-bold text-sm hover:text-emerald-600 transition-colors px-3 py-2"
            >
                <PlusCircle className="h-4 w-4" />
                Add Spot
            </button>

            {/* Roulette Button */}
            <button 
                onClick={() => setIsRouletteOpen(true)}
                className="hidden md:flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-gray-800 transition-all active:scale-95 shadow-lg hover:shadow-xl"
            >
                <Dice5 className="h-4 w-4" />
                Spin Roulette
            </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12">
        
        {/* --- HERO SECTION --- */}
        <div className="mb-14 text-center md:text-left space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-[1.1] tracking-tight">
                Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-400">Lagos</span>
                <br /> like a local.
            </h1>
            
            {/* Mobile Add Spot Button */}
            <button 
                onClick={() => setIsAddSpotOpen(true)}
                className="md:hidden mt-4 flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-full text-sm font-bold shadow-sm"
            >
                <PlusCircle className="h-4 w-4 text-emerald-600" />
                Suggest a Spot
            </button>
          </div>

          <p className="text-gray-500 text-lg md:text-xl max-w-lg mx-auto md:mx-0">
            The curated guide to the best spots, hidden gems, and budget eats in the city.
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-lg mx-auto md:mx-0 group mt-8">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-emerald-500 transition-colors" />
            <input
              type="text"
              placeholder="Search spots, vibes, or areas..."
              // 👇 I added "text-gray-900" here to fix invisible text on mobile
              className="w-full pl-14 pr-4 py-4 bg-white text-gray-900 border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-base font-medium placeholder:text-gray-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filter Pills */}
          <div className="flex justify-center md:justify-start gap-3 overflow-x-auto pb-2 scrollbar-hide pt-4">
            {["All", "Mainland", "Island"].map((type) => (
              <button
                key={type}
                onClick={() => setMainFilter(type as any)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all border whitespace-nowrap ${
                  mainFilter === type
                    ? "bg-gray-900 text-white border-gray-900 shadow-lg shadow-gray-200 scale-105"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* --- 2. LUXURY CARD GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
          {filteredLocations.map((loc: any) => (
            <Link 
              href={`/restaurant/${loc.id}`} 
              key={loc.id}
              className="group relative flex flex-col bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 hover:-translate-y-2 border border-gray-100"
            >
              {/* Image Container */}
              <div className="relative h-64 w-full overflow-hidden">
                <img 
                  src={loc.image} 
                  alt={loc.name} 
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* 🚦 TRAFFIC LIGHT PRICE BADGE */}
                <div className="absolute top-4 right-4 z-10">
                  <span className={`backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm border ${getPriceColor(loc.price)}`}>
                    {loc.price || "N/A"}
                  </span>
                </div>
              </div>

              {/* Content Container */}
              <div className="p-6 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-emerald-600 transition-colors">
                      {loc.name || "Unnamed Spot"}
                    </h2>
                    <p className="text-sm text-gray-500 font-medium flex items-center gap-1.5 mt-2">
                      <MapPin className="h-3.5 w-3.5 text-emerald-500" /> 
                      {loc.area || "Lagos"}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-lg bg-gray-50 text-gray-600 text-[10px] font-bold uppercase tracking-wide border border-gray-100">
                    {loc.category || "General"}
                  </span>
                </div>

                {/* Description Snippet */}
                <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
                  {loc.description || "Tap to explore the menu highlights and vibe check for this spot."}
                </p>

                {/* Hover CTA */}
                <div className="mt-2 flex items-center text-emerald-600 text-sm font-bold opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    View Details <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredLocations.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-white p-8 rounded-3xl inline-block shadow-sm border border-gray-100">
                <p className="text-lg text-gray-900 font-bold mb-2">No spots found 😕</p>
                <p className="text-gray-500">Try changing your search or filters.</p>
                <button 
                    onClick={() => {setSearch(""); setMainFilter("All");}}
                    className="mt-4 text-emerald-600 font-bold text-sm hover:underline"
                >
                    Clear Filters
                </button>
            </div>
          </div>
        )}
      </div>

      {/* --- ADD SPOT MODAL (FORMSPREE) --- */}
      {isAddSpotOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl relative">
                <button 
                    onClick={() => setIsAddSpotOpen(false)}
                    className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                    <X className="h-5 w-5 text-gray-500" />
                </button>
                
                <h2 className="text-2xl font-black text-gray-900 mb-2">Suggest a Spot</h2>
                <p className="text-gray-500 mb-6 text-sm">Know a hidden gem? Tell us about it.</p>

                {/* 👇 REPLACE 'YOUR_FORM_ID' WITH YOUR REAL FORMSPREE ID 👇 */}
                <form action="https://formspree.io/f/mvzgekor" method="POST" className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Spot Name</label>
                        {/* Added text-gray-900 to fix invisible text on mobile */}
                        <input name="name" type="text" required className="w-full p-3 bg-gray-50 text-gray-900 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 font-medium placeholder:text-gray-400" placeholder="e.g. Danfo Bistro" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Area (e.g. Lekki, Yaba)</label>
                        {/* Added text-gray-900 */}
                        <input name="area" type="text" required className="w-full p-3 bg-gray-50 text-gray-900 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 font-medium placeholder:text-gray-400" placeholder="e.g. Ikoyi" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Your Comment</label>
                        {/* Added text-gray-900 */}
                        <textarea name="message" rows={3} className="w-full p-3 bg-gray-50 text-gray-900 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 font-medium placeholder:text-gray-400" placeholder="Best pasta in Lagos..."></textarea>
                    </div>
                    <button type="submit" className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-600 transition-colors">
                        Submit Suggestion
                    </button>
                </form>
            </div>
        </div>
      )}

      {/* --- ROULETTE CONFIG & RESULT MODAL --- */}
      {(isRouletteOpen || rouletteResult) && (
         <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 transition-all duration-500">
            <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95 duration-300 relative border border-gray-100">
               
               <button 
                 onClick={() => { setIsRouletteOpen(false); setIsSpinning(false); setRouletteResult(null); }}
                 className="absolute top-4 right-4 p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-900 z-10"
               >
                 <X className="h-5 w-5" />
               </button>

               {/* STATE 1: CONFIGURATION (Pick filters) */}
               {!isSpinning && !rouletteResult && (
                 <div className="text-left space-y-6">
                    <div className="text-center">
                        <div className="inline-flex p-3 bg-emerald-100 rounded-2xl mb-3 text-emerald-600">
                            <Dice5 className="h-8 w-8" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900">Configure Spin</h2>
                        <p className="text-gray-500 text-sm">Narrow down your luck.</p>
                    </div>

                    <div className="space-y-4">
                        {/* Area Filter */}
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Location</label>
                            <div className="grid grid-cols-3 gap-2">
                                {["All", "Mainland", "Island"].map(opt => (
                                    <button 
                                        key={opt}
                                        onClick={() => setRouletteFilters({...rouletteFilters, type: opt})}
                                        className={`py-2 text-sm font-bold rounded-lg border transition-all ${rouletteFilters.type === opt ? 'bg-gray-900 text-white border-gray-900 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price Filter */}
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Budget</label>
                            <div className="grid grid-cols-2 gap-2">
                                {priceOptions.map(opt => (
                                    <button 
                                        key={opt.value}
                                        onClick={() => setRouletteFilters({...rouletteFilters, price: opt.value})}
                                        className={`py-2 px-2 text-xs font-bold rounded-lg border transition-all ${
                                            rouletteFilters.price === opt.value 
                                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' 
                                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                        }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        {/* Vibe Filter (Dynamic from Data) */}
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Vibe</label>
                            <select 
                                value={rouletteFilters.vibe}
                                onChange={(e) => setRouletteFilters({...rouletteFilters, vibe: e.target.value})}
                                // Added text-gray-900 to fix invisible dropdown text on mobile
                                className="w-full p-3 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl font-bold focus:outline-none focus:border-emerald-500 appearance-none"
                            >
                                {uniqueCategories.map(cat => (
                                    <option key={cat} value={cat}>
                                        {cat === "Any" ? "Surprise Me (Any Vibe)" : cat}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button 
                        onClick={handleSpin}
                        className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl shadow-xl hover:bg-emerald-600 hover:scale-[1.02] transition-all"
                    >
                        Spin Now 🎲
                    </button>
                 </div>
               )}

               {/* STATE 2: SPINNING */}
               {isSpinning && (
                 <div className="py-12 space-y-6">
                   <div className="animate-spin text-6xl">🎲</div>
                   <div>
                       <h3 className="text-2xl font-black text-gray-900 mb-2">Finding a spot...</h3>
                       <p className="text-gray-500 font-medium">Checking your filters.</p>
                   </div>
                 </div>
               )}

               {/* STATE 3: RESULT */}
               {rouletteResult && !isSpinning && (
                 <div className="space-y-6 pt-2">
                    <div className="h-48 w-full rounded-2xl overflow-hidden relative shadow-md">
                        <img src={rouletteResult?.image} className="h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        <div className={`absolute bottom-3 left-3 font-bold text-sm backdrop-blur-md px-3 py-1 rounded-full border ${getPriceColor(rouletteResult?.price || "")}`}>
                            {rouletteResult?.price}
                        </div>
                    </div>
                    
                    <div className="text-left px-1">
                        <span className="text-emerald-600 font-bold text-xs tracking-widest uppercase mb-1 block">Fate Chose:</span>
                        <h2 className="text-3xl font-black text-gray-900 mb-2 leading-tight">{rouletteResult?.name}</h2>
                        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                            {rouletteResult?.description}
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <button 
                            onClick={() => setRouletteResult(null)}
                            className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                        >
                            Spin Again
                        </button>
                        <Link 
                            href={`/restaurant/${rouletteResult?.id}`}
                            className="flex-1 py-3 bg-gray-900 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-600 transition-colors block"
                        >
                            View Details
                        </Link>
                    </div>
                 </div>
               )}
            </div>
         </div>
      )}

      {/* Mobile FAB (Roulette) */}
      <button 
        onClick={() => setIsRouletteOpen(true)}
        className="md:hidden fixed bottom-6 right-6 h-16 w-16 bg-gray-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all z-40 border-4 border-white/20"
      >
        <Dice5 className="h-7 w-7" />
      </button>

    </main>
  );
}