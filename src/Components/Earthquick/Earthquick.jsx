import React, { useEffect, useRef, useState } from "react";
import Globe from "react-globe.gl";
import { motion } from "framer-motion";

function EarthquakeTsunamiAlert() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const globeRef = useRef();

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10 * 60 * 1000); // refresh every 10 minutes
    return () => clearInterval(interval);
  }, []);

  const fetchData = () => {
    fetch("https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&limit=200&orderby=time")
      .then((response) => response.json())
      .then((data) => {
        const now = new Date();
        const filteredData = data.features
          .map((event) => {
            const eventTime = new Date(event.properties.time);
            const ageInHours = (now - eventTime) / (1000 * 60 * 60);
            if (ageInHours > 24) return null;

            const alertLevel = (event.properties.alert || "unknown").toLowerCase();
            const alertColor =
              alertLevel === "red"
                ? "red"
                : alertLevel === "orange"
                ? "orange"
                : alertLevel === "yellow"
                ? "yellow"
                : "blue";

            return {
              id: event.id,
              place: event.properties.place || "Unknown",
              magnitude: event.properties.mag || "N/A",
              time: eventTime.toLocaleString(),
              type: event.properties.tsunami === 1 ? "tsunami" : "earthquake",
              depth: event.geometry.coordinates[2] || "N/A",
              lat: event.geometry.coordinates[1],
              lon: event.geometry.coordinates[0],
              alert: alertLevel !== "unknown" ? alertLevel : "No Alert",
              url: event.properties.url || "#",
              color: alertColor,
              image:
                event.properties.tsunami === 1
                  ? "https://cdn.pixabay.com/photo/2023/01/29/08/26/photo-7752696_1280.jpg"
                  : "https://media.npr.org/assets/img/2023/02/07/gettyimages-1463708921-b8f2a1bd09728cec7da659c02d5432eddea89db4-s1100-c50.jpg",
            };
          })
          .filter(Boolean);
        setData(filteredData);
        setCurrentPage(1);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  useEffect(() => {
    const updateZoomAndItemsPerPage = () => {
      const isMobile = window.innerWidth < 1025;
      if (globeRef.current && globeRef.current.camera()) {
        globeRef.current.camera().position.z = isMobile ? 1000 : 300;
      }
      setItemsPerPage(isMobile ? 5 : 12);
    };

    updateZoomAndItemsPerPage();
    window.addEventListener("resize", updateZoomAndItemsPerPage);
    return () => window.removeEventListener("resize", updateZoomAndItemsPerPage);
  }, []);

  const filteredData = data.filter((event) => filter === "all" || event.type === filter);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-black text-white px-4 py-6 lg:px-12 lg:py-10">
      <h2 className="text-2xl lg:text-4xl font-extrabold text-center mb-6 lg:mb-10 drop-shadow-md tracking-wide">
         Earthquake & Tsunami Alerts (Past 24 Hours)
      </h2>

      <select
        className="p-3 mb-6 rounded-md bg-gray-800 text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-700 w-full max-w-xs"
        onChange={(e) => {
          setFilter(e.target.value);
          setCurrentPage(1);
        }}
      >
        <option value="all">All</option>
        <option value="earthquake">Earthquakes</option>
        <option value="tsunami">Tsunamis</option>
      </select>
<br /><br />
      {/* Globe section hidden on screens < 1025px */}
      <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] mb-8 hidden lg:flex justify-center items-center">
        <Globe
          ref={globeRef}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
          pointsData={filteredData}
          pointLat={(d) => d.lat}
          pointLng={(d) => d.lon}
          pointColor={(d) => d.color}
          pointRadius={(d) => Math.max(0.5, d.magnitude * 0.5)}
          pointAltitude={() => 0.1}
          pointLabel={(d) => `${d.place} | Mag: ${d.magnitude}`}
          onPointClick={(event) => window.open(event.url, "_blank")}
          animateIn={true}
        />
      </div>
<br /><br />
      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl">
        {paginatedData.length > 0 ? (
          paginatedData.map((event) => (
            <motion.div
              key={event.id}
              whileHover={{ scale: 1.05 }}
              className="relative p-6 rounded-xl shadow-xl bg-gray-900 border border-gray-700 overflow-hidden cursor-pointer transition-transform hover:shadow-2xl"
              onClick={() => window.open(event.url, "_blank")}
            >
              <img
                src={event.image}
                alt={event.type}
                className="absolute inset-0 w-full h-full object-cover opacity-20 blur-sm"
              />
              <div className="relative z-10 bg-black/60 p-4 rounded-xl">
                <h3 className="text-xl font-bold text-white">📍 {event.place}</h3>
                <p className="text-red-400">Magnitude: {event.magnitude}</p>
                <p className="text-blue-300">Depth: {event.depth} km</p>
                <p className="text-yellow-400">Alert Level: {event.alert}</p>
                <p className="text-gray-400 text-sm mt-1">{event.time}</p>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-2xl text-gray-400">No recent alerts found for the selected type.</p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex gap-4 mt-8 flex-wrap justify-center items-center">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50"
          >
            ◀ Previous
          </button>
          <span className="text-lg font-semibold">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50"
          >
            Next ▶
          </button>
        </div>
      )}
    </div>
  );
}

export default EarthquakeTsunamiAlert;
