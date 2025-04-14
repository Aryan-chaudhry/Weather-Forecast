import React, { useState, useRef } from "react";
import { useLocation } from "../../context/LocationContext";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

function LocationMarker({ latLon, address, imageUrl }) {
  return latLon ? (
    <Marker position={[latLon.lat, latLon.lon]}>
      <Popup>
        <div style={{ textAlign: "center" }}>
          <p>{address}</p>
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Location"
              style={{
                width: "100%", // Ensure it takes up full width of popup
                maxHeight: "200px", // Limit max height
                objectFit: "cover", // Ensure it doesn't stretch
                borderRadius: "8px",
              }}
            />
          )}
        </div>
      </Popup>
    </Marker>
  ) : null;
}

function ClickMapHandler({ setLatLon, setFullAddress, setLocation }) {
  useMapEvents({
    click: async (e) => {
      const lat = e.latlng.lat;
      const lon = e.latlng.lng;
      setLatLon({ lat, lon });

      try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`;
        const res = await fetch(url, {
          headers: { "User-Agent": "location-app" },
        });
        const data = await res.json();

        if (data && data.address) {
          const address = data.address;
          const fullAddress = data.display_name;
          const city = address.city || address.town || address.village || "";
          const state = address.state || "";
          const country = address.country || "";

          setFullAddress(fullAddress);
          setLocation({
            lat,
            lon,
            fullAddress,
            city,
            state,
            country,
          });
        }
      } catch (err) {
        console.error("Reverse geocoding error:", err);
      }
    },
  });
  return null;
}

function Setting() {
  const { setLocation } = useLocation();
  const [fullAddress, setFullAddress] = useState("");
  const [latLon, setLatLon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const mapRef = useRef();
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState(null); // New state for image URL

  const handleChange = (e) => {
    setFullAddress(e.target.value);
  };

  const handleForwardGeocode = async () => {
    if (!fullAddress) return;
    setLoading(true);
    setError("");

    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(
        fullAddress
      )}`;
      const res = await fetch(url, {
        headers: { "User-Agent": "location-app" },
      });
      const data = await res.json();

      if (data.length === 0) {
        setError("⚠️ Address not found. Try refining it.");
        return;
      }

      const bestMatch = data[0];
      const lat = parseFloat(bestMatch.lat);
      const lon = parseFloat(bestMatch.lon);
      const address = bestMatch.address;

      const city = address.city || address.town || address.village || "";
      const state = address.state || "";
      const country = address.country || "";

      setLatLon({ lat, lon });
      setFullAddress(bestMatch.display_name);

      // Optionally set an image URL based on the address or location
      setImageUrl("https://example.com/path-to-your-image.jpg"); // Replace with actual image URL

      // Save to global context
      setLocation({
        lat,
        lon,
        fullAddress: bestMatch.display_name,
        city,
        state,
        country,
      });

      const map = mapRef.current;
      if (map) map.setView([lat, lon], 13);
    } catch (err) {
      console.error("Forward geocoding error:", err);
      setError("⚠️ Failed to find location from address.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLocation = () => {
    if (!latLon) {
      setError("⚠️ Please select a location from map or address first.");
      return;
    }

    navigate("/"); // Done! Context already saved
  };

  return (
    <div className="relative h-screen w-full overflow-auto bg-gradient-to-br from-indigo-900 via-black to-purple-900 text-white">
      <div className="max-w-2xl mx-auto p-6 space-y-4">
        <h2 className="text-3xl font-bold text-center flex items-center justify-center gap-2">
          <FaMapMarkerAlt className="text-red-500" />
          Set Your Exact Location
        </h2>

        <div className="h-[300px] w-full rounded-xl overflow-hidden shadow border border-white z-0">
          <MapContainer
            center={[29.6857, 76.9905]}
            zoom={10}
            className="h-full w-full z-0"
            whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <ClickMapHandler
              setLatLon={setLatLon}
              setFullAddress={setFullAddress}
              setLocation={setLocation}
            />
            <LocationMarker latLon={latLon} address={fullAddress} imageUrl={imageUrl} />
          </MapContainer>
        </div>

        {/* Full Address Input */}
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Enter full address (e.g. Danialpur, Karnal, Haryana)"
            value={fullAddress}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-gray-500 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleForwardGeocode}
            disabled={loading || !fullAddress}
            className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            Find Location from Address
          </button>
        </div>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        <button
          onClick={handleSaveLocation}
          className="w-full py-3 rounded-xl font-semibold bg-green-600 hover:bg-green-700"
        >
          ✅ Save Location
        </button>
      </div>
    </div>
  );
}

export default Setting;
