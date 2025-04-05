import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function TermsAndConditions({ onAccept }) {
  const [isChecked, setIsChecked] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate(); // Hook for navigation

  const handleAccept = () => {
    if (isChecked) {
      setIsVisible(false);
      if (onAccept) onAccept(); // Prevents error if onAccept is not provided
      navigate("/PrivacyPolicy"); // Redirects to Privacy Policy page
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <motion.div 
        className="bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-700 max-w-lg text-center text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-4 text-yellow-400">Terms & Conditions</h2>
        <p className="text-gray-300 mb-4 text-sm">
          By using this application, you agree to our terms and conditions, which include data usage policies, weather information disclaimers, and limitations of liability.
        </p>
        <div className="flex items-center justify-center mb-4">
          <input 
            type="checkbox" 
            id="agree"
            checked={isChecked} 
            onChange={() => setIsChecked(!isChecked)} 
            className="mr-2 w-5 h-5" 
          />
          <label htmlFor="agree" className="text-gray-300 text-sm">I agree to the terms and conditions</label>
        </div>
        <button 
          className={`px-5 py-2 rounded-lg font-bold transition duration-300 ${isChecked ? "bg-green-500 hover:bg-green-600" : "bg-gray-500 cursor-not-allowed"}`} 
          disabled={!isChecked} 
          onClick={handleAccept}
        >
          Accept
        </button>
      </motion.div>
    </div>
  );
}

export default TermsAndConditions;
