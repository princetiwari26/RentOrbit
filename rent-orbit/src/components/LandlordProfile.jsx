import React, { useState, useEffect } from 'react';
import { 
  Mail, Phone, Home, BadgeCheck, Star, Calendar, 
  Edit, Clock, Award, FileSignature, Percent, Shield
} from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

const LandlordProfile = () => {
  const [landlord, setLandlord] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    verified: true,
    joinDate: '',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    propertiesManaged: 12,
    responseRate: '98%',
    avgResponseTime: 'Under 2 hours',
    rating: 4.7,
    ratingCount: 28
  });

  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...landlord });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token'); // Get token from storage
        const response = await axios.get('http://localhost:8000/api/landlord/profile', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        
        const profileData = response.data;
        const joinDate = new Date(profileData.createdAt);
        const formattedDate = joinDate.toLocaleDateString('en-US', {
          month: 'long',
          year: 'numeric'
        });

        setLandlord(prev => ({
          ...prev,
          name: profileData.name,
          email: profileData.email,
          phone: profileData.phone,
          address: profileData.address,
          joinDate: formattedDate
        }));

        setEditForm(prev => ({
          ...prev,
          name: profileData.name,
          email: profileData.email,
          phone: profileData.phone,
          address: profileData.address,
          joinDate: formattedDate
        }));

      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleEdit = () => setEditing(true);
  const handleCancel = () => {
    setEditForm(landlord);
    setEditing(false);
  };
  const handleSave = () => {
    setLandlord(editForm);
    setEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  // Stats cards data
  const stats = [
    { icon: <Home className="h-6 w-6" />, value: landlord.propertiesManaged, label: 'Properties Managed' },
    { icon: <Percent className="h-6 w-6" />, value: '100%', label: 'Occupancy Rate' },
    { icon: <Clock className="h-6 w-6" />, value: '4.2 yrs', label: 'Avg. Tenant Stay' },
    { icon: <FileSignature className="h-6 w-6" />, value: '0', label: 'Active Disputes' },
    { icon: <Award className="h-6 w-6" />, value: '4.7/5', label: 'Average Rating' },
    { icon: <Shield className="h-6 w-6" />, value: '98%', label: 'Response Rate' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Gradient Header */}
      <div className="h-28 w-full"></div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24">
        {/* Profile Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-xl overflow-hidden mb-8 relative"
        >
          {editing ? (
            <div className="absolute top-4 right-4 space-x-2 z-10">
              <button 
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium shadow-md transition-all"
              >
                Save Changes
              </button>
              <button 
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md text-sm font-medium shadow-md transition-all"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button 
              onClick={handleEdit}
              className="absolute top-4 right-4 px-4 py-2 bg-white hover:bg-gray-100 text-blue-600 rounded-md text-sm font-medium shadow-md flex items-center transition-all"
            >
              <Edit className="h-4 w-4 mr-2" /> Edit Profile
            </button>
          )}

          <div className="md:flex p-8">
            <div className="md:flex-shrink-0 flex justify-center md:block">
              <div className="relative">
                <img 
                  className="h-40 w-40 rounded-full object-cover border-4 border-white shadow-lg" 
                  src={landlord.avatar} 
                  alt="Landlord profile" 
                />
                {landlord.verified && (
                  <motion.div 
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs font-medium px-3 py-1 rounded-full flex items-center shadow-md"
                  >
                    <BadgeCheck className="h-4 w-4 mr-1" />
                    Verified
                  </motion.div>
                )}
              </div>
            </div>
            
            <div className="mt-6 md:mt-0 md:ml-8 flex-1">
              {editing ? (
                <div className="space-y-4">
                  <input
                    name="name"
                    value={editForm.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-2xl font-bold focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        name="email"
                        value={editForm.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        name="phone"
                        value={editForm.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      name="address"
                      value={editForm.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-3xl font-bold text-gray-800">{landlord.name}</h1>
                  <p className="text-gray-500 mt-1 flex items-center">
                    <Calendar className="h-4 w-4 mr-2" /> Member since {landlord.joinDate}
                  </p>
                  
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="flex items-center text-gray-700">
                        <Mail className="h-5 w-5 mr-3 text-blue-600" /> 
                        <span className="truncate">{landlord.email}</span>
                      </p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="flex items-center text-gray-700">
                        <Phone className="h-5 w-5 mr-3 text-blue-600" /> 
                        {landlord.phone}
                      </p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg md:col-span-2">
                      <p className="flex items-center text-gray-700">
                        <Home className="h-5 w-5 mr-3 text-blue-600" /> 
                        {landlord.address}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Property Statistics */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <h2 className="text-xl font-semibold mb-6 pb-2 border-b border-gray-200 flex items-center">
            <Home className="h-6 w-6 mr-3 text-blue-600" />
            Property Statistics
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-gray-100 text-center"
              >
                <div className="flex justify-center text-blue-600 mb-2">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Rating Summary */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-semibold mb-6 pb-2 border-b border-gray-200 flex items-center">
            <Star className="h-6 w-6 mr-3 text-yellow-400 fill-yellow-400" />
            Landlord Rating
          </h2>
          
          <div className="flex flex-col items-center text-center">
            <div className="text-6xl font-bold mb-2 text-gray-800">{landlord.rating}</div>
            <div className="flex mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star}
                  className={`h-7 w-7 ${star <= Math.floor(landlord.rating) ? 'text-yellow-400 fill-yellow-400' : 
                    (star === Math.ceil(landlord.rating) && landlord.rating % 1 > 0) ? 'text-yellow-400 fill-yellow-400 fill-opacity-50' : 
                    'text-gray-300'}`}
                />
              ))}
            </div>
            <p className="text-gray-600 mb-1">
              Based on {landlord.ratingCount} tenant ratings
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
              <div 
                className="bg-yellow-400 h-2.5 rounded-full" 
                style={{ width: `${landlord.responseRate}` }}
              ></div>
            </div>
            <p className="text-gray-600 mt-2">
              {landlord.responseRate} response rate • Avg. response: {landlord.avgResponseTime}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LandlordProfile;