import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useLocation } from "../../context/LocationContext";

function WeeklyWeather() {
  const [forecast, setForecast] = useState(null);
  const [expandedDay, setExpandedDay] = useState(null);
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [currentMinute, setCurrentMinute] = useState(new Date().getMinutes());
  const scrollRef = useRef(null);
  const cardRefs = useRef([]);
  const { location } = useLocation();
  const LAT = location.lat;
  const LON = location.lon;

  useEffect(() => {
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,cloudcover_mean&hourly=temperature_2m,precipitation&timezone=auto`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.daily && data.hourly) {
          const dailyForecast = data.daily.time.map((date, index) => {
            const fullDate = new Date(date);
            return {
              isToday: new Date().toDateString() === fullDate.toDateString(),
              date: fullDate.toLocaleDateString(undefined, {
                weekday: "long",
                day: "numeric",
                month: "short",
              }),
              tempMax: data.daily.temperature_2m_max[index],
              tempMin: data.daily.temperature_2m_min[index],
              rain: data.daily.precipitation_sum[index],
              clouds: data.daily.cloudcover_mean[index],
              hourlyData: Array.from({ length: 24 }, (_, hourIndex) => ({
                time: `${hourIndex % 12 || 12} ${hourIndex < 12 ? "AM" : "PM"}`,
                temp: data.hourly.temperature_2m[hourIndex + index * 24],
                rain: data.hourly.precipitation[hourIndex + index * 24],
                icon: `https://openweathermap.org/img/wn/${
                  data.hourly.precipitation[hourIndex + index * 24] > 0 ? "09d" : "01d"
                }@2x.png`,
              })),
            };
          });
          setForecast(dailyForecast);
        }
      });
  }, [LAT, LON]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentHour(now.getHours());
      setCurrentMinute(now.getMinutes());
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (expandedDay !== null && scrollRef.current) {
      const currentTimePos =
        ((currentHour * 60 + currentMinute) / 1440) * scrollRef.current.scrollWidth;
      scrollRef.current.scrollTo({ left: currentTimePos - 100, behavior: "smooth" });
    }
  }, [expandedDay, currentHour, currentMinute]);

  if (!forecast) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white text-2xl">
        Loading Forecast...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-900 text-white rounded-lg min-h-screen lg:min-h-0">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center">
        5-Day Weather Forecast
      </h2>

      <div className="space-y-4  sm:space-y-4 sm:space-x-0">
        {forecast.map((day, index) => (
          <div
            key={index}
            ref={(el) => (cardRefs.current[index] = el)}
            className={`cursor-pointer bg-gray-800 hover:bg-gray-700 transition duration-300 rounded-xl ${
              expandedDay === index ? "ring-2 ring-blue-400" : ""
            }`}
            onClick={() => {
              setExpandedDay(expandedDay === index ? null : index);
              setTimeout(() => {
                cardRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "start" });
              }, 100);
            }}
          >
            <div className="flex flex-col sm:flex-row justify-between items-center px-30 py-4 ">
              <div className="text-lg font-semibold flex gap-15 items-center">
                📅 {day.date}
                {day.isToday && (
                  <span className="bg-yellow-400 text-black px-2 py-0.5 rounded-full text-xs ml-2">
                    Today
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-20 justify-center sm:justify-end mt-3 sm:mt-0 text-sm">
                <span className="bg-blue-500/20 px-2 py-1 rounded-full text-blue-300">
                  🌡️ High: {day.tempMax}°C
                </span>
                <span className="bg-blue-500/10 px-2 py-1 rounded-full text-blue-200">
                  🌡️ Low: {day.tempMin}°C
                </span>
                <span className="bg-indigo-400/20 px-2 py-1 rounded-full text-indigo-300">
                  🌧️ Rain: {day.rain > 0 ? `${day.rain}%` : "0%"}
                </span>

                <span className="bg-purple-500/20 px-2 py-1 rounded-full text-purple-300">
                  ☁️ Clouds: {day.clouds > 10 ? `${day.clouds}%` : "Clear"}
                </span>
              </div>
            </div>

            {expandedDay === index && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="relative px-4 pb-4"
              >
                <div
                  ref={scrollRef}
                  className="relative flex overflow-x-auto gap-1 sm:gap-2"
                >
                  {/* Time Pointer */}
                  <div
                    className="absolute top-6 bottom-0 w-0.5 bg-yellow-400 z-30"
                    style={{
                      left: `${((currentHour * 60 + currentMinute) / 1440) * 100}%`,
                      transform: "translateX(-50%)",
                    }}
                  >
                    {/* Time label inside the yellow pointer with black text */}
                    <div
                      className="absolute bottom-full mb-1 w-max mx-auto text-black text-xs px-2 py-1 bg-yellow-400 rounded-md"
                      style={{
                        left: "50%",
                        transform: "translateX(-50%)",
                      }}
                    >
                      {`${currentHour % 12 || 12}:${currentMinute < 10 ? `0${currentMinute}` : currentMinute} ${
                        currentHour < 12 ? "AM" : "PM"
                      }`}
                    </div>
                  </div>
                  

                  {/* Hourly Data */}
                  {day.hourlyData.map((hour, i) => (
                    <div
                      key={i}
                      className="bg-white/10 p-2 rounded-xl text-center text-xs min-w-[60px] sm:min-w-[70px] backdrop-blur-md shadow-md"
                    >
                      <div className="text-gray-300">{hour.time}</div>
                      <img src={hour.icon} alt="icon" className="w-5 h-5 mx-auto my-1" />
                      <div className="text-blue-300">{hour.temp}°C</div>
                      <div className="text-blue-400">
                        {hour.rain > 0 ? `🌧 ${hour.rain} mm` : "🌧️ 0 mm"}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
          
        ))}
      </div>
    </div>
  );
}

export default WeeklyWeather;
