import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Home, Building, User, HelpCircle, MapPin, Phone, Mail, Shield } from "lucide-react";
import { motion } from "framer-motion";
import Footer from "../components/Footer";
import PreLoader from "../components/PreLoader";

const HomePage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  const handleChoice = (userType) => {
    setIsLoading(true); // Show loader when navigating
    navigate(`/${userType}`);
  };

  const navItems = [
    { name: "Home", icon: <Home className="w-5 h-5" />, path: "/" },
    { name: "Properties", icon: <Building className="w-5 h-5" />, path: "/#" },
    { name: "About", icon: <HelpCircle className="w-5 h-5" />, path: "/#" },
    { name: "Find a Room", path: "/tenant" },
    { name: "List a Room", path: "/landlord" },
  ];

  if (isLoading) {
    return <PreLoader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center"
            >
              <Link>
                <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-orange-500">
                  RentOrbit
                </span>
              </Link>
            </motion.div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.path}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${item.name.includes("Find")
                    ? "text-white bg-orange-600 hover:bg-orange-700 hover:scale-[1.05]"
                    : item.name.includes("List")
                      ? "text-white bg-purple-600 hover:bg-purple-700 hover:scale-[1.05]"
                      : "text-white-700 hover:text-gray-900"
                    }`}
                >
                  {item.icon}
                  <span className="ml-2">{item.name}</span>
                </motion.a>
              ))}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-orange-600 focus:outline-none"
              >
                <svg
                  className={`${isMenuOpen ? "hidden" : "block"} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                <svg
                  className={`${isMenuOpen ? "block" : "hidden"} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
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
        </div>

        {/* Mobile Menu */}
        <div className={`${isMenuOpen ? "block" : "hidden"} md:hidden bg-white`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.path}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${item.name.includes("Find")
                  ? "text-white bg-orange-600 hover:bg-orange-700"
                  : item.name.includes("List")
                    ? "text-white bg-purple-600 hover:bg-purple-700"
                    : "text-white-700 hover:text-gray-900"
                  }`}
              >
                {item.icon}
                <span className="ml-2">{item.name}</span>
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-3xl md:text-6xl font-bold text-gray-900 mb-6">
                Direct Rental Connections <br />
                <span className="mt-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-purple-600">
                  #MadeSimple
                </span>
              </h1>
              <p className="text-sm md:text-xl text-gray-600 max-w-3xl mx-auto mb-10">
                RentOrbit connects tenants with landlords directly - no middlemen, no hassle.
                Start your rental journey today.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex justify-center"
            >
              <button
                onClick={() => setShowPopup(true)}
                className="bg-gradient-to-r from-orange-500 to-purple-500 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-medium text-lg"
              >
                Get Started
              </button>
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">How RentOrbit Works</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our platform makes the rental process simple and transparent for everyone.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "For Tenants",
                  steps: [
                    "Browse verified rental listings",
                    "Filter by location, price, and amenities",
                    "Contact landlords directly",
                    "Schedule viewings easily"
                  ],
                  icon: <User className="w-10 h-10 text-orange-600" />,
                  color: "orange"
                },
                {
                  title: "For Landlords",
                  steps: [
                    "List your property in minutes",
                    "Showcase with photos and details",
                    "Receive inquiries directly",
                    "Manage all your properties in one place"
                  ],
                  icon: <Building className="w-10 h-10 text-purple-600" />,
                  color: "purple"
                },
                {
                  title: "Our Promise",
                  steps: [
                    "No hidden fees",
                    "Direct communication",
                    "Verified listings",
                    "Simple and secure platform"
                  ],
                  icon: <Shield className="w-10 h-10 text-green-600" />,
                  color: "green"
                }
              ].map((column, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className={`bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border-t-4 ${column.color === "orange"
                    ? "border-orange-500"
                    : column.color === "purple"
                      ? "border-purple-500"
                      : "border-green-500"
                    }`}
                >
                  <div className="flex justify-center mb-6">
                    {column.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">{column.title}</h3>
                  <ul className="space-y-3">
                    {column.steps.map((step, i) => (
                      <li key={i} className="flex items-start text-gray-600">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Don't just take our word for it - hear from our community.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  quote: "Found my perfect apartment in just 3 days! The direct communication with landlords made the process so smooth.",
                  name: "Sarah Johnson",
                  role: "Tenant"
                },
                {
                  quote: "As a landlord, I love how easy it is to list properties and communicate with potential tenants.",
                  name: "Michael Chen",
                  role: "Landlord"
                },
                {
                  quote: "No more dealing with brokers. RentOrbit saved me time and money when looking for my new place.",
                  name: "David Wilson",
                  role: "Tenant"
                }
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white p-8 rounded-xl shadow-sm"
                >
                  <div className="text-gray-600 mb-6 italic">
                    "{testimonial.quote}"
                  </div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-500 text-sm">{testimonial.role}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-orange-500 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6">Ready to Simplify Your Rental Experience?</h2>
              <p className="text-orange-100 max-w-2xl mx-auto mb-8">
                Join thousands of tenants and landlords who are already using RentOrbit to connect directly.
              </p>
              <button
                onClick={() => setShowPopup(true)}
                className="bg-white text-orange-600 px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-medium"
              >
                Get Started Now
              </button>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <div className="mb-3">
        <Footer />
      </div>

      {/* Popup */}
      {showPopup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg shadow-2xl p-8 w-11/12 max-w-md relative"
          >
            <div className="space-y-6 text-center">
              <h1 className="text-3xl font-bold text-gray-800">Welcome to RentOrbit!</h1>
              <p className="text-gray-600">Are you looking for a place to rent or do you have a property to list?</p>
              <div className="flex flex-col space-y-4">
                <button
                  onClick={() => handleChoice("tenant")}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  I'm a Tenant
                </button>
                <button
                  onClick={() => handleChoice("landlord")}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  I'm a Landlord
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
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default HomePage;