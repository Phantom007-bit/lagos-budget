"use client";
import { useState, useEffect } from "react";
import { X, Share, MoreVertical, Download, Phone } from "lucide-react";

export default function InstallPrompt() {
  const [show, setShow] = useState(false);
  const [os, setOs] = useState<"ios" | "android" | "desktop">("desktop");

  useEffect(() => {
    // 1. Check if already installed (Standalone mode)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone) return; 

    // 2. Detect OS
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setOs("ios");
      setTimeout(() => setShow(true), 3000); // Wait 3s so it doesn't annoy them instantly
    } else if (/android/.test(userAgent)) {
      setOs("android");
      setTimeout(() => setShow(true), 3000);
    }
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[100] animate-in slide-in-from-bottom-10 duration-700">
      <div className="bg-gray-900 text-white p-5 rounded-2xl shadow-2xl relative border border-gray-800 backdrop-blur-md bg-opacity-95">
        
        {/* Close Button */}
        <button 
          onClick={() => setShow(false)} 
          className="absolute top-3 right-3 text-gray-400 hover:text-white bg-gray-800 p-1 rounded-full"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-4">
          {/* App Icon Preview */}
          <div className="h-12 w-12 bg-emerald-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg -rotate-3">
            <span className="font-black text-xl text-white">G</span>
          </div>
          
          <div className="flex-1">
            <h4 className="font-bold text-base mb-1">Install GidiSpots</h4>
            <p className="text-xs text-gray-300 mb-3 leading-relaxed">
              {os === "ios" 
                ? "Add to Home Screen for the best full-screen experience."
                : "Install the app to access spots faster."}
            </p>
            
            {/* Dynamic Instructions */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-emerald-400 bg-gray-800/50 p-2 rounded-lg border border-gray-700/50">
              {os === "ios" ? (
                <>
                  <span className="flex items-center gap-1 text-gray-200">Tap <Share className="h-3 w-3" /></span> 
                  <span className="text-gray-500">→</span>
                  <span>Add to Home Screen</span>
                </>
              ) : (
                <>
                  <span className="flex items-center gap-1 text-gray-200">Tap <MoreVertical className="h-3 w-3" /></span> 
                  <span className="text-gray-500">→</span>
                  <span className="flex items-center gap-1">Install App <Download className="h-3 w-3" /></span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}