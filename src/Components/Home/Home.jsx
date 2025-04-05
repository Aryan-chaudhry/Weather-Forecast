import React, { useEffect, useState } from "react";
import { useLocation } from "../../context/LocationContext";

function Weather() {
  const [weather, setWeather] = useState(null);
  // const LAT = 29.6857; // Latitude for Karnal
  // const LON = 76.9905; // Longitude for Karnal

  const { location } = useLocation();
  const LAT = location.lat;
  const LON = location.lon;
  const CITY = location.city;
  const STATE = location.state;
  const COUNTRY = location.country;

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = () => {
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,cloudcover&timezone=auto`)
      .then((response) => response.json())
      .then((data) => {
        const currentTime = new Date();
        const hours = currentTime.getHours();
        const isNight = hours >= 18 || hours < 6; // Nighttime: 6 PM to 6 AM

        const newWeather = {
          city: CITY,
          country: COUNTRY,
          temperature: data.current.temperature_2m,
          humidity: data.current.relative_humidity_2m,
          windSpeed: data.current.wind_speed_10m,
          cloudCover: data.current.cloudcover,
          time: currentTime.toLocaleTimeString(),
          weatherCondition: data.current.cloudcover > 50 ? "Cloudy" : "Clear",
          isNight: isNight,
        };

        setWeather(newWeather);
      })
      .catch((error) => console.error("Error fetching weather data:", error));
  };

  if (!weather) {
    return (
      <div className="h-screen flex justify-center items-center bg-gradient-to-b from-gray-900 to-black text-white text-4xl font-bold">
        Loading Weather...
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-r from-gray-800 to-black text-white p-6 relative overflow-hidden">
      {weather.weatherCondition.includes("Cloud") && <div className="absolute inset-0 bg-gray-500 opacity-20 animate-clouds"></div>}
      {weather.weatherCondition.includes("Clear") && <div className="absolute inset-0 bg-transparent animate-sun"></div>}

      <h2 className="text-5xl font-extrabold tracking-wide mb-8"> Weather Forecast</h2>
      <div className="grid grid-cols-2 gap-6 w-full max-w-4xl">
        <div className="col-span-2 bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-lg text-center relative">
          <h3 className="text-3xl font-bold">{weather.city}, {weather.country}</h3>
          {weather.isNight ? <span className="text-6xl">🌙</span> : <span className="text-6xl">☀️</span>}
          <p className="text-2xl font-semibold text-yellow-400">{weather.temperature}°C</p>
          <p className="text-lg text-gray-300">{weather.weatherCondition}</p>
        </div>

        <div className="bg-white/10 p-6 rounded-xl shadow-lg text-center">
          <p className="text-xl font-semibold">🌡 Temperature</p>
          <p className="text-2xl text-yellow-400">{weather.temperature}°C</p>
        </div>

        <div className="bg-white/10 p-6 rounded-xl shadow-lg text-center">
          <p className="text-xl font-semibold">💨 Wind Speed</p>
          <p className="text-2xl text-blue-400">{weather.windSpeed} m/s</p>
        </div>

        <div className="bg-white/10 p-6 rounded-xl shadow-lg text-center">
          <p className="text-xl font-semibold">💧 Humidity</p>
          <p className="text-2xl text-green-400">{weather.humidity}%</p>
        </div>

        <div className="bg-white/10 p-6 rounded-xl shadow-lg text-center">
          <p className="text-xl font-semibold">🕒 Current Time</p>
          <p className="text-2xl text-purple-400">{weather.time}</p>
        </div>
      </div>
    </div>
  );
}

export default Weather;
