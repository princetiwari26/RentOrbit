import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BellRing,
  Check,
  Info,
  DoorOpen,
  X,
  User,
  Calendar,
  Home,
  Mail,
  Phone,
  Trash2,
  DollarSign,
  Wrench,
  Clock,
  CheckCircle,
  Ban,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Notification from "../../components/Notification";
import PreLoader from '../../components/PreLoader';
import ErrorHandler from '../../components/ErrorHandler';

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function formatTime(timeString) {
  if (!timeString) return '';
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'pm' : 'am';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}

function getStatusIcon(status) {
  switch (status) {
    case 'confirmed':
    case 'approved':
    case 'completed':
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case 'rejected':
    case 'tenant-cancelled':
    case 'landlord-cancelled' || 'tenant-leave':
      return <Ban className="w-4 h-4 text-red-500" />;
    case 'pending':
      return <Clock className="w-4 h-4 text-yellow-500" />;
    case 'in-progress':
      return <Wrench className="w-4 h-4 text-blue-500" />;
    default:
      return <Info className="w-4 h-4 text-gray-500" />;
  }
}

function getStatusText(status) {
  switch (status) {
    case 'confirmed':
      return 'Confirmed';
    case 'approved':
      return 'Approved';
    case 'completed':
      return 'Completed';
    case 'rejected':
      return 'Rejected';
    case 'tenant-cancelled':
      return 'Cancelled by Tenant';
    case 'tenant-leave':
      return 'Tenant leave from the Room';
    case 'landlord-cancelled':
      return 'Cancelled by You';
    case 'pending':
      return 'Pending';
    case 'in-progress':
      return 'In Progress';
    default:
      return status;
  }
}

