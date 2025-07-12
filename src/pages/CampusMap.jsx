
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Shield, Users, Clock, Navigation } from "lucide-react";
import { motion } from "framer-motion";

const meetupLocations = [
  {
    id: "pmu",
    name: "Purdue Memorial Union (PMU)",
    description: "Historic student union with multiple dining options, study areas, and high foot traffic.",
    safety_rating: 5,
    hours: "Varies by vendor, generally 7am-11pm",
    crowd_level: "Very High",
    features: ["Security presence", "High foot traffic", "Multiple entrances", "Dining available", "Well-lit"],
    coordinates: { lat: 40.4244, lng: -86.9113 },
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/881a97af5_4-78-union-east-terrace_3F3DCF8E-C01A-4B6B-B0D34CC707F9F735_bf98c72d-553c-4242-a5e0e7692b343bab.jpg"
  },
  {
    id: "co-rec",
    name: "France A. Córdova Rec Center (Co-Rec)",
    description: "Main recreational facility, always staffed and busy with students.",
    safety_rating: 5,
    hours: "5:30 AM - 12:00 AM",
    crowd_level: "High",
    features: ["Staff present", "Security cameras", "High student traffic", "Multiple entrances"],
    coordinates: { lat: 40.4277, lng: -86.9208 },
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/29001eff4_8683960758_4c815edcf6_b.jpg"
  },
  {
    id: "krach",
    name: "Krach Leadership Center",
    description: "Modern student center with open study spaces and lots of visibility.",
    safety_rating: 5,
    hours: "7:00 AM - 12:00 AM",
    crowd_level: "High",
    features: ["Modern building", "Open study areas", "High visibility", "Student services"],
    coordinates: { lat: 40.4261, lng: -86.9204 },
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/c56b60060_01-Krach_CornerView_2014_8789-1800x1200.jpg"
  },
   {
    id: "bell_tower",
    name: "Purdue Bell Tower",
    description: "Iconic outdoor landmark in a central, open area of campus.",
    safety_rating: 4,
    hours: "24/7 (Outdoor)",
    crowd_level: "High",
    features: ["Landmark location", "Open space", "High visibility", "Well-lit at night"],
    coordinates: { lat: 40.4283, lng: -86.9138 },
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/343942ff9_belltower_centennial-600x400.jpg"
  },
  {
    id: "hicks",
    name: "Hicks Undergraduate Library",
    description: "Underground library with various study zones and computer labs.",
    safety_rating: 4,
    hours: "24/7 (with PUID)",
    crowd_level: "Medium",
    features: ["Security cameras", "24/7 PUID access", "Study spaces", "Good lighting"],
    coordinates: { lat: 40.4259, lng: -86.9144 },
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/b5972129e_photo13.jpg"
  },
  {
    id: "mackey_arena",
    name: "Mackey Arena",
    description: "Home of Purdue Basketball, a major landmark with lots of event traffic.",
    safety_rating: 4,
    hours: "Varies by event",
    crowd_level: "Varies (High on game days)",
    features: ["Major landmark", "Event security", "High traffic during events", "Well-lit"],
    coordinates: { lat: 40.4316, lng: -86.9142 },
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/758baba5b_MackeyArenaInterior.jpg"
  },
  {
    id: "ross_ade",
    name: "Ross-Ade Stadium",
    description: "Purdue's football stadium. Meetups best on non-game days near the entrance.",
    safety_rating: 4,
    hours: "Varies by event",
    crowd_level: "Varies (High on game days)",
    features: ["Major landmark", "Open areas nearby", "Good for large items"],
    coordinates: { lat: 40.4339, lng: -86.9162 },
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/a9b739ea4_Ross-Ade_Stadium.jpg"
  }
];

const safetyTips = [
  "Always meet in well-lit, public areas",
  "Bring a friend when possible",
  "Meet during daylight hours",
  "Trust your instincts - if something feels off, leave",
  "Let someone know where you're going",
  "Keep transactions simple and quick"
];

export default function CampusMap() {
  const [selectedLocation, setSelectedLocation] = useState(meetupLocations[0]);

  const getSafetyColor = (rating) => {
    if (rating >= 5) return "bg-green-100 text-green-800";
    if (rating >= 4) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getCrowdColor = (level) => {
    switch (level) {
      case "Very High": return "bg-red-100 text-red-800";
      case "High": return "bg-orange-100 text-orange-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      default: return "bg-green-100 text-green-800";
    }
  };

  const getGoogleMapsUrl = (location) => {
    const { lat, lng } = location.coordinates;
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${location.name}`;
  };

  return (
    <div className="min-h-screen bg-white p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-6"
        >
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            <span className="text-amber-600">Safe Meetup</span> Locations
          </h1>
          <p className="text-gray-600">Recommended Purdue University campus locations for completing your trades safely</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Location Cards */}
          <div className="lg:col-span-2 space-y-4">
            {meetupLocations.map((location, index) => (
              <motion.div
                key={location.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className={`glass-effect border-0 shadow-lg hover-lift cursor-pointer transition-all ${
                    selectedLocation?.id === location.id ? 'ring-2 ring-amber-500' : ''
                  }`}
                  onClick={() => setSelectedLocation(location)}
                >
                  <div className="flex">
                    <div className="w-1/3">
                      <img
                        src={location.image}
                        alt={location.name}
                        className="w-full h-full object-cover rounded-l-lg"
                      />
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {location.name}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {location.description}
                          </p>
                        </div>
                        <Badge className={getSafetyColor(location.safety_rating)}>
                          <Shield className="w-3 h-3 mr-1" />
                          {location.safety_rating}/5
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="outline" className="text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          {location.hours}
                        </Badge>
                        <Badge className={getCrowdColor(location.crowd_level)}>
                          <Users className="w-3 h-3 mr-1" />
                          {location.crowd_level} traffic
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {location.features.slice(0, 3).map((feature) => (
                          <Badge
                            key={feature}
                            variant="outline"
                            className="text-xs bg-amber-50 text-amber-700 border-amber-200"
                          >
                            {feature}
                          </Badge>
                        ))}
                        {location.features.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{location.features.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Selected Location Details */}
            {selectedLocation && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="glass-effect border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-amber-600" />
                      Location Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {selectedLocation.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {selectedLocation.description}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Safety Rating:</span>
                        <Badge className={getSafetyColor(selectedLocation.safety_rating)}>
                          {selectedLocation.safety_rating}/5
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Operating Hours:</span>
                        <span className="font-medium">{selectedLocation.hours}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Crowd Level:</span>
                        <Badge className={getCrowdColor(selectedLocation.crowd_level)}>
                          {selectedLocation.crowd_level}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Safety Features:</h4>
                      <div className="space-y-1">
                        {selectedLocation.features.map((feature) => (
                          <div key={feature} className="flex items-center gap-2 text-sm">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            <span className="text-gray-600">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-[--purdue-gold] hover:bg-amber-500 text-black border border-black"
                      onClick={() => window.open(getGoogleMapsUrl(selectedLocation), '_blank')}
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      Get Directions
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Safety Tips */}
            <Card className="glass-effect border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  Safety Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {safetyTips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-600">{tip}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contacts */}
            <Card className="glass-effect border-0 shadow-lg bg-red-50 border-red-100">
              <CardHeader>
                <CardTitle className="text-red-800">Emergency Contacts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm">
                  <div className="font-medium text-red-800">Local Police:</div>
                  <div className="text-red-700">911</div>
                </div>
                <div className="text-sm">
                  <div className="font-medium text-red-800">Non-Emergency:</div>
                  <div className="text-red-700">311</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
