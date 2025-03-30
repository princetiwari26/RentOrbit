import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { Eye, EyeOff } from 'lucide-react';
import Notification from '../components/Notification';

const TenantRegistration = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({ password: '', confirmPassword: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
      const response = await axios.post("http://localhost:8000/api/tenants/login", {
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

  const handleRegister = async () => {
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

      await axios.post("http://localhost:8000/api/tenants/register", formData);
      setNotification({ message: 'Registration successful! Please login.', type: 'success' });
      setIsLogin(true);
      setFormData({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
      setErrors({});
    } catch (error) {
      setNotification({ message: error.response?.data?.message || 'Registration failed', type: 'error' });
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({ name: '', email: '', phone: '', password: '' });
  };


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

        {/* Registration/Login Form */}
        <div className="bg-white p-8 rounded-2xl shadow-xl transition-all duration-500 ease-in-out">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            {isLogin ? "Tenant Login" : "Tenant Registration"}
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
                    required
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300 rounded"
                    />
                    <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>
                  <button
                    type="button"
                    className="text-sm text-blue-500 hover:text-blue-600 font-medium"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-purple-800 text-white font-semibold px-4 py-2 rounded-lg hover:from-purple-800 hover:to-purple-600 focus:outline-none"
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
                  />
                </div>

                <div className="relative">
  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
    Password <span className="text-red-500">*</span>
  </label>
  <input
    type={showPassword ? "text" : "password"}
    id="password"
    name="password"
    value={formData.password}
    onChange={handleChange}
    placeholder="••••••••"
    className={`w-full p-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
    required
  />
  <button
    type="button"
    onClick={() => setShowPassword((prev) => !prev)}
    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
  >
    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
  </button>
  {errors.password && (
    <p className="text-red-500 text-xs mt-1">{errors.password}</p>
  )}
  <p className="mt-1 text-xs text-gray-500">
    Password must be at least 8 characters long
  </p>
</div>

<div className="relative">
  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
    Confirm Password <span className="text-red-500">*</span>
  </label>
  <input
    type={showConfirmPassword ? "text" : "password"}
    id="confirmPassword"
    name="confirmPassword"
    value={formData.confirmPassword}
    onChange={handleChange}
    placeholder="••••••••"
    className={`w-full p-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
    required
  />
  <button
    type="button"
    onClick={() => setShowConfirmPassword((prev) => !prev)}
    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
  >
    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
  </button>
  {errors.confirmPassword && (
    <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
  )}
</div>



                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="terms"
                    className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300 rounded"
                    required
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                    I agree to the <a href="#" className="text-blue-500 hover:text-blue-600">Terms of Service</a> and <a href="#" className="text-blue-500 hover:text-blue-600">Privacy Policy</a>
                  </label>
                </div>

                <button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-purple-800 text-white font-semibold px-4 py-2 rounded-lg hover:from-purple-800 hover:to-purple-600 focus:outline-none"
                >
                  Create Account
                </button>
              </>
            )}
          </form>


          <p className="text-center mt-3 text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={toggleForm}
              className="text-blue-500 hover:text-blue-600 font-semibold focus:outline-none hover:underline"
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
      </div>

      {notification.message && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification({ message: '', type: '' })}
        />
      )}


    </div>
  );
};

export default TenantRegistration;