function getStatusColor(status) {
  switch (status) {
    case 'confirmed':
    case 'approved':
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'rejected':
    case 'tenant-cancelled':
    case 'landlord-cancelled':
    case 'tenant-leave':
      return 'bg-red-100 text-red-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'in-progress':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function LandlordNotifications() {
  const token = localStorage.getItem("token");
  const [selectedTypes, setSelectedTypes] = useState(['roomRequest', 'roomStatus', 'maintenance']);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [unreadCount, setUnreadCount] = useState(0);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8000/api/notifications/landlord', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });

        const formattedNotifications = response.data.map(notif => ({
          id: notif._id,
          type: notif.notificationType,
          title: notif.title,
          description: notif.message,
          details: notif.message,
          sender: notif.tenant?.name || 'Tenant',
          property: notif.room?.roomType?.[0] || 'Room',
          address: notif.room?.address?.locality || '',
          rent: notif.room?.rent || 0,
          date: formatDate(notif.createdAt),
          time: formatTime(notif.time),
          contact: `${notif.tenant?.email || 'tenant@example.com'} | ${notif.tenant?.phone || '(555) 000-0000'}`,
          read: notif.isRead,
          icon: getNotificationIcon(notif.notificationType),
          originalData: notif,
          status: notif.status
        }));

        setNotifications(formattedNotifications);
        setUnreadCount(formattedNotifications.filter(n => !n.read).length);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError(err);
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [token]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'maintenance':
        return <Wrench className="w-5 h-5 text-blue-500" />;
      case 'roomRequest':
        return <DoorOpen className="w-5 h-5 text-orange-500" />;
      case 'roomStatus':
        return <Info className="w-5 h-5 text-purple-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const toggleType = (type) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const filteredNotifications = notifications.filter(notification => {
    const typeMatch = selectedTypes.includes(notification.type);
    const readMatch = !showUnreadOnly || !notification.read;
    return typeMatch && readMatch;
  });

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`http://localhost:8000/api/notifications/${notificationId}/read`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setNotifications(prev => prev.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      ));
      setUnreadCount(prev => prev - 1);
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const handleNotificationClick = async (notification) => {
    setSelectedNotification(notification);
    setShowModal(true);

    if (!notification.read) {
      await markAsRead(notification.id);
    }
  };

  const handleDeleteNotification = async (notificationId, event = null) => {
    if (event && event.stopPropagation) {
      event.stopPropagation();
    }

    try {
      await axios.delete(`http://localhost:8000/api/notifications/delete/${notificationId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const wasUnread = notifications.find(n => n.id === notificationId)?.read === false;

      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      setShowModal(false);

      if (wasUnread) {
        setUnreadCount(prev => prev - 1);
      }

      setNotification({ message: 'Notification deleted successfully', type: 'success' });
    } catch (err) {
      console.error('Error deleting notification:', err);
      setNotification({ message: 'Failed to delete notification', type: 'error' });
    }
  };

  const notificationTypes = [
    { id: 'roomRequest', name: 'Room Requests', icon: <DoorOpen className="w-4 h-4" /> },
    { id: 'roomStatus', name: 'Room Status', icon: <Info className="w-4 h-4" /> },
    { id: 'maintenance', name: 'Maintenance', icon: <Wrench className="w-4 h-4" /> }
  ];

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const slideUp = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: 20, opacity: 0 }
  };

  const popIn = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 }
  };

  if (loading) {
    return <PreLoader />;
  }

  if (error) {
    return <ErrorHandler error={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:p-6">
      {notification.message && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification({ message: '', type: '' })}
        />
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Sidebar - Desktop */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow p-4 sticky top-6">
            <h2 className="font-medium mb-4 text-gray-800">Filters</h2>

            {/* Unread Only Toggle */}
            <div className="mb-6">
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={showUnreadOnly}
                    onChange={() => setShowUnreadOnly(!showUnreadOnly)}
                  />
                  <div className={`block w-10 h-6 rounded-full ${showUnreadOnly ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${showUnreadOnly ? 'transform translate-x-4' : ''}`}></div>
                </div>
                <div className="ml-3 text-gray-700 font-medium flex items-center">
                  <BellRing className="w-4 h-4 mr-2" />
                  Unread only
                </div>
              </label>
            </div>

            {/* Notification Type Filters */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3">NOTIFICATION TYPES</h3>
              <ul className="space-y-2">
                {notificationTypes.map((type) => (
                  <motion.li
                    key={type.id}
                    whileHover={{ x: 3 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={selectedTypes.includes(type.id)}
                        onChange={() => toggleType(type.id)}
                      />
                      <div className={`flex items-center justify-center w-5 h-5 border rounded mr-3 ${selectedTypes.includes(type.id) ? 'bg-indigo-100 border-indigo-500' : 'border-gray-300'}`}>
                        {selectedTypes.includes(type.id) && <Check className="w-3 h-3 text-indigo-600" />}
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2">{type.icon}</span>
                        {type.name}
                      </div>
                    </label>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-4">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex items-center px-4 py-2 bg-gray-100 text-slate-800 rounded-lg shadow"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </motion.button>
        </div>

        {/* Mobile Filters Popup */}
        <AnimatePresence>
          {showMobileFilters && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={fadeIn}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50 flex items-start justify-center p-4"
              onClick={() => setShowMobileFilters(false)}
            >
              <motion.div
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={slideUp}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-lg shadow-lg w-full max-w-sm mt-16"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">Filters</h2>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowMobileFilters(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-5 h-5" />
                    </motion.button>
                  </div>

                  {/* Unread Only Toggle */}
                  <div className="mb-6">
                    <label className="flex items-center cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={showUnreadOnly}
                          onChange={() => setShowUnreadOnly(!showUnreadOnly)}
                        />
                        <div className={`block w-10 h-6 rounded-full ${showUnreadOnly ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
                        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${showUnreadOnly ? 'transform translate-x-4' : ''}`}></div>
                      </div>
                      <div className="ml-3 text-gray-700 font-medium flex items-center">
                        <BellRing className="w-4 h-4 mr-2" />
                        Unread only
                      </div>
                    </label>
                  </div>

                  {/* Notification Type Filters */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-3">NOTIFICATION TYPES</h3>
                    <ul className="space-y-2">
                      {notificationTypes.map((type) => (
                        <motion.li
                          key={type.id}
                          whileHover={{ x: 3 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="hidden"
                              checked={selectedTypes.includes(type.id)}
                              onChange={() => toggleType(type.id)}
                            />
                            <div className={`flex items-center justify-center w-5 h-5 border rounded mr-3 ${selectedTypes.includes(type.id) ? 'bg-indigo-100 border-indigo-500' : 'border-gray-300'}`}>
                              {selectedTypes.includes(type.id) && <Check className="w-3 h-3 text-indigo-600" />}
                            </div>
                            <div className="flex items-center">
                              <span className="mr-2">{type.icon}</span>
                              {type.name}
                            </div>
                          </label>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notifications List */}
        <div className="flex-1">
          {filteredNotifications.length === 0 ? (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow p-8 text-center"
            >
              <Info className="w-10 h-10 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No Notifications found</h3>
            </motion.div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <ul className="divide-y divide-gray-200">
                <AnimatePresence>
                  {filteredNotifications.map((notification) => (
                    <motion.li
                      key={notification.id}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={slideUp}
                      transition={{ duration: 0.2 }}
                      layout
                      className={`hover:bg-gray-50 cursor-pointer transition ${!notification.read ? 'bg-blue-50' : ''}`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="px-4 py-4">
                        <div className="flex items-start">
                          <motion.div
                            whileHover={{ rotate: 5 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                            className={`flex-shrink-0 p-2 rounded-full ${!notification.read ? 'bg-blue-100' : 'bg-gray-100'}`}
                          >
                            {notification.icon}
                          </motion.div>
                          <div className="ml-3 flex-1 min-w-0">
                            <div className="flex justify-between">
                              <p className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                                {notification.title}
                              </p>
                              <div className="flex items-center">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={(e) => handleDeleteNotification(notification.id, e)}
                                  className="text-gray-400 hover:text-red-500 mr-3"
                                  title="Delete notification"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </motion.button>
                                <p className="text-xs text-gray-500">
                                  {notification.date} • {notification.time}
                                </p>
                              </div>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              {notification.description}
                            </p>
                            <div className="mt-2 flex items-center text-xs text-gray-500">
                              <User className="w-3 h-3 mr-1" />
                              <span>{notification.sender}</span>
                              {notification.status && (
                                <motion.span
                                  initial={{ scale: 0.9 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: 'spring', stiffness: 500 }}
                                  className={`ml-3 px-2 py-0.5 rounded-full text-xs ${getStatusColor(notification.status)}`}
                                >
                                  {getStatusText(notification.status)}
                                </motion.span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Notification Detail Modal */}
      <AnimatePresence>
        {showModal && selectedNotification && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={fadeIn}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={popIn}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full ${!selectedNotification.read ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      {selectedNotification.icon}
                    </div>
                    <h2 className="text-xl font-bold ml-3">{selectedNotification.title}</h2>
                  </div>
                  <motion.button
                    whileHover={{ rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.div
                      whileHover={{ y: -3 }}
                      transition={{ duration: 0.1 }}
                      className="bg-gray-50 p-4 rounded-lg"
                    >
                      <h3 className="text-sm font-medium text-gray-500 mb-2">From</h3>
                      <p className="flex items-center">
                        <User className="w-4 h-4 mr-2 text-gray-400" />
                        {selectedNotification.sender}
                      </p>
                    </motion.div>
                    <motion.div
                      whileHover={{ y: -3 }}
                      transition={{ duration: 0.1 }}
                      className="bg-gray-50 p-4 rounded-lg"
                    >
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Property</h3>
                      <p className="flex items-center">
                        <Home className="w-4 h-4 mr-2 text-gray-400" />
                        {selectedNotification.property} • {selectedNotification.address}
                      </p>
                      {selectedNotification.rent && (
                        <p className="flex items-center mt-2">
                          <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                          Rent: ₹{selectedNotification.rent.toLocaleString()}
                        </p>
                      )}
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.div
                      whileHover={{ y: -3 }}
                      transition={{ duration: 0.1 }}
                      className="bg-gray-50 p-4 rounded-lg"
                    >
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Date & Time</h3>
                      <p className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {selectedNotification.date} • {selectedNotification.time}
                      </p>
                      {selectedNotification.status && (
                        <p className="flex items-center mt-2">
                          {getStatusIcon(selectedNotification.status)}
                          <span className={`ml-2 ${getStatusColor(selectedNotification.status)} px-2 py-0.5 rounded-full`}>
                            Status: {getStatusText(selectedNotification.status)}
                          </span>
                        </p>
                      )}
                    </motion.div>
                    <motion.div
                      whileHover={{ y: -3 }}
                      transition={{ duration: 0.1 }}
                      className="bg-gray-50 p-4 rounded-lg"
                    >
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Contact</h3>
                      <div className="flex flex-col">
                        <p className="flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-gray-400" />
                          {selectedNotification.contact.split(' | ')[0]}
                        </p>
                        <p className="flex items-center mt-1">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          {selectedNotification.contact.split(' | ')[1]}
                        </p>
                      </div>
                    </motion.div>
                  </div>

                  <motion.div
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.1 }}
                    className="bg-gray-50 p-4 rounded-lg"
                  >
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Details</h3>
                    <p>{selectedNotification.details}</p>
                  </motion.div>

                  <div className="flex justify-between pt-4">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleDeleteNotification(selectedNotification.id)}
                      className="flex items-center px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Notification
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      Close
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default LandlordNotifications;