import React from "react";
import { useNavigate } from "react-router-dom";

const TenantRegistration = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-6xl">
        

        {/* Information Section */}
        <div className="space-y-12">
          {/* Hero Section */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Find Your Perfect Home</h1>
            <p className="text-gray-600 text-lg">
              Join thousands of tenants who have found their dream homes through our platform. Register now to get access to exclusive listings, personalized recommendations, and more.
            </p>
          </div>

          {/* Benefits Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Why Register as a Tenant?</h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-800">Exclusive Listings</h3>
                <p className="text-gray-600">Access properties that are not available on other platforms.</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-800">Personalized Matches</h3>
                <p className="text-gray-600">Get recommendations tailored to your preferences.</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-800">Secure Process</h3>
                <p className="text-gray-600">Enjoy a safe and transparent rental process.</p>
              </div>
            </div>
          </div>

          {/* Testimonials Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">What Our Tenants Say</h2>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <p className="text-gray-600 italic">"I found my dream apartment within days of registering. The platform is so easy to use!"</p>
                <p className="text-gray-800 font-semibold mt-2">- Sarah T.</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <p className="text-gray-600 italic">"The personalized recommendations saved me so much time. Highly recommend!"</p>
                <p className="text-gray-800 font-semibold mt-2">- John D.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Tenant Registration</h2>
          <form className="space-y-5">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
            />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
            />
            <input
              type="text"
              placeholder="Preferred Location"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300"
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
      </div>
    </div>
  );
};

export default TenantRegistration;
