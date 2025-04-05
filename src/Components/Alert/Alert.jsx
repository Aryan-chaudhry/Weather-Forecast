import React, { useState } from "react";

function Alert() {
  const [location, setLocation] = useState({
    city: "Karnal",
    state: "Haryana",
    country: "India",
  });
  const [coordinates, setCoordinates] = useState({
    lat: 29.6857,
    lon: 76.9905,
  });
  const [zoom, setZoom] = useState(-5);

  const updateLocation = () => {
    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${location.city},${location.state},${location.country}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          setCoordinates({ lat: data[0].lat, lon: data[0].lon });
        }
      })
      .catch((error) => console.error("Error fetching coordinates:", error));
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-r from-gray-800 to-black text-white p-4 lg:p-6 gap-4 lg:gap-6 overflow-hidden">
      
      {/* Radar Map */}
      <div className="w-full lg:flex-1 h-[70vh] lg:h-auto rounded-lg overflow-hidden shadow-md border-2 border-gray-600">
        <iframe
          src={`https://embed.windy.com/embed2.html?lat=${coordinates.lat}&lon=${coordinates.lon}&zoom=${zoom}&level=surface&overlay=radar&menu=&message=&marker=true&calendar=&pressure=&type=map&location=coordinates&detail=&detailLat=${coordinates.lat}&detailLon=${coordinates.lon}&metricWind=default&metricTemp=default&radarRange=-1`}
          className="w-full h-full"
          title="Live Radar"
          loading="lazy"
        ></iframe>
      </div>

      {/* Sidebar */}
      <div className="w-full lg:w-96 h-[30vh] lg:h-auto bg-black/50 p-4 lg:p-6 rounded-xl shadow-lg flex flex-col justify-between overflow-y-auto space-y-4">
        <h3 className="text-xl lg:text-3xl font-bold text-center">
          See Weather Report from Radar
        </h3>

        {/* Location Inputs */}
        <div className="space-y-2">
          {["city", "state", "country"].map((field, i) => (
            <input
              key={i}
              type="text"
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={location[field]}
              onChange={(e) =>
                setLocation({ ...location, [field]: e.target.value })
              }
              className="p-2 rounded bg-gray-700 text-white w-full"
            />
          ))}
          <button
            onClick={updateLocation}
            className="w-full mt-2 px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-700 transition"
          >
            Update Location
          </button>
        </div>

        {/* Zoom Control */}
        <div className="text-center space-y-2">
          <label className="block text-base lg:text-lg font-semibold">
            Zoom Level: {zoom}
          </label>
          <input
            type="range"
            min="-10"
            max="10"
            step="1"
            value={zoom}
            onChange={(e) => setZoom(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}

export default Alert;
