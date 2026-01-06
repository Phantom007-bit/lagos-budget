"use client";

import { useState, ChangeEvent } from "react";
import { Search, MapPin, Video } from "lucide-react";
import { locations } from "./data";

// Simple fallback UI components (you may replace with your design system)
function Button({
  children,
  variant = "default",
  size = "base",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline";
  size?: "sm" | "base";
}) {
  return (
    <button
      className={
        "rounded-md font-medium flex items-center justify-center transition-colors " +
        (variant === "default"
          ? " bg-green-700 text-white hover:bg-green-800 "
          : " border border-green-700 text-green-700 hover:bg-green-50 ") +
        (size === "sm" ? " px-2 py-1 text-sm " : " px-4 py-2 ") +
        className
      }
      {...props}
    >
      {children}
    </button>
  );
}

function Input({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={
        "rounded border px-3 py-2 outline-none w-full text-base focus:ring-2 focus:ring-green-200 " +
        className
      }
      {...props}
    />
  );
}

function Card({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={
        "rounded-md bg-white border border-gray-200 " +
        className
      }
      {...props}
    >
      {children}
    </div>
  );
}

function CardContent({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}

function Badge({
  children,
  className = "",
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "secondary" }) {
  return (
    <div
      className={
        "inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold " +
        (variant === "default"
          ? "bg-green-700 text-white"
          : "bg-gray-200 text-gray-800") +
        " " +
        className
      }
      {...props}
    >
      {children}
    </div>
  );
}

export default function LagosDirectory() {
  // State for activeTab and searchQuery
  const [activeTab, setActiveTab] = useState<string>("Mainland");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filtered locations logic
  const filteredLocations = locations.filter((location) => {
    const matchesTab =
      location.type.toLowerCase() === activeTab.toLowerCase();
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      location.name.toLowerCase().includes(q) ||
      location.area.toLowerCase().includes(q);
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Sticky Header with Region Toggle */}
      <header className="sticky top-0 z-50 bg-green-700 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-white">Lagos Living</h1>
            <div className="flex rounded-lg bg-green-100 p-1">
              <Button
                onClick={() => setActiveTab("Mainland")}
                variant={activeTab === "Mainland" ? "default" : "outline"}
                size="sm"
                className={
                  activeTab === "Mainland"
                    ? ""
                    : "text-green-700 hover:bg-green-200"
                }
              >
                Mainland
              </Button>
              <Button
                onClick={() => setActiveTab("Island")}
                variant={activeTab === "Island" ? "default" : "outline"}
                size="sm"
                className={
                  activeTab === "Island"
                    ? ""
                    : "text-green-700 hover:bg-green-200"
                }
              >
                Island
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Search */}
      <div className="container mx-auto px-4 pt-6">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search locations..."
            value={searchQuery}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSearchQuery(e.target.value)
            }
            className="pl-10 h-12 bg-white border border-gray-300"
          />
        </div>
      </div>

      {/* Location Grid */}
      <div className="container mx-auto px-4 pt-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredLocations.map((location) => (
            <Card
              key={location.id}
              className="overflow-hidden border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={location.image || "/placeholder.svg"}
                  alt={location.name}
                  className="h-full w-full object-cover"
                />
                <Badge className="absolute right-2 top-2 bg-green-700 text-white">
                  {location.price.toLowerCase() === "free"
                    ? "Free"
                    : location.price}
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">{location.name}</h3>
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
                  <MapPin className="h-4 w-4" />
                  <span>{location.area}</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1 gap-1"
                    onClick={() => window.open(location.tiktokUrl, "_blank")}
                  >
                    <Video className="h-4 w-4" />
                    Watch Review
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1 bg-transparent"
                    onClick={() => window.open(location.mapUrl, "_blank")}
                  >
                    <MapPin className="h-4 w-4" />
                    Map
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {filteredLocations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-lg text-gray-400 mb-2">No locations found</p>
            <p className="text-sm text-gray-400">
              Try adjusting your search query
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
