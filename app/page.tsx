"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { locations } from "./data"; 
import { Search, MapPin, Dice5, X, ChevronRight, PlusCircle, Filter, DollarSign, PartyPopper, Download, Heart, Bell, CheckCircle } from "lucide-react";

export default function Home() {
  const [search, setSearch] = useState("");
  const [mainFilter, setMainFilter] = useState<"All" | "Mainland" | "Island" | "Saved">("All");

  // --- SAVED SPOTS STATE (LocalStorage) ---
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [isSavedLoaded, setIsSavedLoaded] = useState(false);

  // --- NOTIFICATION STATE ---
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // --- MODAL & INSTALL STATES ---
  const [isAddSpotOpen, setIsAddSpotOpen] = useState(false);
  const [isRouletteOpen, setIsRouletteOpen] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  // --- ROULETTE STATES ---
  const [rouletteResult, setRouletteResult] = useState<any | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rouletteFilters, setRouletteFilters] = useState({
    type: "All",
    price: "Any",
    vibe: "Any"
  });

  // --- DUMMY NOTIFICATIONS DATA ---
  const notifications = [
    { id: 1, text: "🎉 Roulette V2 is live! Try the new filters.", time: "2h ago" },
    { id: 2, text: "🔥 'Danfo Bistro' is trending this week.", time: "5h ago" },
    { id: 3, text: "👋 Welcome to GidiSpots Premium.", time: "1d ago" }
  ];

  // --- COMBINED USE EFFECT (Run Once on Mount) ---
  useEffect(() => {
    // 1. Load Saved Spots from LocalStorage
    const saved = localStorage.getItem("gidi_saved_spots");
    if (saved) {
      setSavedIds(JSON.parse(saved));
    }
    setIsSavedLoaded(true);

    // 2. Install Prompt Listener
    const handler = (e: any) => {
      e.preventDefault(); // Prevent mini-infobar
      setInstallPrompt(e); // Stash event
      console.log("Install prompt event captured");
    };
    window.addEventListener("beforeinstallprompt", handler);

    // Cleanup listener on unmount
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []); 

  // --- HANDLERS ---
  
  // 1. Install App Handler
  const handleInstallClick = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    console.log(`User response: ${outcome}`);
    setInstallPrompt(null);
  };

  // 2. Toggle Save Handler
  const toggleSave = (e: React.MouseEvent, id: number) => {
    e.preventDefault(); 
    e.stopPropagation();

    let newSaved;
    if (savedIds.includes(id)) {
      newSaved = savedIds.filter(sid => sid !== id);
      showToast("Removed from favorites 💔");
    } else {
      newSaved = [...savedIds, id];
      showToast("Added to favorites ❤️");
    }
    setSavedIds(newSaved);
    localStorage.setItem("gidi_saved_spots", JSON.stringify(newSaved));
  };

  // 3. Toast Helper
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // --- DYNAMIC CATEGORY LIST ---
  const uniqueCategories = useMemo(() => {
    const allCats = locations.map((loc: any) => loc.category || "General");
    const unique = Array.from(new Set(allCats));
    return ["Any", ...unique.sort()];
  }, []);

  // --- PRICE HELPERS ---
  const getPriceColor = (priceString: string) => {
    if (!priceString) return "bg-gray-100 text-gray-800 border-gray-200";
    const price = parseInt(priceString.toString().replace(/[^0-9]/g, ""));
    if (isNaN(price)) return "bg-gray-100 text-gray-800 border-gray-200"; 
    if (price <= 10000) return "bg-emerald-100 text-emerald-800 border-emerald-200"; 
    if (price <= 30000) return "bg-orange-100 text-orange-800 border-orange-200";   
    return "bg-rose-100 text-rose-800 border-rose-200";                              
  };

  const getPriceCategory = (priceString: string) => {
    const price = parseInt(priceString.toString().replace(/[^0-9]/g, ""));
    if (price <= 10000) return "Budget";
    if (price <= 30000) return "Mid";
    return "Splurge";
  };

  // --- FILTER LOGIC ---
  const filteredLocations = locations.filter((loc: any) => {
    const name = loc?.name || "";
    const category = loc?.category || "";
    const type = loc?.type || "";
    const searchTerm = search.toLowerCase();

    const matchesSearch =
      name.toLowerCase().includes(searchTerm) ||
      category.toLowerCase().includes(searchTerm);

    let matchesFilter = true;
    if (mainFilter === "Saved") {
        matchesFilter = savedIds.includes(loc.id);
    } else if (mainFilter !== "All") {
        matchesFilter = type === mainFilter;
    }
    
    return matchesSearch && matchesFilter;
  });

  // --- ROULETTE SPIN ---
  const handleSpin = () => {
    const candidates = locations.filter((loc: any) => {
        const matchesType = rouletteFilters.type === "All" || loc.type === rouletteFilters.type;
        const priceCat = getPriceCategory(loc.price || "0");
        const matchesPrice = rouletteFilters.price === "Any" || priceCat === rouletteFilters.price;
        const matchesVibe = rouletteFilters.vibe === "Any" || loc.category === rouletteFilters.vibe;
        return matchesType && matchesPrice && matchesVibe;
    });

    if (candidates.length === 0) {
        showToast("No spots found with those filters!");
        return;
    }

    setIsSpinning(true);
    setRouletteResult(null);
    setIsRouletteOpen(true); 
    
    setTimeout(() => {
      const random = candidates[Math.floor(Math.random() * candidates.length)];
      setRouletteResult(random);
      setIsSpinning(false);
    }, 1500);
  };

  const priceOptions = [
    { label: "Any Price", value: "Any" },
    { label: "Budget (₦0 - 10k)", value: "Budget" },
    { label: "Mid (₦10k - 30k)", value: "Mid" },
    { label: "Splurge (₦30k+)", value: "Splurge" }
  ];

  return (
    <main className="min-h-screen bg-gray-50 pb-20 selection:bg-emerald-100 selection:text-emerald-900 font-sans">
      
      {/* --- 1. PREMIUM GLASS NAVBAR --- */}
      <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl border-b border-gray-100 px-6 py-4 flex justify-between items-center transition-all">
        <div className="flex items-center gap-3">
          
<img 
  src="/logo.png" 
  alt="GidiSpots Logo" 
  className="h-10 w-10 object-contain rounded-lg" 
/>
           <span className="font-bold text-xl tracking-tight text-gray-900">GidiSpots</span>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
            {/* Install Button (Hidden unless prompt available) */}
            {installPrompt && (
                <button onClick={handleInstallClick} className="hidden md:flex items-center gap-2 bg-emerald-100 text-emerald-700 font-bold text-xs hover:bg-emerald-200 transition-colors px-3 py-2 rounded-lg">
                    <Download className="h-4 w-4" /> Install
                </button>
            )}

            {/* Notification Bell */}
            <div className="relative">
                <button 
                    onClick={() => {setIsNotifOpen(!isNotifOpen); setHasUnread(false);}}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors relative"
                >
                    <Bell className="h-5 w-5" />
                    {hasUnread && <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border border-white"></span>}
                </button>

                {/* Notification Dropdown */}
                {isNotifOpen && (
                    <div className="absolute top-12 right-0 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-50 animate-in slide-in-from-top-2 duration-200">
                        <div className="px-3 py-2 border-b border-gray-50">
                            <h3 className="font-bold text-gray-900 text-sm">Notifications</h3>
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                            {notifications.map(n => (
                                <div key={n.id} className="p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-default">
                                    <p className="text-sm text-gray-800 font-medium leading-tight">{n.text}</p>
                                    <span className="text-[10px] text-gray-400 mt-1 block uppercase font-bold">{n.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

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
                Spin
            </button>
        </div>
      </nav>

      {/* --- TOAST NOTIFICATION (Fixed Bottom) --- */}
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[150] bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
            <CheckCircle className="h-5 w-5 text-emerald-400" />
            <span className="font-bold text-sm">{toastMsg}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12">
        
        {/* --- HERO SECTION --- */}
        <div className="mb-14 text-center md:text-left space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-[1.1] tracking-tight">
                Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-400">Lagos</span>
                <br /> like a local.
            </h1>
            
            {/* Mobile Actions */}
            <div className="flex gap-3 justify-center md:hidden mt-4">
                <button onClick={() => setIsAddSpotOpen(true)} className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-full text-sm font-bold shadow-sm">
                    <PlusCircle className="h-4 w-4 text-emerald-600" /> Suggest
                </button>
                {installPrompt && (
                    <button onClick={handleInstallClick} className="flex items-center gap-2 bg-emerald-100 px-4 py-2 rounded-full text-sm font-bold text-emerald-800 shadow-sm">
                        <Download className="h-4 w-4" /> Install
                    </button>
                )}
            </div>
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
              className="w-full pl-14 pr-4 py-4 bg-white text-gray-900 border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-base font-medium placeholder:text-gray-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filter Pills */}
          <div className="flex justify-center md:justify-start gap-3 overflow-x-auto pb-2 scrollbar-hide pt-4">
            {["All", "Mainland", "Island", "Saved"].map((type) => (
              <button
                key={type}
                onClick={() => setMainFilter(type as any)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all border whitespace-nowrap flex items-center gap-2 ${
                  mainFilter === type
                    ? "bg-gray-900 text-white border-gray-900 shadow-lg shadow-gray-200 scale-105"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm"
                }`}
              >
                {type === "Saved" && <Heart className={`h-3 w-3 ${mainFilter === "Saved" ? "fill-white" : ""}`} />}
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
                
                {/* Price Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className={`backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm border ${getPriceColor(loc.price)}`}>
                    {loc.price || "N/A"}
                  </span>
                </div>

                {/* SAVE BUTTON */}
                <button
                    onClick={(e) => toggleSave(e, loc.id)}
                    className="absolute top-4 right-4 z-20 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 active:scale-90 transition-all group/heart"
                >
                    <Heart 
                        className={`h-5 w-5 transition-colors ${savedIds.includes(loc.id) ? "fill-red-500 text-red-500" : "text-gray-400 group-hover/heart:text-red-500"}`} 
                    />
                </button>
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

                <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
                  {loc.description || "Tap to explore the menu highlights and vibe check for this spot."}
                </p>

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
                <p className="text-gray-500">
                    {mainFilter === "Saved" ? "You haven't saved any spots yet." : "Try changing your search or filters."}
                </p>
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

                {/*FORM */}
                <form 
                    onSubmit={async (e) => {
                        e.preventDefault(); // Stop the page from reloading
                        const formData = new FormData(e.currentTarget);
                        
                        // Show immediate feedback
                        const submitBtn = document.getElementById("submit-btn") as HTMLButtonElement;
                        if(submitBtn) { submitBtn.innerText = "Sending..."; submitBtn.disabled = true; }

                        try {
                            // FORM SPREE ID 
                            const response = await fetch("https://formspree.io/f/mvzgekor", {
                                method: "POST",
                                body: formData,
                                headers: {
                                    'Accept': 'application/json'
                                }
                            });
                            
                            if (response.ok) {
                                setIsAddSpotOpen(false);
                                showToast("Suggestion sent successfully! 🚀");
                            } else {
                                alert("There was a problem sending your form. Please check your Formspree settings.");
                                if(submitBtn) { submitBtn.innerText = "Try Again"; submitBtn.disabled = false; }
                            }
                        } catch (error) {
                            alert("Error connecting to server.");
                            if(submitBtn) { submitBtn.innerText = "Try Again"; submitBtn.disabled = false; }
                        }
                    }} 
                    className="space-y-4"
                >
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Spot Name</label>
                        <input name="name" type="text" required className="w-full p-3 bg-gray-50 text-gray-900 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 font-medium placeholder:text-gray-400" placeholder="e.g. Danfo Bistro" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Area (e.g. Lekki, Yaba)</label>
                        <input name="area" type="text" required className="w-full p-3 bg-gray-50 text-gray-900 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 font-medium placeholder:text-gray-400" placeholder="e.g. Ikoyi" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Your Comment</label>
                        <textarea name="message" rows={3} className="w-full p-3 bg-gray-50 text-gray-900 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 font-medium placeholder:text-gray-400" placeholder="Best pasta in Lagos..."></textarea>
                    </div>
                    <button id="submit-btn" type="submit" className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
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
                        
                        {/* Vibe Filter */}
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Vibe</label>
                            <select 
                                value={rouletteFilters.vibe}
                                onChange={(e) => setRouletteFilters({...rouletteFilters, vibe: e.target.value})}
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