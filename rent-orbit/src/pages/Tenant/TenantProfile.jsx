// pages/TenantProfile.js
import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Home, 
  MapPin, 
  Briefcase,
  DollarSign,
  Heart,
  Calendar,
  Star,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';
import PreLoader from '../../components/PreLoader';
import ErrorHandler from '../../components/ErrorHandler';
import { motion } from 'framer-motion';
import OccupiedRoomDetails from '../../components/Tenant/OccupiedRoomDetails';
import ComplaintForm from '../../components/Tenant/ComplaintForm';

const TenantProfile = () => {
  const token = localStorage.getItem('token');
  const [tenant, setTenant] = useState(null);
  const [completedRoom, setCompletedRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [roomLoading, setRoomLoading] = useState(true);
  const [roomError, setRoomError] = useState(null);

  const fetchTenantProfile = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/tenants/profile', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      setTenant(response.data);
    } catch (err) {
      setError(err);
    }
  };

  const fetchCompletedRoom = async () => {
    try {
      setRoomLoading(true);
      setRoomError(null);
      
      // Fetch tenant requests
      const requestsResponse = await axios.get('http://localhost:8000/api/requests', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      
      // Find the completed room
      const completedRequest = requestsResponse.data.find(
        request => request.status === 'completed'
      );
      
      if (completedRequest && completedRequest.room) {
        try {
          // Fetch complete room details
          const roomResponse = await axios.get(`http://localhost:8000/api/room/${completedRequest.room._id}`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          });
          setCompletedRoom(roomResponse.data);
        } catch (err) {
          // If room not found, set completedRoom to null
          setCompletedRoom(null);
        }
      } else {
        setCompletedRoom(null);
      }
    } catch (err) {
      setRoomError(err);
    } finally {
      setRoomLoading(false);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        fetchTenantProfile(),
        fetchCompletedRoom()
      ]);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeaveRoom = async () => {
    try {
      await fetchCompletedRoom(); // Refresh room data after leaving room
    } catch (err) {
      console.error('Error refreshing room data:', err);
    }
  };

  const handleSubmitComplaint = async (complaintData) => {
    try {
      const response = await axios.post('http://localhost:8000/api/complaints', {
        roomId: complaintData.roomId,
        type: complaintData.type,
        description: complaintData.description
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting complaint:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return <PreLoader />;
  }

  if (error) {
    return <ErrorHandler error={error} onRetry={fetchData} />;
  }

  if (!tenant) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          No tenant data found
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white shadow-xl rounded-lg overflow-hidden"
        >
          <div className="h-16"></div>
          <div className="px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center -mt-16">
            <div className="relative">
              <motion.img 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                src={tenant.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(tenant.name)}&background=random`}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-md"
              />
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-6">
              <h1 className="text-2xl font-bold text-gray-900">
                {tenant.name}
              </h1>
              
              <p className="text-gray-600 flex items-center mt-1">
                <Mail className="mr-2" size={16} />
                {tenant.email}
              </p>
            </div>
          </div>
        </motion.div>
        
        {/* Profile Details */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white shadow-lg rounded-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <User className="mr-2" size={20} />
              Personal Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Phone</label>
                <p className="text-gray-800 mt-1 flex items-center">
                  <Phone className="mr-2" size={16} />
                  {tenant.phone || 'Not specified'}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500">Occupation</label>
                <p className="text-gray-800 mt-1 flex items-center">
                  <Briefcase className="mr-2" size={16} />
                  {tenant.occupation || 'Not specified'}
                </p>
              </div>
            </div>
          </motion.div>
          
          {/* Preferences */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white shadow-lg rounded-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Heart className="mr-2" size={20} />
              Preferences
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Budget Range</label>
                <p className="text-gray-800 mt-1 flex items-center">
                  <DollarSign className="mr-2" size={16} />
                  {tenant.budgetRange || 'Not specified'}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500">Preferred Location</label>
                <p className="text-gray-800 mt-1 flex items-center">
                  <MapPin className="mr-2" size={16} />
                  {tenant.preferredLocation || 'Not specified'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* My Room Section */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-white shadow-lg rounded-lg p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <Home className="mr-2" size={20} />
              My Room
            </h2>
            {completedRoom && (
              <button
                onClick={() => setShowComplaintForm(true)}
                className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm flex items-center"
              >
                <AlertCircle className="mr-1" size={14} />
                File Complaint
              </button>
            )}
          </div>
          
          {roomLoading ? (
            <div className="flex justify-center py-8">
              <PreLoader />
            </div>
          ) : roomError ? (
            <div className="text-center py-8 text-red-600">
              Error loading room information
            </div>
          ) : completedRoom ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Room Image */}
                <div className="rounded-lg overflow-hidden">
                  <img 
                    src={completedRoom.photos[0] || 'https://via.placeholder.com/500x300?text=No+Image'} 
                    alt="Room" 
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
                
                {/* Room Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{completedRoom.accommodation.join(', ')}</h3>
                  <p className="text-gray-600 mt-1">{completedRoom.roomType.join(', ')}</p>
                  
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Rent</p>
                      <p className="font-medium text-gray-800">
                        ₹{completedRoom.rent.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Deposit</p>
                      <p className="font-medium text-gray-800">
                        ₹{completedRoom.cautionDeposit.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Payment Plan</p>
                      <p className="font-medium text-gray-800">
                        {completedRoom.paymentPlan}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="font-medium text-gray-800">
                        {completedRoom.roomStatus}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Landlord Details */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-md font-semibold text-gray-800 mb-3">Landlord Details</h4>
                <div className="flex items-start">
                  <img 
                    src={completedRoom.landlord?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(completedRoom.landlord?.name || 'LL')}&background=random`}
                    alt="Landlord"
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h5 className="font-medium text-gray-800">{completedRoom.landlord?.name || 'Not available'}</h5>
                    <p className="text-gray-600 flex items-center mt-1">
                      <Phone className="mr-2" size={14} />
                      {completedRoom.landlord?.phone || 'Not available'}
                    </p>
                    <p className="text-gray-600 flex items-center mt-1">
                      <MapPin className="mr-2" size={14} />
                      {completedRoom.address?.city || 'Not available'}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={() => setShowDetails(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  View Complete Details
                </button>
              </div>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Home size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-700">No Room Found</h3>
              <p className="text-gray-500 mt-1">You don't have any confirmed room yet.</p>
            </motion.div>
          )}
        </motion.div>
      </div>
      
      {/* Room Details Modal */}
      {completedRoom && showDetails && (
        <OccupiedRoomDetails 
          room={completedRoom} 
          onClose={() => setShowDetails(false)}
          onLeaveRoom={handleLeaveRoom}
        />
      )}
      
      {/* Complaint Form Modal */}
      {completedRoom && showComplaintForm && (
        <ComplaintForm
          roomId={completedRoom._id}
          onClose={() => setShowComplaintForm(false)}
          onSubmit={handleSubmitComplaint}
        />
      )}
    </motion.div>
  );
};

export default TenantProfile;