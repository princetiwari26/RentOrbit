import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from 'lucide-react';
import Notification from "../components/Notification";

const LandlordRegistration = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });
  const [notification, setNotification] = useState({message: '', type: ''});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({password: '', confirmPassword: ''})

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      handleLogin();
    } else {
      handleRegister();
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:8000/api/landlord/login", {
        email: formData.email,
        password: formData.password,
      });
      localStorage.setItem("token", response.data.token);
      setNotification({ message: 'Login successful!', type: 'success' });
      navigate("/dashboard");
    } catch (error) {
      setNotification({ message: 'Login failed.', type: 'error' });
    }
  };

  const handleRegister =async () => {
    try {
      const newErrors = {};
      if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters long";
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      await axios.post("http://localhost:8000/api/landlord/register", formData);
      setNotification({ message: 'Registratin successfully! Please login.', type: 'success'});
      setIsLogin(true);
      setFormData({name: '', email: '', phone: '', address: '', password: '', confirmPassword: ''});
      setErrors({});
    } catch (error) {
      setNotification({message: error.response?.data?.message || 'Registration failed', type: 'error'});
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({ name: '', email: '', phone: '', password: '' });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-6xl">
        {/* Registration/Login Form */}
        <div className="bg-white p-8 rounded-2xl shadow-xl transition-all duration-500 ease-in-out">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            {isLogin ? "Landlord Login" : "Landlord Registration"}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {isLogin ? (
              <>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-400"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-400"
                    required
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      className="h-4 w-4 text-green-500 focus:ring-green-400 border-gray-300 rounded"
                    />
                    <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>
                  <button
                    type="button"
                    className="text-sm text-green-500 hover:text-green-600 font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
                
                <button
                  type="submit"
                  className="bg-gradient-to-r from-green-600 to-green-800 text-white font-semibold px-4 py-2 rounded-lg hover:from-green-800 hover:to-green-600 focus:outline-none"
                >
                  Sign In
                </button>
              </>
            ) : (
              <>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-400"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-400"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 XXXXXXXXXX"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-400"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Address"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-400"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-400"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Password must be at least 8 characters long
                  </p>
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-400"
                    required
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="terms"
                    className="h-4 w-4 text-green-500 focus:ring-green-400 border-gray-300 rounded"
                    required
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                    I agree to the <a href="#" className="text-green-500 hover:text-green-600">Terms of Service</a> and <a href="#" className="text-green-500 hover:text-green-600">Privacy Policy</a>
                  </label>
                </div>
                
                <button
                  type="submit"
                  className="bg-gradient-to-r from-green-600 to-green-800 text-white font-semibold px-4 py-2 rounded-lg hover:from-green-800 hover:to-green-600 focus:outline-none"
                >
                  Register
                </button>
              </>
            )}
          </form>
          
          
          
          <p className="text-center mt-3 text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={toggleForm}
              className="text-green-500 hover:text-green-600 font-semibold focus:outline-none hover:underline"
            >
              {isLogin ? "Register here" : "Sign in"}
            </button>
          </p>
          
          <button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-slate-600 to-slate-800 text-white font-semibold px-4 py-2 mt-2 rounded-lg hover:from-slate-800 hover:to-slate-600 focus:outline-none"
          >
            Back to Home
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
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-800">Detailed Analytics</h3>
                <p className="text-gray-600">Get insights into your property performance.</p>
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
              <div className="bg-white p-4 rounded-lg shadow-md">
                <p className="text-gray-600 italic">"The analytics dashboard helped me optimize my rental prices perfectly."</p>
                <p className="text-gray-800 font-semibold mt-2">- David K.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandlordRegistration;