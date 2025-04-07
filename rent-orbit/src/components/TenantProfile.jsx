import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
  User, 
  Mail, 
  Phone, 
  Home, 
  Calendar, 
  MapPin, 
  Edit, 
  Save, 
  X, 
  Lock,
  Briefcase,
  DollarSign,
  Heart
} from 'lucide-react';
import axios from 'axios';

const TenantProfile = () => {
  const token = localStorage.getItem('token');
  const [tenant, setTenant] = useState(null);
  const [requests, setRequests] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch tenant profile
        const profileResponse = await axios.get('http://localhost:8000/api/tenants/profile',
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          }
        );
        setTenant(profileResponse.data);
        reset(profileResponse.data);
        
        // Fetch tenant requests
        const requestsResponse = await axios.get('http://localhost:8000/api/requests',
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          }
        );
        setRequests(requestsResponse.data);
        
        setIsLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch data');
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [reset]);

  const onSubmit = async (data) => {
    try {
      const response = await axios.put('http://localhost:8000/api/tenants/profile', data);
      setTenant(response.data);
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const cancelEdit = () => {
    reset(tenant);
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Success message */}
        {successMessage && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {successMessage}
          </div>
        )}
        
        {/* Profile Header */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="h-20"></div>
          <div className="px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center -mt-16">
            <div className="relative">
              <img 
                src={tenant.profileImage || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(tenant.name) + '&background=random'}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white object-cover"
              />
              {isEditing && (
                <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition">
                  <Edit size={16} />
                </button>
              )}
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-6">
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditing ? (
                  <input
                    {...register('name', { required: 'Name is required' })}
                    className="border rounded px-3 py-1 w-full"
                    defaultValue={tenant.name}
                  />
                ) : (
                  tenant.name
                )}
              </h1>
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              
              <p className="text-gray-600 flex items-center mt-1">
                <Mail className="mr-2" size={16} />
                {isEditing ? (
                  <input
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    className="border rounded px-3 py-1 w-full"
                    defaultValue={tenant.email}
                  />
                ) : (
                  tenant.email
                )}
              </p>
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              
              <div className="mt-4">
                {isEditing ? (
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={handleSubmit(onSubmit)}
                      className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                    >
                      <Save className="mr-2" size={16} />
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="flex items-center bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
                    >
                      <X className="mr-2" size={16} />
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                  >
                    <Edit className="mr-2" size={16} />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Profile Details */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <User className="mr-2" size={20} />
              Personal Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Phone</label>
                {isEditing ? (
                  <input
                    {...register('phone', { 
                      required: 'Phone is required',
                      pattern: {
                        value: /^[0-9+\-() ]+$/,
                        message: 'Invalid phone number'
                      }
                    })}
                    className="border rounded px-3 py-2 w-full mt-1"
                    defaultValue={tenant.phone}
                  />
                ) : (
                  <p className="text-gray-800 mt-1 flex items-center">
                    <Phone className="mr-2" size={16} />
                    {tenant.phone}
                  </p>
                )}
                {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500">Occupation</label>
                {isEditing ? (
                  <input
                    {...register('occupation')}
                    className="border rounded px-3 py-2 w-full mt-1"
                    defaultValue={tenant.occupation || ''}
                  />
                ) : (
                  <p className="text-gray-800 mt-1 flex items-center">
                    <Briefcase className="mr-2" size={16} />
                    {tenant.occupation || 'Not specified'}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500">Budget Range</label>
                {isEditing ? (
                  <input
                    {...register('budgetRange')}
                    className="border rounded px-3 py-2 w-full mt-1"
                    defaultValue={tenant.budgetRange || ''}
                  />
                ) : (
                  <p className="text-gray-800 mt-1 flex items-center">
                    <DollarSign className="mr-2" size={16} />
                    {tenant.budgetRange || 'Not specified'}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500">Preferred Location</label>
                {isEditing ? (
                  <input
                    {...register('preferredLocation')}
                    className="border rounded px-3 py-2 w-full mt-1"
                    defaultValue={tenant.preferredLocation || ''}
                  />
                ) : (
                  <p className="text-gray-800 mt-1 flex items-center">
                    <MapPin className="mr-2" size={16} />
                    {tenant.preferredLocation || 'Not specified'}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {/* Preferences */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Heart className="mr-2" size={20} />
              Preferences
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Move-in Date</label>
                {isEditing ? (
                  <input
                    type="date"
                    {...register('moveInDate')}
                    className="border rounded px-3 py-2 w-full mt-1"
                    defaultValue={tenant.moveInDate ? tenant.moveInDate.split('T')[0] : ''}
                  />
                ) : (
                  <p className="text-gray-800 mt-1 flex items-center">
                    <Calendar className="mr-2" size={16} />
                    {tenant.moveInDate ? new Date(tenant.moveInDate).toLocaleDateString() : 'Flexible'}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500">Preferred Property Type</label>
                {isEditing ? (
                  <select
                    {...register('preferredPropertyType')}
                    className="border rounded px-3 py-2 w-full mt-1"
                    defaultValue={tenant.preferredPropertyType || ''}
                  >
                    <option value="">Select</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="condo">Condo</option>
                    <option value="studio">Studio</option>
                  </select>
                ) : (
                  <p className="text-gray-800 mt-1">
                    {tenant.preferredPropertyType || 'Not specified'}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500">Special Requirements</label>
                {isEditing ? (
                  <textarea
                    {...register('specialRequirements')}
                    className="border rounded px-3 py-2 w-full mt-1"
                    rows="3"
                    defaultValue={tenant.specialRequirements || ''}
                  ></textarea>
                ) : (
                  <p className="text-gray-800 mt-1">
                    {tenant.specialRequirements || 'None'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Recent Requests */}
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Home className="mr-2" size={20} />
            Recent Visit Requests
          </h2>
          
          {requests.length === 0 ? (
            <p className="text-gray-500">You haven't made any visit requests yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visit Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {requests.map((request) => (
                    <tr key={request._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{request.room?.name || 'Unknown'}</div>
                        <div className="text-sm text-gray-500">{request.landlord?.name || 'Unknown landlord'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {request.visitDate ? new Date(request.visitDate).toLocaleString() : 'Not scheduled'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${request.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                            request.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                            request.status === 'completed' ? 'bg-purple-100 text-purple-800' : 
                            request.status === 'cancelled' ? 'bg-gray-100 text-gray-800' : 
                            'bg-yellow-100 text-yellow-800'}`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                        {request.status === 'pending' && (
                          <button className="text-red-600 hover:text-red-900">Cancel</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TenantProfile;