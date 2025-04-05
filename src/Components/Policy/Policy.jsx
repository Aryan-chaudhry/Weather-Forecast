import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function PrivacyPolicy() {
  const [isAccepted, setIsAccepted] = useState(false);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (isAccepted) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6 relative">
      <motion.h1
        className="text-5xl font-extrabold text-center text-blue-400 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        🔒 Privacy Policy
      </motion.h1>

      <motion.p
        className="text-lg text-gray-300 max-w-3xl text-center mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        Your privacy is our priority. This weather app ensures your data is secure and only used to enhance your experience. We do not store or share any personal information.
      </motion.p>

      <motion.div
        className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 max-w-4xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-2xl font-bold text-blue-400 mb-4">📜 Policy Highlights</h2>
        <ul className="text-gray-300 text-lg space-y-3">
          <li>✅ We do not collect or store personal data.</li>
          <li>✅ Your location is only used to fetch weather information.</li>
          <li>✅ No third-party tracking or advertising.</li>
          <li>✅ Secure and encrypted API requests.</li>
        </ul>
      </motion.div>

      <motion.div
        className="mt-8 flex items-center space-x-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <input
          type="checkbox"
          id="accept"
          checked={isAccepted}
          onChange={() => setIsAccepted(!isAccepted)}
          className="hidden"
        />
        <div
          onClick={() => setIsAccepted(!isAccepted)}
          className={`w-7 h-7 flex items-center justify-center border-2 border-gray-500 rounded-lg cursor-pointer transition-all ${isAccepted ? "border-blue-500 bg-blue-500" : ""}`}
        >
          {isAccepted && <motion.div className="w-4 h-4 bg-white rounded-sm" layoutId="check" />}
        </div>
        <label htmlFor="accept" className="text-lg text-gray-300 cursor-pointer">
          I have read and agree to the Privacy Policy
        </label>
      </motion.div>

      <motion.button
        onClick={handleContinue}
        className={`mt-6 px-6 py-3 rounded-lg text-lg font-bold transition-all duration-300 ${isAccepted ? "bg-blue-500 hover:bg-blue-600 animate-pulse" : "bg-gray-600 cursor-not-allowed"}`}
        disabled={!isAccepted}
        whileTap={{ scale: 0.95 }}
      >
        Continue
      </motion.button>
    </div>
  );
}

export default PrivacyPolicy;