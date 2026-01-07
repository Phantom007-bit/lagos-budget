"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send, CheckCircle } from "lucide-react";

export default function SubmitPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // --- REPLACE THIS WITH YOUR FORMSPREE LINK ---
  // If your URL is https://formspree.io/f/xvbdjqoq, just paste the whole URL below
  const FORMSPREE_URL = "https://formspree.io/f/mvzgekor"; 

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch(FORMSPREE_URL, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setSubmitted(true);
        // Reset form or redirect after delay if you want
        setTimeout(() => {
             // Optional: router.push('/'); 
        }, 3000);
      } else {
        alert("Oops! Something went wrong. Please try again.");
      }
    } catch (error) {
      alert("Error submitting form.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-10 text-center">
          <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
             <CheckCircle className="h-8 w-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Submission Sent!</h1>
          <p className="text-gray-500 mb-6">Thanks for the recommendation. We'll check it out!</p>
          <button 
             onClick={() => router.push('/')}
             className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm"
          >
            Back to Home
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 font-sans flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
        
        {/* Header */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </button>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Submit a Spot 🇳🇬</h1>
        <p className="text-gray-500 mb-8 text-sm">
          Found a hidden gem? Let us know and we'll add it to the list!
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Spot Name</label>
            <input 
              name="name"
              required
              type="text" 
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              placeholder="e.g. The Suya Spot"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
              <input 
                name="area"
                required
                type="text" 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                placeholder="e.g. Yaba"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Avg Price</label>
              <input 
                name="price"
                required
                type="text" 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                placeholder="e.g. 5k"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Why should we add it?</label>
            <textarea 
              name="message"
              required
              rows={4}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              placeholder="Tell us about the vibes..."
            />
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Sending..." : (
              <>
                <Send className="h-4 w-4" />
                Send Submission
              </>
            )}
          </button>

        </form>
      </div>
    </main>
  );
}