import React, { useState, useEffect } from 'react';
import {
  Calendar,
  MapPin,
  User,
  Mail,
  Phone,
  Home,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  Bed,
  Bath,
  Ruler,
  Users,
  Star,
  Heart,
  AlertCircle,
  ChevronRight,
  Building,
  DoorOpen,
  Hash,
  Banknote,
  Shield,
  ScrollText,
  Trash2,
  Frown,
  Smile
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PreLoader from '../../components/PreLoader'
import Notification from '../../components/Notification';
import ErrorHandler from '../../components/ErrorHandler';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      when: "beforeChildren"
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10
    }
  }
};

function TenantRequests() {
  const token = localStorage.getItem("token");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const navigate = useNavigate();

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:8000/api/requests', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      // Filter out confirmed requests
      const filteredRequests = response.data.filter(req => req.status !== 'completed');
      setRequests(filteredRequests);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [token]);

  const handleCancelRequest = async (requestId) => {
    try {
      await axios.put(
        `http://localhost:8000/api/requests/${requestId}`,
        { action: "tenant-cancel" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Optimistically remove the request from UI with animation
      setRequests(prev => prev.filter(req => req._id !== requestId));

      // Show success notification
      setNotification({
        message: 'Request cancelled successfully',
        type: 'success'
      });
    } catch (err) {
      console.error("Error cancelling request:", err);
      setNotification({
        message: err.response?.data?.message || 'Failed to cancel request',
        type: 'error'
      });
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium";

    switch (status) {
      case "confirmed":
        return (
          <motion.span
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className={`${baseClasses} bg-green-100 text-green-800`}
          >
            <CheckCircle className="w-4 h-4 mr-1" />
            Confirmed
          </motion.span>
        );
      case "rejected":
        return (
          <motion.span
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className={`${baseClasses} bg-red-100 text-red-800`}
          >
            <XCircle className="w-4 h-4 mr-1" />
            Rejected
          </motion.span>
        );
      case "cancelled":
        return (
          <motion.span
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className={`${baseClasses} bg-gray-100 text-gray-800`}
          >
            <XCircle className="w-4 h-4 mr-1" />
            Cancelled
          </motion.span>
        );
      case "completed":
        return (
          <motion.span
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className={`${baseClasses} bg-blue-100 text-blue-800`}
          >
            <CheckCircle className="w-4 h-4 mr-1" />
            Completed
          </motion.span>
        );
      default:
        return (
          <motion.span
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className={`${baseClasses} bg-yellow-100 text-yellow-800`}
          >
            <Clock className="w-4 h-4 mr-1" />
            Pending
          </motion.span>
        );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not scheduled yet';
    const options = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const navigateToRoom = (roomId) => {
    navigate(`/rooms/${roomId}`);
  };

  if (loading) {
    return <PreLoader />;
  }

  if (error) {
    return (
      <ErrorHandler
        error={error}
        onRetry={fetchRequests}
        retryText="Try Again"
      />
    );
  }

  if (requests.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="max-w-5xl mx-auto px-4 text-center bg-white"
      >
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
          className="text-gray-400 mb-4 inline-block"
        >
          <Frown className="w-16 h-16 mx-auto" />
        </motion.div>
        <h3 className="text-xl font-medium text-gray-800">No active requests found</h3>
        <p className="mt-2 text-gray-500">
          You don't have any pending visit requests. All confirmed requests are moved to your bookings.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      {/* Notification component */}
      <AnimatePresence>
        {notification.message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Notification
              type={notification.type}
              message={notification.message}
              onClose={() => setNotification({ message: '', type: '' })}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-8 gap-4"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Your Visit Requests</h1>
        <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {requests.length} {requests.length === 1 ? 'request' : 'requests'}
        </div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        <AnimatePresence>
          {requests.map((request) => (
            <motion.div
              key={request._id}
              variants={itemVariants}
              layout
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-all"
            >
              <div className="p-5 md:p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Room Image and Basic Info - Mobile First */}
                  <div className="w-full lg:w-2/5">
                    <motion.div
                      whileHover={{ scale: 0.98 }}
                      className="relative rounded-lg overflow-hidden bg-gray-100 aspect-video cursor-pointer"
                      onClick={() => navigateToRoom(request.room._id)}
                    >
                      <img
                        src={request.room.photos?.[0] || 'https://assets-news.housing.com/news/wp-content/uploads/2023/03/24153828/exterior-design-shutterstock_1932966368-1200x700-compressed.jpg'}
                        alt="Room"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/default-room.jpg';
                        }}
                      />
                      <div className="absolute top-3 left-3">
                        {getStatusBadge(request.status)}
                      </div>
                      <motion.div
                        whileHover={{ opacity: 1 }}
                        className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center"
                      >
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="bg-white bg-opacity-80 rounded-full p-2 shadow-lg"
                        >
                          <ChevronRight className="text-blue-600" />
                        </motion.div>
                      </motion.div>
                    </motion.div>

                    {/* Room Specifications - Grid Layout */}
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      {[
                        { icon: Building, value: request.room.accommodation?.[0] || 'N/A', color: 'blue' },
                        { icon: DoorOpen, value: request.room.roomType?.[0] || 'N/A', color: 'blue' },
                        { icon: Bed, value: `${request.room.bedrooms || 'N/A'} beds`, color: 'indigo' },
                        { icon: Bath, value: `${request.room.bathrooms || 'N/A'} baths`, color: 'indigo' },
                      ].map((item, index) => (
                        <motion.div
                          whileHover={{ y: -2 }}
                          key={index}
                          className={`flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-100`}
                        >
                          <item.icon className={`w-4 h-4 mr-2 text-${item.color}-500`} />
                          {item.value}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Room Details - Flex Layout */}
                  <div className="w-full lg:w-3/5">
                    <div className="flex flex-col h-full">
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                          <div className="flex-1">
                            <motion.h2
                              whileHover={{ x: 2 }}
                              className="text-xl font-semibold text-gray-800 line-clamp-2 cursor-pointer"
                              onClick={() => navigateToRoom(request.room._id)}
                            >
                              {request.room.accommodation?.[0] || 'Accommodation Not Specified'}
                            </motion.h2>
                            <div className="flex items-center mt-1 text-sm text-gray-500">
                              <MapPin className="w-4 h-4 mr-1" />
                              <span className="line-clamp-1">
                                {request.room.address.houseNumber}, {request.room.address.street}, {request.room.address.city}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-start md:items-end gap-2">
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              className="text-lg font-bold text-green-600"
                            >
                              ₹{request.room.rent || '0'}<span className="text-sm font-normal text-gray-500">/{request.room.paymentPlan?.toLowerCase() || 'month'}</span>
                            </motion.div>
                            {request.room.deposit && (
                              <div className="text-xs text-gray-500 flex items-center">
                                <Banknote className="w-3 h-3 mr-1" />
                                Deposit: {request.room.deposit}
                              </div>
                            )}
                            <div className="md:hidden">
                              {getStatusBadge(request.status)}
                            </div>
                          </div>
                        </div>

                        {/* Room Description */}
                        <div className="mt-4">
                          <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                            <ScrollText className="w-4 h-4 mr-2 text-blue-500" />
                            Description
                          </h3>
                          <p className="text-gray-600 text-sm line-clamp-3">
                            {request.room.description || 'No description provided for this room.'}
                          </p>
                        </div>

                        {/* Room Features Grid */}
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {[
                            { icon: DoorOpen, label: 'Room Type', value: request.room.roomType?.join(', ') || 'Not specified' },
                            { icon: Hash, label: 'Payment Plan', value: request.room.paymentPlan || 'Not specified' },
                            { icon: Users, label: 'Suitable For', value: request.room.tenant?.join(', ') || 'Not specified', condition: request.room.tenant?.length > 0 },
                            { icon: Shield, label: 'Restrictions', value: request.room.restriction?.join(', ') || 'None', condition: request.room.restriction?.length > 0 },
                          ].filter(item => item.condition !== false).map((item, index) => (
                            <motion.div
                              whileHover={{ scale: 1.01 }}
                              key={index}
                              className="bg-gray-50 p-3 rounded-lg"
                            >
                              <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                <item.icon className="w-4 h-4 mr-2 text-blue-500" />
                                {item.label}
                              </h3>
                              <p className="text-gray-600 text-sm">
                                {item.value}
                              </p>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Landlord Info and Actions */}
                      <div className="mt-6 pt-6 border-t border-gray-100">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <motion.div
                            whileHover={{ x: 3 }}
                            className="flex items-start"
                          >
                            <div className="relative mr-4">
                              <motion.img
                                whileHover={{ scale: 1.05 }}
                                src={request.landlord.avatar || '/default-avatar.jpg'}
                                alt={request.landlord.name}
                                className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                                onError={(e) => {
                                  e.target.src = 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg';
                                }}
                              />
                              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-lg font-semibold text-gray-800 truncate">{request.landlord.name}</h4>
                              <div className="grid grid-cols-1 gap-2 mt-2">
                                <div className="flex items-center text-sm text-gray-600 truncate">
                                  <Mail className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" />
                                  <span className="truncate">{request.landlord.email}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                  <Phone className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" />
                                  <span>{request.landlord.phone}</span>
                                </div>
                              </div>
                            </div>
                          </motion.div>

                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all flex items-center justify-center shadow-md"
                              onClick={() => {
                                setNotification({
                                  message: 'Messaging feature coming soon!',
                                  type: 'info'
                                });
                              }}
                            >
                              <MessageSquare className="w-4 h-4 mr-1.5" />
                              Message
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleCancelRequest(request._id)}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center bg-white border border-red-200 text-red-600 hover:bg-red-50 shadow-md`}
                            >
                              <Trash2 className="w-4 h-4 mr-1.5" />
                              Cancel Request
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Visit Details Section */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div
                      whileHover={{ y: -3 }}
                      className="bg-blue-50 rounded-lg p-4 border border-blue-100"
                    >
                      <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                        Scheduled Visit
                      </h3>
                      <p className="text-gray-800 font-medium">
                        {formatDate(request.visitDate)}
                      </p>
                    </motion.div>
                    <motion.div
                      whileHover={{ y: -3 }}
                      className="bg-green-50 rounded-lg p-4 border border-green-100"
                    >
                      <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <MessageSquare className="w-5 h-5 text-green-600 mr-2" />
                        Your Message
                      </h3>
                      <p className="text-gray-800 font-medium">
                        {request.message || 'No message provided'}
                      </p>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default TenantRequests;