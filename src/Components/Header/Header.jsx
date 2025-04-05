import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useLocation } from "../../context/LocationContext";
import { Menu, X } from "lucide-react"; // Optional: for icons

function Header() {
  const { location } = useLocation();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="shadow sticky z-50 top-0 bg-white">
      <nav className="border-gray-200 px-4 lg:px-6 py-2.5">
        <div className="flex justify-between items-center mx-auto max-w-screen-xl">
          {/* Logo + Title */}
          <div className="flex items-center gap-3">
            <Link to="/">
              <svg
                className="w-12 h-12 text-yellow-400 animate-pulse"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="5" className="fill-current" />
                <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="12" y1="2" x2="12" y2="5" />
                  <line x1="12" y1="19" x2="12" y2="22" />
                  <line x1="2" y1="12" x2="5" y2="12" />
                  <line x1="19" y1="12" x2="22" y2="12" />
                  <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
                  <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
                  <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
                  <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
                </g>
              </svg>
            </Link>
            <h2 className="text-3xl font-medium italic text-black">Weather</h2>
          </div>

          {/* Mobile Menu Toggle (<=1024px only) */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-800 focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {/* Location/Settings Button */}
          <div className="hidden lg:flex items-center lg:order-2">
            <Link
              to="/Setting"
              className="text-white bg-blue-900 hover:bg-blue-950 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
            >
              {location.city}/{location.country}
            </Link>
          </div>

          {/* Desktop Nav Menu (only ≥1024px) */}
          <div className="hidden lg:flex justify-between items-center w-full lg:w-auto lg:order-1">
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              {[
                { path: "/", label: "Home" },
                { path: "/Forecast", label: "Forecast" },
                { path: "/WeeklyWeather", label: "WeeklyWeather" },
                { path: "/Alert", label: "Radar Alert" },
                { path: "/EarthQuick-Alert", label: "Earthquick & Tsunami Alert" },
              ].map(({ path, label }) => (
                <li key={path}>
                  <NavLink
                    to={path}
                    className={({ isActive }) =>
                      `block py-2 pr-4 pl-3 duration-200 ${
                        isActive ? "text-blue-700" : "text-gray-700"
                      } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-blue-700 lg:p-0`
                    }
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Mobile Dropdown Nav (<=1024px only) */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-3 bg-white shadow-md rounded-md p-4 space-y-2">
            {[
              { path: "/", label: "Home" },
              { path: "/Forecast", label: "Forecast" },
              { path: "/WeeklyWeather", label: "WeeklyWeather" },
              { path: "/Alert", label: "Radar Alert" },
              { path: "/EarthQuick-Alert", label: "Earthquick & Tsunami Alert" },
              { path: "/Setting", label: `${location.city}/${location.country}` },
            ].map(({ path, label }) => (
              <NavLink
                key={path}
                to={path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block w-full text-left px-4 py-2 rounded hover:bg-blue-100 ${
                    isActive ? "text-blue-700 font-semibold" : "text-gray-800"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;
