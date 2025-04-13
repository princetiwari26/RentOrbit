import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, DoorOpen, Wrench } from 'lucide-react';
import { motion } from 'framer-motion';
import Notification from "../../components/Notification";
import { RequestSection } from '../../components/Landlord/RequestSection';
import PreLoader from '../../components/PreLoader';
import ErrorHandler from '../../components/ErrorHandler';
import { RequestFilters } from '../../components/Landlord/RequestFilters';
import { StatsSummary } from '../../components/Landlord/StatsSummary';

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
      await axios.put(
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
          request._id === id ? { ...request, status: action === 'approve' ? 'approved' : action === 'in progress' ? 'in progress' : 'occupied' } : request
        )
      );

      setNotification({
        message: `Request ${action === 'approve' ? 'approved' : action === 'landlord-cancel' ? 'rejected' : action === 'in progress' ? 'marked as in progress' : 'marked as occupied'} successfully`,
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

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.tenant?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.room?.address?.city?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
      (request.message?.toLowerCase().includes(searchTerm.toLowerCase()) || '');

    const matchesStatus = filters.status === 'All' ||
      (filters.status === 'pending' ? request.status === 'pending' :
        filters.status === 'in progress' ? request.status === 'in progress' :
          filters.status === 'occupied' ? request.status === 'occupied' : true);

    const matchesType = filters.type === 'All' ||
      (request.type === 'maintenance' ? 'Maintenance' : 'Room') === filters.type;

    return matchesSearch && matchesStatus && matchesType;
  });

  const roomRequests = filteredRequests.filter(request => request.type !== 'maintenance');
  const maintenanceRequests = filteredRequests.filter(request => request.type === 'maintenance');

  if (loading) {
    return <PreLoader />;
  }

  if (error) {
    return <ErrorHandler error={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 p-4 md:p-6"
    >
      {notification.message && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification({ message: '', type: '' })}
        />
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <Bell className="h-6 w-6 mr-2 text-indigo-600" />
              Tenant Requests
            </h1>
            <p className="text-gray-600">Manage all room and maintenance requests from your tenants</p>
          </div>
        </motion.div>

        <RequestFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filters={filters}
          setFilters={setFilters}
        />

        <StatsSummary requests={requests} />

        {/* Room Requests Section */}
        <RequestSection
          title="Room Requests"
          icon={<DoorOpen className="h-6 w-6 mr-2 text-purple-600" />}
          color="bg-purple-100 text-purple-800"
          requests={roomRequests}
          expandedRequest={expandedRequest}
          setExpandedRequest={setExpandedRequest}
          handleStatusChange={handleStatusChange}
          isMaintenance={false}
        />

        {/* Maintenance Requests Section */}
        <RequestSection
          title="Maintenance Requests"
          icon={<Wrench className="h-6 w-6 mr-2 text-orange-600" />}
          color="bg-orange-100 text-orange-800"
          requests={maintenanceRequests}
          expandedRequest={expandedRequest}
          setExpandedRequest={setExpandedRequest}
          handleStatusChange={handleStatusChange}
          isMaintenance={true}
        />
      </div>
    </motion.div>
  );
};

export default LandlordRequests;