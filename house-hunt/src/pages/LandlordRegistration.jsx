import React from "react";
import { useNavigate } from "react-router-dom";

const LandlordRegistration = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-6xl">
        {/* Registration Form */}
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Landlord Registration</h2>
          <form className="space-y-5">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-400"
            />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-400"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-400"
            />
            <input
              type="text"
              placeholder="Property Location"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-400"
            />
            <button
              type="submit"
              className="w-full bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors duration-300"
            >
              Register Now
            </button>
          </form>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-gray-400 text-white px-6 py-3 rounded-lg mt-4 hover:bg-gray-500 transition-colors duration-300"
          >
            Go Back
          </button>
        </div>

        {/* Information Section */}
        <div className="space-y-12">
          {/* Hero Section */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">List Your Property with Ease</h1>
            <p className="text-gray-600 text-lg">
              Join our platform to connect with thousands of potential tenants. Register now to list your property, manage bookings, and grow your rental business.
            </p>
          </div>

          {/* Benefits Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Why List with Us?</h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-800">Wide Reach</h3>
                <p className="text-gray-600">Connect with thousands of verified tenants.</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-800">Easy Management</h3>
                <p className="text-gray-600">Manage your listings and bookings effortlessly.</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-800">Secure Payments</h3>
                <p className="text-gray-600">Enjoy hassle-free and secure payment processing.</p>
              </div>
            </div>
          </div>

          {/* Testimonials Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">What Our Landlords Say</h2>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <p className="text-gray-600 italic">"Listing my property was so easy, and I found tenants within a week!"</p>
                <p className="text-gray-800 font-semibold mt-2">- Emily R.</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <p className="text-gray-600 italic">"The platform helped me grow my rental business significantly."</p>
                <p className="text-gray-800 font-semibold mt-2">- Michael S.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandlordRegistration;