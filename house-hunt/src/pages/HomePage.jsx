import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const HomePage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleChoice = (userType) => {
    setShowPopup(false); // Close the popup
    if (userType === "tenant") {
      navigate("/tenant-registration"); // Navigate to Tenant Registration
    } else if (userType === "landlord") {
      navigate("/landlord-registration"); // Navigate to Landlord Registration
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Welcome to Our Rental Platform in <span className="text-blue-800 cursor-pointer">RentOrbit</span>
        </h1>
        <p className="text-gray-600 text-lg">
          Find your perfect home or list your property with ease.
        </p>
      </div>

      {/* Call-to-Action Section */}
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Get Started Today
        </h2>
        <p className="text-gray-600 mb-6">
          Join our platform as a tenant or landlord to unlock amazing features.
        </p>
        <button
          onClick={() => setShowPopup(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          Get Started
        </button>
      </div>

      <Footer/>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-2xl p-8 w-11/12 max-w-md transform transition-all duration-500 ease-in-out animate-fade-in">
            <div className="space-y-6 text-center">
              <h1 className="text-3xl font-bold text-gray-800">Welcome!</h1>
              <p className="text-gray-600">Are you a tenant or a landlord?</p>
              <div className="flex flex-col space-y-4">
                <button
                  onClick={() => handleChoice("tenant")}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  I am a Tenant
                </button>
                <button
                  onClick={() => handleChoice("landlord")}
                  className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  I am a Landlord
                </button>
              </div>
            </div>
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;