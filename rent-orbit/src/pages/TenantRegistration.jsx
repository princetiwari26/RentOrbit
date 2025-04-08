import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Eye, EyeOff, Home, User, Mail, Phone, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import Notification from '../components/Notification';

const TenantRegistration = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true); // Start with login form first
  const [showContent, setShowContent] = useState(false); // Controls when to show the info content
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Show content section after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Check for remembered credentials
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setFormData(prev => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!isLogin) {
      if (!formData.name.trim()) {
        newErrors.name = "Full name is required";
      }
      
      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required";
      } else if (!/^[0-9]{10,15}$/.test(formData.phone)) {
        newErrors.phone = "Invalid phone number";
      }
    }
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }
    
    try {
      if (isLogin) {
        const response = await axios.post("http://localhost:8000/api/tenants/login", {
          email: formData.email,
          password: formData.password,
        });
        
        localStorage.setItem("token", response.data.token);
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', formData.email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }
        
        setNotification({ message: 'Login successful! Redirecting...', type: 'success' });
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        await axios.post("http://localhost:8000/api/tenants/register", formData);
        setNotification({ 
          message: 'Registration successful! Please login.', 
          type: 'success' 
        });
        setIsLogin(true);
        setFormData(prev => ({ 
          ...prev, 
          name: '', 
          phone: '', 
          password: '', 
          confirmPassword: '' 
        }));
      }
    } catch (error) {
      let errorMessage = 'An error occurred. Please try again.';
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Invalid email or password';
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      }
      setNotification({ message: errorMessage, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setNotification({ message: '', type: '' });
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.8,
        delay: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 md:p-8">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12">
          {/* Form Section - Shows first */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={formVariants}
            className="w-full"
          >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6 sm:p-8 md:p-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <Home className="h-8 w-8 text-purple-600 mr-2" />
                    <span className="text-2xl font-bold text-gray-800">RentalHub</span>
                  </div>
                  <button
                    onClick={() => navigate("/")}
                    className="text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors"
                  >
                    Back to Home
                  </button>
                </div>

                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  {isLogin ? "Welcome back!" : "Join RentalHub"}
                </h2>
                <p className="text-gray-600 mb-8">
                  {isLogin ? "Sign in to access your account" : "Create your free account"}
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {!isLogin && (
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          className={`w-full pl-10 pr-3 py-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400`}
                        />
                      </div>
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" /> {errors.name}
                        </p>
                      )}
                    </div>
                  )}

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        className={`w-full pl-10 pr-3 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400`}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" /> {errors.email}
                      </p>
                    )}
                  </div>

                  {!isLogin && (
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+1 (123) 456-7890"
                          className={`w-full pl-10 pr-3 py-3 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400`}
                        />
                      </div>
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" /> {errors.phone}
                        </p>
                      )}
                    </div>
                  )}

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className={`w-full pl-10 pr-10 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" /> {errors.password}
                      </p>
                    )}
                    {!isLogin && (
                      <p className="mt-1 text-xs text-gray-500">
                        Password must be at least 8 characters long
                      </p>
                    )}
                  </div>

                  {!isLogin && (
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="••••••••"
                          className={`w-full pl-10 pr-10 py-3 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" /> {errors.confirmPassword}
                        </p>
                      )}
                    </div>
                  )}

                  {isLogin && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="rememberMe"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                          Remember me
                        </label>
                      </div>
                      <button
                        type="button"
                        className="text-sm font-medium text-purple-600 hover:text-purple-700"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}

                  {!isLogin && (
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          type="checkbox"
                          id="terms"
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                          required
                        />
                      </div>
                      <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                        I agree to the <a href="#" className="font-medium text-purple-600 hover:text-purple-700">Terms of Service</a> and <a href="#" className="font-medium text-purple-600 hover:text-purple-700">Privacy Policy</a>
                      </label>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white font-medium bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : isLogin ? "Sign In" : "Create Account"}
                  </button>
                </form>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">
                        {isLogin ? "New to RentalHub?" : "Already have an account?"}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={toggleForm}
                    className="mt-4 w-full flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-300"
                  >
                    {isLogin ? "Create your account" : "Sign in to your account"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content Section - Shows after a delay */}
          {showContent && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={contentVariants}
              className="w-full"
            >
              <div className="h-full flex flex-col justify-center px-4 sm:px-6 lg:px-8">
                <div className="space-y-10">
                  {/* Hero Section */}
                  <div className="text-center sm:text-left">
                    <motion.h1 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-4xl sm:text-5xl font-bold text-gray-800 mb-6 leading-tight"
                    >
                      Find Your Perfect Home
                    </motion.h1>
                    <motion.p 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="text-lg sm:text-xl text-gray-600 max-w-2xl"
                    >
                      Join thousands of tenants who have found their dream homes through our platform. 
                      Register now to get access to exclusive listings, personalized recommendations, 
                      and premium rental services.
                    </motion.p>
                  </div>

                  {/* Benefits Section */}
                  <div className="space-y-6">
                    <motion.h2 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="text-2xl sm:text-3xl font-bold text-gray-800"
                    >
                      Why Choose RentalHub?
                    </motion.h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        {
                          title: "Exclusive Listings",
                          description: "Access premium properties not available on other platforms.",
                          icon: "🔍"
                        },
                        {
                          title: "Smart Matching",
                          description: "Our algorithm finds properties that match your exact needs.",
                          icon: "🤖"
                        },
                        {
                          title: "Verified Landlords",
                          description: "All property owners are thoroughly vetted for your safety.",
                          icon: "✅"
                        },
                        {
                          title: "24/7 Support",
                          description: "Our team is always available to assist you.",
                          icon: "🛟"
                        }
                      ].map((benefit, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.9 + index * 0.1 }}
                          className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
                        >
                          <div className="flex items-start">
                            <span className="text-2xl mr-4">{benefit.icon}</span>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-800 mb-1">{benefit.title}</h3>
                              <p className="text-gray-600">{benefit.description}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {notification.message && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Notification
              type={notification.type}
              message={notification.message}
              onClose={() => setNotification({ message: '', type: '' })}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TenantRegistration;