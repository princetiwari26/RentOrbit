import React from 'react';
import { DoorOpen, Wrench } from 'lucide-react';
import { motion } from 'framer-motion';
import { RequestCard } from './RequestCard';

export const RequestSection = ({ 
  title, 
  icon, 
  color, 
  requests, 
  expandedRequest, 
  setExpandedRequest, 
  handleStatusChange,
  isMaintenance 
}) => {
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={sectionVariants}
      className="mb-8"
    >
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        {icon}
        {title}
        <span className={`ml-2 ${color} text-sm font-medium px-2.5 py-0.5 rounded-full`}>
          {requests.length}
        </span>
      </h2>

      {requests.length > 0 ? (
        <div className="space-y-4">
          {requests.map(request => (
            <RequestCard
              key={request._id}
              request={request}
              expandedRequest={expandedRequest}
              setExpandedRequest={setExpandedRequest}
              handleStatusChange={handleStatusChange}
              isMaintenance={isMaintenance}
            />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl shadow-md p-8 text-center"
        >
          <p className="text-gray-500">No {title.toLowerCase()} found matching your filters</p>
        </motion.div>
      )}
    </motion.div>
  );
};