import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Home, 
  MapPin, 
  Briefcase,
  DollarSign,
  Calendar,
  Star,
  AlertCircle,
  Building,
  Users,
  FileText,
  Shield
} from 'lucide-react';
import axios from 'axios';
import PreLoader from '../../components/PreLoader';
import ErrorHandler from '../../components/ErrorHandler';
import { motion } from 'framer-motion';
import TenantListModal from '../../components/Landlord/TenantListModal';

const LandlordProfile = () => {
  const token = localStorage.getItem('token');
  const [landlord, setLandlord] = useState(null);
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPropertyDetails, setShowPropertyDetails] = useState(false);
  const [showTenantList, setShowTenantList] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [propertiesLoading, setPropertiesLoading] = useState(true);
  const [propertiesError, setPropertiesError] = useState(null);

  const fetchLandlordProfile = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/landlord/profile', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      setLandlord(response.data);
    } catch (err) {
      setError(err);
    }
  };

  const fetchProperties = async () => {
    try {
      setPropertiesLoading(true);
      setPropertiesError(null);
      
      const response = await axios.get('http://localhost:8000/api/landlord/properties', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      
      setProperties(response.data);
    } catch (err) {
      setPropertiesError(err);
    } finally {
      setPropertiesLoading(false);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        fetchLandlordProfile(),
        fetchProperties()
      ]);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewProperty = (property) => {
    setSelectedProperty(property);
    setShowPropertyDetails(true);
  };

  const handleViewTenants = (property) => {
    setSelectedProperty(property);
    setShowTenantList(true);
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

  if (!landlord) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          No landlord data found
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
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="w-32 h-32 rounded-full border-4 border-white bg-indigo-600 flex items-center justify-center shadow-md"
              >
                <span className="text-white text-4xl font-bold">
                  {landlord.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              </motion.div>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-6">
              <h1 className="text-2xl font-bold text-gray-900">
                {landlord.name}
              </h1>
              <p className="text-gray-600 flex items-center mt-1">
                <Mail className="mr-2" size={16} />
                {landlord.email}
              </p>
              <p className="text-gray-600 flex items-center mt-1">
                <Phone className="mr-2" size={16} />
                {landlord.phone || 'Not specified'}
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
                <label className="block text-sm font-medium text-gray-500">Address</label>
                <p className="text-gray-800 mt-1 flex items-center">
                  <MapPin className="mr-2" size={16} />
                  {landlord.address || 'Not specified'}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500">Member Since</label>
                <p className="text-gray-800 mt-1 flex items-center">
                  <Calendar className="mr-2" size={16} />
                  {new Date(landlord.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </motion.div>
          
          {/* Stats */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white shadow-lg rounded-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FileText className="mr-2" size={20} />
              Statistics
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{properties.length}</p>
                <p className="text-sm text-gray-600">Properties</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {properties.reduce((acc, prop) => acc + (prop.tenants?.length || 0), 0)}
                </p>
                <p className="text-sm text-gray-600">Tenants</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">
                  {properties.filter(p => p.roomStatus === 'occupied').length}
                </p>
                <p className="text-sm text-gray-600">Occupied</p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600">
                  {properties.filter(p => p.roomStatus === 'vacant').length}
                </p>
                <p className="text-sm text-gray-600">Vacant</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default LandlordProfile;