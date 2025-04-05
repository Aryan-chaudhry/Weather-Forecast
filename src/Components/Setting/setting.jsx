import React, { useState } from "react";
import { useLocation } from "../../Context/LocationContext";
import { useNavigate } from "react-router-dom";

function Setting() {
  const { setLocation } = useLocation();
  const [formData, setFormData] = useState({
    city: "",
    state: "",
    country: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Use only city and country in query for better match accuracy
    const query = `${formData.city}, ${formData.country}`;
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      console.log("Request URL:", url);
      console.log("API Response:", data);

      if (data.results && data.results.length > 0) {
        const { latitude, longitude, name, country, admin1 } = data.results[0];

        setLocation({
          city: name,
          state: formData.state, // Preserve user-entered state
          country: country || formData.country,
          lat: parseFloat(latitude),
          lon: parseFloat(longitude),
        });

        navigate("/");
      } else {
        setError("❌ Location not found. Try again with just city and country.");
      }
    } catch (err) {
      console.error("Geocoding Error:", err);
      setError("⚠️ Error fetching location.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-black to-purple-900 animate-pulse-slow z-0" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 z-0" />
      <div className="relative z-10 flex justify-center items-center h-full px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl p-8 space-y-6 text-white"
        >
          <h2 className="text-3xl font-extrabold text-center text-blue-200 drop-shadow">
             Set Your Location
          </h2>

          {["city", "state", "country"].map((field) => (
            <div key={field} className="relative">
              <input
                type="text"
                name={field}
                id={field}
                placeholder=" "
                value={formData[field]}
                onChange={handleChange}
                required
                className="peer w-full p-3 rounded-lg border border-gray-500 bg-white/10 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/20"
              />
              <label
                htmlFor={field}
                className="absolute left-3 top-3 text-gray-300 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:text-sm peer-focus:text-blue-300"
              >
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
            </div>
          ))}

          {error && (
            <p className="text-red-400 text-center text-sm bg-white/10 border border-red-500/20 rounded p-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold transition ${
              loading
                ? "bg-blue-400 cursor-wait"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-700 hover:to-blue-700 cursor-pointer"
            }`}
          >
            {loading ? "Finding Location..." : "Save Location"}
          </button>
        </form>
      </div>

      <style>
        {`
          @keyframes pulseSlow {
            0%, 100% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
          }
          .animate-pulse-slow {
            animation: pulseSlow 15s ease infinite;
            background-size: 400% 400%;
          }
        `}
      </style>
    </div>
  );
}

export default Setting;
