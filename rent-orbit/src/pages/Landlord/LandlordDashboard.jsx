import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Home,
  Bell,
  AlertCircle,
  Wrench,
  User,
  RefreshCw,
} from 'lucide-react';
import PreLoader from '../../components/PreLoader';
import ErrorHandler from '../../components/ErrorHandler';
import Notification from '../../components/Notification';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' }
  })
};

const LandlordDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/api/landlord/dashboard', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const data = await response.json();
      setDashboardData(data);
    } catch (err) {
      setError(err);
      setNotification({ type: 'error', message: 'Failed to load dashboard data' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading && !dashboardData) return <PreLoader />;
  if (error) return <ErrorHandler error={error} onRetry={fetchDashboardData} />;
  if (!dashboardData) return null;

  const formatNumber = (num) => (num < 10 ? `0${num}` : num);

  const complaintsData = [
    { name: 'Pending', value: dashboardData.complaints.pending, color: 'bg-blue-500' },
    { name: 'In Progress', value: dashboardData.complaints.inProgress, color: 'bg-yellow-500' },
    { name: 'Resolved', value: dashboardData.complaints.resolved, color: 'bg-green-500' },
    { name: 'Cancelled', value: dashboardData.complaints.cancelled, color: 'bg-red-500' },
  ];

  return (
    <motion.div
      className="min-h-screen bg-gray-50 p-4 md:p-8"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      {/* Header */}
      <motion.div className="flex justify-between items-center mb-8" variants={fadeIn}>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Landlord Dashboard</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={fetchDashboardData}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:bg-gray-100 transition text-green-700 font-semibold"
        >
          <RefreshCw size={18} />
          <span>Refresh</span>
        </motion.button>
      </motion.div>

      {/* Stats Grid */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          {
            title: 'Rooms',
            icon: <Home size={20} />,
            iconBg: 'bg-blue-100 text-blue-600',
            stats: [
              { label: 'Total', value: dashboardData.rooms.total, color: 'text-gray-800' },
              { label: 'Active', value: dashboardData.rooms.active, color: 'text-green-600' },
              { label: 'Occupied', value: dashboardData.rooms.occupied, color: 'text-orange-600' },
            ],
          },
          {
            title: 'Notifications',
            icon: <Bell size={20} />,
            iconBg: 'bg-purple-100 text-purple-600',
            stats: [
              { label: 'Read', value: dashboardData.notifications.read, color: 'text-gray-800' },
              { label: 'Unread', value: dashboardData.notifications.unread, color: 'text-red-600 animate-pulse' },
            ],
          },
          {
            title: 'Requests',
            icon: <Wrench size={20} />,
            iconBg: 'bg-green-100 text-green-600',
            stats: [
              { label: 'Total', value: dashboardData.requests.total, color: 'text-gray-800' },
              { label: 'Maintenance', value: dashboardData.requests.maintenanceRequests, color: 'text-blue-600' },
            ],
          },
          {
            title: 'Complaints',
            icon: <AlertCircle size={20} />,
            iconBg: 'bg-red-100 text-red-600',
            stats: [
              { label: 'Total', value: dashboardData.complaints.total, color: 'text-gray-800' },
              { label: 'Cancelled', value: dashboardData.complaints.cancelled, color: 'text-yellow-600' },
            ],
          },
        ].map((card, i) => (
          <motion.div
            key={card.title}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            custom={i}
            variants={fadeIn}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">{card.title}</h3>
              <div className={`p-3 rounded-full ${card.iconBg}`}>{card.icon}</div>
            </div>
            <div className={`grid grid-cols-${card.stats.length} gap-4 text-center`}>
              {card.stats.map((stat, j) => (
                <div key={j}>
                  <p className={`text-2xl font-bold ${stat.color}`}>{formatNumber(stat.value)}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts and Actions */}
      <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Complaint Chart */}
        <motion.div className="bg-white p-6 rounded-xl shadow-md" variants={fadeIn}>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Complaints Status</h3>
          <div className="h-64">
            <div className="grid grid-cols-4 gap-2 text-center mb-4">
              {complaintsData.map((item, i) => (
                <div key={i} className="flex items-center justify-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                  <span className="text-sm">{item.name}</span>
                </div>
              ))}
            </div>
            <div className="flex h-48 items-end space-x-2">
              {complaintsData.map((item, i) => (
                <motion.div
                  key={i}
                  className="flex-1 flex flex-col items-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <div
                    className={`w-full rounded-t-md ${item.color}`}
                    style={{ height: `${(item.value / dashboardData.complaints.total) * 100}%` }}
                  ></div>
                  <span className="text-xs mt-1 text-gray-500">{item.name}</span>
                  <span className="text-xs font-medium">{item.value}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div className="bg-white p-6 rounded-xl shadow-md" variants={fadeIn}>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Add Tenant', icon: <User size={24} />, color: 'bg-blue-50 text-blue-600' },
              { label: 'Add Room', icon: <Home size={24} />, color: 'bg-green-50 text-green-600' },
              { label: 'Send Notice', icon: <Bell size={24} />, color: 'bg-purple-50 text-purple-600' },
              { label: 'Maintenance', icon: <Wrench size={24} />, color: 'bg-orange-50 text-orange-600' },
            ].map((action, i) => (
              <motion.button
                key={i}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
                className={`flex flex-col items-center justify-center p-4 rounded-lg ${action.color} hover:brightness-95 transition`}
              >
                {action.icon}
                <span>{action.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Notification */}
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </motion.div>
  );
};

export default LandlordDashboard;