"use client";
import { useState, useEffect } from "react";
import { X, Share, PlusSquare, MoreVertical, Download, ArrowRight } from "lucide-react";

export default function InstallPrompt() {
  const [show, setShow] = useState(false);
  const [os, setOs] = useState<"ios" | "android" | "desktop">("desktop");

  useEffect(() => {
    // 1. Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone) return; 

    // 2. Detect OS
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setOs("ios");
      setTimeout(() => setShow(true), 2000); // Show after 2s
    } else if (/android/.test(userAgent)) {
      setOs("android");
      setTimeout(() => setShow(true), 2000);
    }
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 relative shadow-2xl animate-in slide-in-from-bottom-10 duration-500">
        
        {/* Close Button */}
        <button 
          onClick={() => setShow(false)} 
          className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto h-14 w-14 bg-gray-900 rounded-2xl flex items-center justify-center shadow-lg -rotate-3 mb-3">
             <span className="font-black text-2xl text-emerald-400">G</span>
          </div>
          <h3 className="text-xl font-black text-gray-900">Install GidiSpots</h3>
          <p className="text-sm text-gray-500 mt-1">Get the app experience.</p>
        </div>

        {/* IOS INSTRUCTIONS */}
        {os === "ios" && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
              <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-sm text-blue-500 shrink-0">
                <Share className="h-5 w-5" />
              </div>
              <div className="text-sm">
                <span className="block font-bold text-gray-900">Step 1</span>
                <span className="text-gray-500">Tap the <span className="font-bold text-gray-900">Share</span> button below.</span>
              </div>
            </div>

            <div className="flex justify-center">
                <ArrowRight className="h-5 w-5 text-gray-300 rotate-90" />
            </div>

            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
              <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-900 shrink-0">
                <PlusSquare className="h-5 w-5" />
              </div>
              <div className="text-sm">
                <span className="block font-bold text-gray-900">Step 2</span>
                <span className="text-gray-500">Scroll down and tap <br/><span className="font-bold text-gray-900">"Add to Home Screen"</span>.</span>
              </div>
            </div>
          </div>
        )}

        {/* ANDROID INSTRUCTIONS */}
        {os === "android" && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
              <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-900 shrink-0">
                <MoreVertical className="h-5 w-5" />
              </div>
              <div className="text-sm">
                <span className="block font-bold text-gray-900">Step 1</span>
                <span className="text-gray-500">Tap the <span className="font-bold text-gray-900">Menu</span> (3 dots) in your browser.</span>
              </div>
            </div>

            <div className="flex justify-center">
                <ArrowRight className="h-5 w-5 text-gray-300 rotate-90" />
            </div>

            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
              <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-sm text-emerald-600 shrink-0">
                <Download className="h-5 w-5" />
              </div>
              <div className="text-sm">
                <span className="block font-bold text-gray-900">Step 2</span>
                <span className="text-gray-500">Tap <span className="font-bold text-gray-900">Install App</span> or "Add to Home Screen".</span>
              </div>
            </div>
          </div>
        )}

        <button 
          onClick={() => setShow(false)} 
          className="w-full mt-6 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors"
        >
          Got it
        </button>

      </div>
    </div>
  );
}