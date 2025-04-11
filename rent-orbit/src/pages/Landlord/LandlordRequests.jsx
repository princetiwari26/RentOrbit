import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Home,
  User,
  Calendar,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  Wrench,
  Bell,
  ArrowRight,
  DoorOpen,
  Mail,
  Phone,
  Trash2,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Notification from "../../components/Notification";

const LandlordRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: '' });

  const [filters, setFilters] = useState({
    status: 'All',
    type: 'All'
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRequest, setExpandedRequest] = useState(null);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/requests', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        setRequests(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleStatusChange = async (id, action) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:8000/api/requests/${id}`,
        { action },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRequests(prevRequests =>
        prevRequests.map(request =>
          request._id === id ? { ...request, status: action === 'approve' ? 'approved' : action } : request
        )
      );

      setNotification({
        message: `Request ${action === 'approve' ? 'approved' : action === 'landlord-cancel' ? 'rejected' : action} successfully`,
        type: 'success'
      });
    } catch (err) {
      console.error("Error updating request:", err);
      setNotification({
        message: err.response?.data?.message || "Failed to update request",
        type: 'error'
      });
    }
  };

  const handleAddNote = async (id) => {
    if (!newNote.trim()) return;

    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:8000/api/requests/${id}`,
        { notes: newNote },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setRequests(prev => prev.map(request =>
        request._id === id ? { ...request, notes: newNote } : request
      ));
      
      setNewNote('');
      setNotification({
        message: 'Note added successfully',
        type: 'success'
      });
    } catch (err) {
      setNotification({
        message: 'Failed to add note',
        type: 'error'
      });
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.tenant?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.room?.address?.city?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
      (request.message?.toLowerCase().includes(searchTerm.toLowerCase()) || '');

    const matchesStatus = filters.status === 'All' || 
      (filters.status === 'pending' ? request.status === 'pending' : 
       filters.status === 'in progress' ? request.status === 'in progress' : 
       filters.status === 'completed' ? request.status === 'completed' : true);

    const matchesType = filters.type === 'All' ||
      (request.type === 'maintenance' ? 'Maintenance' : 'Room') === filters.type;

    return matchesSearch && matchesStatus && matchesType;
  });

  const roomRequests = filteredRequests.filter(request => request.type !== 'maintenance');
  const maintenanceRequests = filteredRequests.filter(request => request.type === 'maintenance');

  const getTypeIcon = (type) => {
    switch (type) {
      case 'maintenance': return <Wrench className="h-4 w-4" />;
      default: return <DoorOpen className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'in progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'approved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status) => {
    if (!status) return 'Unknown';
    return status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 flex justify-center items-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md w-full">
          <p>Error loading requests: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {notification.message && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification({ message: '', type: '' })}
        />
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <Bell className="h-6 w-6 mr-2 text-indigo-600" />
              Tenant Requests
            </h1>
            <p className="text-gray-600">Manage all room and maintenance requests from your tenants</p>
          </div>
          <div className="w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search requests..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="All">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              >
                <option value="All">All Types</option>
                <option value="Room">Room Requests</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-4 flex items-center">
            <div className="bg-indigo-100 p-3 rounded-full mr-4">
              <Bell className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Requests</p>
              <p className="text-2xl font-bold">{requests.length}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 flex items-center">
            <div className="bg-purple-100 p-3 rounded-full mr-4">
              <DoorOpen className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Room Requests</p>
              <p className="text-2xl font-bold">{requests.filter(r => r.type !== 'maintenance').length}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 flex items-center">
            <div className="bg-orange-100 p-3 rounded-full mr-4">
              <Wrench className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Maintenance</p>
              <p className="text-2xl font-bold">{requests.filter(r => r.type === 'maintenance').length}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold">{requests.filter(r => r.status === 'completed').length}</p>
            </div>
          </div>
        </div>

        {/* Room Requests Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <DoorOpen className="h-6 w-6 mr-2 text-purple-600" />
            Room Requests
            <span className="ml-2 bg-purple-100 text-purple-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
              {roomRequests.length}
            </span>
          </h2>

          {roomRequests.length > 0 ? (
            <div className="space-y-4">
              {roomRequests.map(request => (
                <motion.div
                  key={request._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-purple-500"
                >
                  <div
                    className="p-4 cursor-pointer flex justify-between items-center"
                    onClick={() => setExpandedRequest(expandedRequest === request._id ? null : request._id)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        {request.tenant?.avatar ? (
                          <img
                            src={request.tenant.avatar}
                            alt={request.tenant.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <User className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{request.tenant?.name || 'Unknown Tenant'}</h3>
                        <p className="text-sm text-gray-500 flex items-center">
                          <DoorOpen className="h-4 w-4 mr-1" />
                          Room Request
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {formatStatus(request.status)}
                      </span>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(request.createdAt).toLocaleDateString()}
                      </div>
                      {expandedRequest === request._id ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedRequest === request._id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-gray-200 p-4">
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                              <h4 className="font-medium mb-2">Request Details</h4>
                              <p className="text-gray-700 mb-4">{request.message || 'No additional message provided'}</p>

                              <div className="mb-4">
                                <h4 className="font-medium mb-2">Room Information</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-sm text-gray-500">Room Type</p>
                                    <p className="font-medium">
                                      {request.room?.roomType?.join(', ') || 'Not specified'}
                                    </p>
                                  </div>
                                  <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-sm text-gray-500">Accommodation</p>
                                    <p className="font-medium">
                                      {request.room?.accommodation?.join(', ') || 'Not specified'}
                                    </p>
                                  </div>
                                  <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-sm text-gray-500">Rent</p>
                                    <p className="font-medium">
                                      ₹{request.room?.rent?.toLocaleString() || 'Not specified'} {request.room?.paymentPlan ? `(${request.room.paymentPlan})` : ''}
                                    </p>
                                  </div>
                                  <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-sm text-gray-500">Location</p>
                                    <p className="font-medium">
                                      {request.room?.address ?
                                        `${request.room.address.houseNumber || ''} ${request.room.address.street || ''}, ${request.room.address.locality || ''}, ${request.room.address.city || ''}`
                                        : 'Not specified'}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {request.room?.photos?.length > 0 && (
                                <div className="mb-4">
                                  <h4 className="font-medium mb-2">Room Photos</h4>
                                  <div className="flex space-x-2 overflow-x-auto pb-2">
                                    {request.room.photos.map((photo, index) => (
                                      <div key={index} className="h-40 w-60 rounded-md overflow-hidden flex-shrink-0">
                                        <img
                                          src={photo}
                                          alt={`Room photo ${index}`}
                                          className="h-full w-full object-cover"
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              <div className="mt-4">
                                <h4 className="font-medium mb-2">Add Note</h4>
                                <div className="flex flex-col sm:flex-row gap-2">
                                  <input
                                    type="text"
                                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Add a note about this request..."
                                    value={newNote}
                                    onChange={(e) => setNewNote(e.target.value)}
                                  />
                                  <button
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                    onClick={() => handleAddNote(request._id)}
                                  >
                                    Save
                                  </button>
                                </div>
                                {request.notes && (
                                  <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-gray-700">{request.notes}</p>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div>
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-medium mb-3">Applicant Information</h4>
                                <div className="space-y-3">
                                  <div className="flex items-center">
                                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-3">
                                      {request.tenant?.avatar ? (
                                        <img
                                          src={request.tenant.avatar}
                                          alt={request.tenant.name}
                                          className="h-full w-full object-cover"
                                        />
                                      ) : (
                                        <User className="h-5 w-5 text-gray-500" />
                                      )}
                                    </div>
                                    <p className="font-medium">{request.tenant?.name || 'Unknown Tenant'}</p>
                                  </div>
                                  <p className="flex items-center text-sm">
                                    <Mail className="h-4 w-4 mr-2 text-gray-500" />
                                    {request.tenant?.email || 'Not specified'}
                                  </p>
                                  <p className="flex items-center text-sm">
                                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                                    {request.tenant?.phone || 'Not specified'}
                                  </p>
                                </div>

                                <h4 className="font-medium mt-6 mb-3">Request Actions</h4>
                                <div className="space-y-2">
                                  {request.status === 'pending' && (
                                    <>
                                      <button
                                        className="w-full flex items-center justify-center px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200"
                                        onClick={() => handleStatusChange(request._id, 'approve')}
                                      >
                                        <CheckCircle2 className="h-4 w-4 mr-2" />
                                        Approve Application
                                      </button>
                                      <button
                                        className="w-full flex items-center justify-center px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200"
                                        onClick={() => handleStatusChange(request._id, 'landlord-cancel')}
                                      >
                                        <XCircle className="h-4 w-4 mr-2" />
                                        Decline Application
                                      </button>
                                    </>
                                  )}
                                  <button
                                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-blue-500"
                                  >
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    Message Applicant
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <p className="text-gray-500">No room requests found matching your filters</p>
            </div>
          )}
        </div>

        {/* Maintenance Requests Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Wrench className="h-6 w-6 mr-2 text-orange-600" />
            Maintenance Requests
            <span className="ml-2 bg-orange-100 text-orange-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
              {maintenanceRequests.length}
            </span>
          </h2>

          {maintenanceRequests.length > 0 ? (
            <div className="space-y-4">
              {maintenanceRequests.map(request => (
                <motion.div
                  key={request._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden"
                >
                  <div
                    className="p-4 cursor-pointer flex justify-between items-center"
                    onClick={() => setExpandedRequest(expandedRequest === request._id ? null : request._id)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        {request.tenant?.avatar ? (
                          <img
                            src={request.tenant.avatar}
                            alt={request.tenant.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <User className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{request.tenant?.name || 'Unknown Tenant'}</h3>
                        <p className="text-sm text-gray-500 flex items-center">
                          {getTypeIcon(request.type)}
                          <span className="ml-1">Maintenance</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {formatStatus(request.status)}
                      </span>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(request.createdAt).toLocaleDateString()}
                      </div>
                      {expandedRequest === request._id ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedRequest === request._id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-gray-200 p-4">
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                              <h4 className="font-medium mb-2">Request Details</h4>
                              <p className="text-gray-700 mb-4">{request.message || 'No additional details provided'}</p>

                              <div className="mt-4">
                                <h4 className="font-medium mb-2">Add Note</h4>
                                <div className="flex flex-col sm:flex-row gap-2">
                                  <input
                                    type="text"
                                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Add a note about this request..."
                                    value={newNote}
                                    onChange={(e) => setNewNote(e.target.value)}
                                  />
                                  <button
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                    onClick={() => handleAddNote(request._id)}
                                  >
                                    Save
                                  </button>
                                </div>
                                {request.notes && (
                                  <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-gray-700">{request.notes}</p>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div>
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-medium mb-3">Tenant Information</h4>
                                <div className="space-y-3">
                                  <div className="flex items-center">
                                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-3">
                                      {request.tenant?.avatar ? (
                                        <img
                                          src={request.tenant.avatar}
                                          alt={request.tenant.name}
                                          className="h-full w-full object-cover"
                                        />
                                      ) : (
                                        <User className="h-5 w-5 text-gray-500" />
                                      )}
                                    </div>
                                    <p className="font-medium">{request.tenant?.name || 'Unknown Tenant'}</p>
                                  </div>
                                  <p className="flex items-center text-sm">
                                    <Mail className="h-4 w-4 mr-2 text-gray-500" />
                                    {request.tenant?.email || 'Not specified'}
                                  </p>
                                  <p className="flex items-center text-sm">
                                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                                    {request.tenant?.phone || 'Not specified'}
                                  </p>
                                  <p className="flex items-center text-sm">
                                    <Home className="h-4 w-4 mr-2 text-gray-500" />
                                    {request.room?.address ?
                                      `${request.room.address.houseNumber || ''} ${request.room.address.street || ''}, ${request.room.address.city || ''}`
                                      : 'Not specified'}
                                  </p>
                                </div>

                                <h4 className="font-medium mt-6 mb-3">Request Actions</h4>
                                <div className="space-y-2">
                                  {request.status === 'pending' && (
                                    <>
                                      <button
                                        className="w-full flex items-center justify-center px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200"
                                        onClick={() => handleStatusChange(request._id, 'in progress')}
                                      >
                                        <ArrowRight className="h-4 w-4 mr-2" />
                                        Mark as In Progress
                                      </button>
                                      <button
                                        className="w-full flex items-center justify-center px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200"
                                        onClick={() => handleStatusChange(request._id, 'completed')}
                                      >
                                        <CheckCircle2 className="h-4 w-4 mr-2" />
                                        Mark as Completed
                                      </button>
                                    </>
                                  )}
                                  {request.status === 'in progress' && (
                                    <button
                                      className="w-full flex items-center justify-center px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200"
                                      onClick={() => handleStatusChange(request._id, 'completed')}
                                    >
                                      <CheckCircle2 className="h-4 w-4 mr-2" />
                                      Mark as Completed
                                    </button>
                                  )}
                                  <button
                                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                  >
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    Message Tenant
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <p className="text-gray-500">No maintenance requests found matching your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandlordRequests;