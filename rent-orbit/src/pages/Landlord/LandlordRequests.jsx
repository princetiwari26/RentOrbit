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
  const [complaints, setComplaints] = useState([]);
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
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        // Fetch room requests
        const requestsResponse = await axios.get('http://localhost:8000/api/requests', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });

        // Fetch maintenance complaints
        const complaintsResponse = await axios.get('http://localhost:8000/api/complaints/landlord', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });

        setRequests(requestsResponse.data);
        setComplaints(complaintsResponse.data.complaints);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const markRequestAsRead = async (requestId, isMaintenance) => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = isMaintenance
        ? `http://localhost:8000/api/complaints/${requestId}/mark-read`
        : `http://localhost:8000/api/requests/${requestId}/mark-read`;

      await axios.put(
        endpoint,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Update the request's read status in state if needed
      if (isMaintenance) {
        setComplaints(prevComplaints =>
          prevComplaints.map(complaint =>
            complaint._id === requestId ? { ...complaint, isRead: true } : complaint
          )
        );
      } else {
        setRequests(prevRequests =>
          prevRequests.map(request =>
            request._id === requestId ? { ...request, isRead: true } : request
          )
        );
      }
    } catch (err) {
      console.error("Error marking request as read:", err);
    }
  };

  const handleExpandRequest = (requestId, isMaintenance) => {
    setExpandedRequest(expandedRequest === requestId ? null : requestId);

    // Mark the request as read when expanded
    if (expandedRequest !== requestId) {
      markRequestAsRead(requestId, isMaintenance);
    }
  };

  const handleStatusChange = async (id, action) => {
    try {
      const token = localStorage.getItem("token");

      if (action === 'approve' || action === 'landlord-cancel') {
        // Handle room request status change
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
            request._id === id ? { ...request, status: action === 'approve' ? 'approved' : 'rejected' } : request
          )
        );

        setNotification({
          message: `Request ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
          type: 'success'
        });
      } else {
        // Handle maintenance complaint status change
        const status = action === 'in-progress' ? 'in-progress' : 'resolved';

        await axios.put(
          `http://localhost:8000/api/complaints/${id}/status`,
          { status },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setComplaints(prevComplaints =>
          prevComplaints.map(complaint =>
            complaint._id === id ? { ...complaint, status } : complaint
          )
        );

        setNotification({
          message: `Complaint marked as ${status.replace('-', ' ')} successfully`,
          type: 'success'
        });
      }
    } catch (err) {
      console.error("Error updating status:", err);
      setNotification({
        message: err.response?.data?.message || "Failed to update status",
        type: 'error'
      });
    }
  };

  const handleDeleteComplaint = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:8000/api/complaints/landlord/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComplaints(prevComplaints =>
        prevComplaints.filter(complaint => complaint._id !== id)
      );

      setNotification({
        message: "Complaint deleted successfully",
        type: 'success'
      });
    } catch (err) {
      console.error("Error deleting complaint:", err);
      setNotification({
        message: err.response?.data?.message || "Failed to delete complaint",
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
        filters.status === 'approved' ? request.status === 'approved' : true);

    const matchesType = filters.type === 'All' || filters.type === 'Room';

    return matchesSearch && matchesStatus && matchesType;
  });

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.tenant?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (complaint.room?.address?.city?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
      (complaint.description?.toLowerCase().includes(searchTerm.toLowerCase()) || '');

    const matchesStatus = filters.status === 'All' ||
      (filters.status === 'pending' ? complaint.status === 'pending' :
        filters.status === 'in progress' ? complaint.status === 'in-progress' :
          filters.status === 'resolved' ? complaint.status === 'resolved' : true);

    const matchesType = filters.type === 'All' || filters.type === 'Maintenance';

    return matchesSearch && matchesStatus && matchesType;
  });

  const roomRequests = filteredRequests;
  const maintenanceRequests = filteredComplaints.map(complaint => ({
    ...complaint,
    type: complaint.type || 'maintenance',
    message: complaint.description,
    createdAt: complaint.createdAt,
    _id: complaint._id
  }));

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
      className="min-h-screen bg-gray-50 px-4 md:p-6"
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

        <StatsSummary requests={[...requests, ...maintenanceRequests]} />

        {/* Room Requests Section */}
        <RequestSection
          title="Room Requests"
          icon={<DoorOpen className="h-6 w-6 mr-2 text-purple-600" />}
          color="bg-purple-100 text-purple-800"
          requests={roomRequests}
          expandedRequest={expandedRequest}
          setExpandedRequest={(id) => handleExpandRequest(id, false)}
          handleStatusChange={handleStatusChange}
          handleDeleteRequest={null} // Explicitly pass null for room requests
          isMaintenance={false}
        />


        {/* Maintenance Requests Section */}
        <RequestSection
          title="Maintenance Requests"
          icon={<Wrench className="h-6 w-6 mr-2 text-orange-600" />}
          color="bg-orange-100 text-orange-800"
          requests={maintenanceRequests}
          expandedRequest={expandedRequest}
          setExpandedRequest={(id) => handleExpandRequest(id, true)}
          handleStatusChange={handleStatusChange}
          handleDeleteComplaint={handleDeleteComplaint} // Pass the function for maintenance
          isMaintenance={true}
        />
      </div>
    </motion.div>
  );
};

export default LandlordRequests;