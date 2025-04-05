import React from "react";
import { motion } from "framer-motion";

function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-6 flex flex-col items-center justify-center overflow-hidden relative">
      {/* Background Animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-gray-900 opacity-30 animate-pulse" />
      
      {/* Header Section */}
      <motion.h1
        className="text-6xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        🌍 About Our Weather App
      </motion.h1>
      
      {/* Introduction Section */}
      <motion.p
        className="text-lg text-gray-300 max-w-3xl text-center mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        Stay ahead of the weather with real-time forecasts, interactive maps, and emergency alerts. Our cutting-edge app delivers accurate insights to keep you informed and prepared for any condition.
      </motion.p>
      
      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl relative z-10">
        {[  
          { title: "🌦️ 5-Day Forecast", description: "Accurate weather predictions powered by Open-Meteo API." },
          { title: "🌩️ Radar Alerts", description: "Live radar tracking for thunderstorms, rain, and high winds." },
          { title: "🌊 Tsunami Warnings", description: "Stay informed on tsunamis with real-time updates from USGS." },
          { title: "🌍 Earthquake Alerts", description: "Track global seismic activity instantly." },
          { title: "📍 Location Search", description: "Find weather for any location with OpenStreetMap API." },
          { title: "🛰️ 3D Globe & Live Map", description: "Explore real-time alerts and forecasts in a stunning 3D environment." }
        ].map((feature, index) => (
          <motion.div 
            key={index} 
            className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 text-center transform hover:scale-105 transition duration-300"
            whileHover={{ scale: 1.08 }}
          >
            <h3 className="text-2xl font-bold text-blue-400 mb-3">{feature.title}</h3>
            <p className="text-gray-400 text-lg">{feature.description}</p>
          </motion.div>
        ))}
      </div>
      
      {/* Data Sources Section */}
      <motion.div 
        className="mt-16 bg-gray-900 p-8 rounded-lg shadow-lg border border-gray-700 max-w-3xl text-center relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <h2 className="text-3xl font-bold mb-5 text-yellow-400">📡 Powered By:</h2>
        <ul className="text-gray-300 text-lg space-y-2">
          <li>✅ <span className="text-blue-400">Open-Meteo</span> (Weather Forecasts)</li>
          <li>✅ <span className="text-red-400">USGS</span> (Earthquake & Tsunami Alerts)</li>
          <li>✅ <span className="text-green-400">OpenStreetMap</span> (Location Search)</li>
        </ul>
      </motion.div>
    </div>
  );
}

export default About;