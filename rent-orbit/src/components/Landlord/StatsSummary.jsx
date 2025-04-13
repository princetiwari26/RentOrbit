import React from 'react';
import { Bell, DoorOpen, Wrench, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const statVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5
    }
  })
};

export const StatsSummary = ({ requests }) => {
  const stats = [
    {
      icon: <Bell className="h-6 w-6 text-indigo-600" />,
      bgColor: 'bg-indigo-100',
      label: 'Total Requests',
      value: requests.length
    },
    {
      icon: <DoorOpen className="h-6 w-6 text-purple-600" />,
      bgColor: 'bg-purple-100',
      label: 'Room Requests',
      value: requests.filter(r => r.type !== 'maintenance').length
    },
    {
      icon: <Wrench className="h-6 w-6 text-orange-600" />,
      bgColor: 'bg-orange-100',
      label: 'Maintenance',
      value: requests.filter(r => r.type === 'maintenance').length
    },
    {
      icon: <CheckCircle2 className="h-6 w-6 text-green-600" />,
      bgColor: 'bg-green-100',
      label: 'Completed',
      value: requests.filter(r => r.status === 'occupied').length
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          custom={index}
          initial="hidden"
          animate="visible"
          variants={statVariants}
          className="bg-white rounded-xl shadow-md p-4 flex items-center"
        >
          <div className={`${stat.bgColor} p-3 rounded-full mr-4`}>
            {stat.icon}
          </div>
          <div>
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};