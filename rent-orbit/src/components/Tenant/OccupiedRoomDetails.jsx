// components/Tenant/OccupiedRoomDetails.js
import React, { useState } from 'react';
import { 
  X, 
  Home, 
  MapPin,
  IndianRupee,
  Calendar, 
  User, 
  Phone, 
  Mail,
  AlertCircle,
  LogOut,
  AlertTriangle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import PreLoader from '../PreLoader';
import ErrorHandler from '../ErrorHandler';
import Notification from '../Notification';

const OccupiedRoomDetails = ({ room, onClose, onLeaveRoom }) => {
  const [showLeaveConfirmation, setShowLeaveConfirmation] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [leaveError, setLeaveError] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    type: '',
    message: ''
  });

  const handleLeaveRoom = async () => {
    setIsLeaving(true);
    setLeaveError(null);
    try {
      await axios.put(`http://localhost:8000/api/room/leave/${room._id}`, {}, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setNotification({
        show: true,
        type: 'success',
        message: 'Successfully left the room!'
      });
      
      setTimeout(() => {
        onLeaveRoom();
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error leaving room:', error);
      const errorMsg = error.response?.data?.message || 'Failed to leave room. Please try again.';
      setLeaveError(errorMsg);
      setNotification({
        show: true,
        type: 'error',
        message: errorMsg
      });
    } finally {
      setIsLeaving(false);
    }
  };

  if (!room) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <ErrorHandler 
          error={{ message: 'Room data not available' }}
          onRetry={onClose}
        />
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <AnimatePresence>
          {notification.show && (
            <Notification
              type={notification.type}
              message={notification.message}
              onClose={() => setNotification({...notification, show: false})}
            />
          )}
        </AnimatePresence>

        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
          className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-orange-600 to-purple-600 p-4 flex justify-between items-center z-10">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <Home className="mr-2" size={20} />
              Room Details
            </h2>
            <button 
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
              disabled={isLeaving}
            >
              <X size={24} />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-6">
            {/* Room Images */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4 text-gray-800">Room Photos</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {room.photos.length > 0 ? (
                  room.photos.map((photo, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="rounded-xl overflow-hidden h-40 shadow-md hover:shadow-lg transition-shadow"
                    >
                      <img 
                        src={photo} 
                        alt={`Room ${index + 1}`} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-3 py-8 text-center bg-gray-50 rounded-xl">
                    <p className="text-gray-500">No photos available</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Room Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-lg font-medium mb-4 text-gray-800">Room Information</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Accommodation Type', value: room.accommodation.join(', ') },
                    { label: 'Room Type', value: room.roomType.join(', ') },
                    { label: 'Suitable For', value: room.suitableFor.length > 0 ? room.suitableFor.join(', ') : 'Not specified' },
                    { label: 'Restrictions', value: room.restrictions.length > 0 ? room.restrictions.join(', ') : 'None' }
                  ].map((item, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-500">{item.label}</p>
                      <p className="font-medium text-gray-800">{item.value}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-lg font-medium mb-4 text-gray-800">Financial Details</h3>
                <div className="space-y-4">
                  {[
                    { icon: <IndianRupee size={18} />, label: 'Monthly Rent', value: `₹${room.rent.toLocaleString()}` },
                    { icon: <IndianRupee size={18} />, label: 'Security Deposit', value: `₹${room.cautionDeposit.toLocaleString()}` },
                    { label: 'Deposit Type', value: room.securityDepositType || 'Not specified' },
                    { label: 'Payment Plan', value: room.paymentPlan || 'Not specified' }
                  ].map((item, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        {item.icon && <span className="text-gray-500">{item.icon}</span>}
                        <div>
                          <p className="text-sm text-gray-500">{item.label}</p>
                          <p className="font-medium text-gray-800">{item.value}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
            
            {/* Address */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-lg font-medium mb-4 text-gray-800 flex items-center">
                <MapPin className="mr-2 text-indigo-600" size={20} />
                Address
              </h3>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                {room.address ? (
                  <div className="space-y-1">
                    <p className="text-gray-800">{room.address.houseNumber} {room.address.street}</p>
                    <p className="text-gray-800">{room.address.locality}</p>
                    <p className="text-gray-800">{room.address.landmark && `${room.address.landmark}, `}{room.address.city}</p>
                    <p className="text-gray-800">{room.address.district}, {room.address.state} - {room.address.pincode}</p>
                    <p className="text-gray-800">{room.address.country}</p>
                  </div>
                ) : (
                  <p className="text-gray-500">Address not available</p>
                )}
              </div>
            </motion.div>
            
            {/* Landlord Details */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-lg font-medium mb-4 text-gray-800 flex items-center">
                <User className="mr-2 text-indigo-600" size={20} />
                Landlord Information
              </h3>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                {room.landlord ? (
                  <div className="flex items-start space-x-4">
                    <img 
                      src={room.landlord.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(room.landlord.name)}&background=random`}
                      alt="Landlord"
                      className="w-16 h-16 rounded-full object-cover border-2 border-white shadow"
                    />
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-800">{room.landlord.name}</h4>
                      <p className="text-gray-600 flex items-center">
                        <Phone className="mr-2" size={14} />
                        {room.landlord.phone || 'Not available'}
                      </p>
                      <p className="text-gray-600 flex items-center">
                        <Mail className="mr-2" size={14} />
                        {room.landlord.email || 'Not available'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">Landlord information not available</p>
                )}
              </div>
            </motion.div>
            
            {/* Occupancy Details */}
            {room.joiningDate && (
              <motion.div 
                className="mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h3 className="text-lg font-medium mb-4 text-gray-800 flex items-center">
                  <Calendar className="mr-2 text-indigo-600" size={20} />
                  Occupancy Details
                </h3>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="flex items-center text-gray-800">
                    <Calendar className="mr-2 text-gray-500" size={16} />
                    <span className="font-medium">Date of Joining: </span>
                    <span className="ml-2">
                      {new Date(room.joiningDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </p>
                </div>
              </motion.div>
            )}
            
            {/* Action Buttons */}
            <motion.div 
              className="flex justify-end"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <button
                onClick={() => setShowLeaveConfirmation(true)}
                className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl hover:from-red-700 hover:to-rose-700 transition-all font-medium shadow-md hover:shadow-lg flex items-center"
                disabled={isLeaving}
              >
                <LogOut className="mr-2" size={16} />
                Leave Room
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Leave Room Confirmation Modal */}
      <AnimatePresence>
        {showLeaveConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-gray-100"
            >
              <div className="flex items-start mb-4">
                <AlertCircle className="text-yellow-500 mr-2 mt-1" size={20} />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Confirm Leave Room</h3>
                  <p className="text-gray-600 mt-1">Are you sure you want to leave this room? This action cannot be undone.</p>
                </div>
              </div>
              
              {leaveError && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mb-4 flex items-center text-red-600 text-sm bg-red-50 p-2 rounded-lg"
                >
                  <AlertTriangle className="mr-2" size={16} />
                  {leaveError}
                </motion.div>
              )}
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowLeaveConfirmation(false)}
                  className="px-5 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium"
                  disabled={isLeaving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleLeaveRoom}
                  className="px-5 py-2 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl hover:from-red-700 hover:to-rose-700 transition-all font-medium shadow-md hover:shadow-lg flex items-center disabled:opacity-75"
                  disabled={isLeaving}
                >
                  {isLeaving ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Leaving...
                    </>
                  ) : (
                    'Confirm Leave'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Full-page loader when leaving */}
      {isLeaving && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <PreLoader message="Processing your request..." />
        </div>
      )}
    </>
  );
};

export default OccupiedRoomDetails;