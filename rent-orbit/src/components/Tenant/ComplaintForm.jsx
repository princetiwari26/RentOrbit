import React, { useState } from 'react';
import { AlertCircle, X, CheckCircle, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PreLoader from '../PreLoader';
import ErrorHandler from '../ErrorHandler';
import Notification from '../Notification';

const ComplaintForm = ({ roomId, onClose, onSubmit }) => {
  const [complaint, setComplaint] = useState('');
  const [complaintType, setComplaintType] = useState('electricity');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('');

  const complaintTypes = [
    { value: 'electricity', label: 'Electricity Issue' },
    { value: 'plumbing', label: 'Plumbing Issue' },
    { value: 'security', label: 'Security Concern' },
    { value: 'internet', label: 'Internet Problem' },
    { value: 'cleanliness', label: 'Cleanliness Issue' },
    { value: 'noise', label: 'Noise Complaint' },
    { value: 'other', label: 'Other Issue' }
  ];

  const showErrorNotification = (message) => {
    setNotificationType('error');
    setNotificationMessage(message);
    setShowNotification(true);
  };

  const showSuccessNotification = (message) => {
    setNotificationType('success');
    setNotificationMessage(message);
    setShowNotification(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!complaint.trim()) {
      setError('Please describe your complaint');
      showErrorNotification('Please describe your complaint');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit({
        roomId,
        type: complaintType,
        description: complaint.trim()
      });
      setIsSuccess(true);
      showSuccessNotification('Complaint submitted successfully!');

      // Reset form after successful submission
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to submit complaint. Please try again.';
      setError(errorMsg);
      showErrorNotification(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitting && !isSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <PreLoader />
      </div>
    );
  }

  if (error && !isSubmitting) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <ErrorHandler
          error={error}
          onRetry={() => {
            setError(null);
            setIsSubmitting(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <AnimatePresence>
        {showNotification && (
          <Notification
            type={notificationType}
            message={notificationMessage}
            onClose={() => setShowNotification(false)}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 20 }}
        className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden"
      >
        <div className="sticky top-0 bg-gradient-to-r from-orange-600 to-red-600 p-3 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <AlertCircle className="mr-2" size={20} />
            File a Complaint
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
            disabled={isSubmitting}
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8"
            >
              <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-800 mb-2">Complaint Submitted Successfully!</h3>
              <p className="text-gray-600">Your complaint has been received and will be processed soon.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Complaint Type
                </label>
                <select
                  value={complaintType}
                  onChange={(e) => setComplaintType(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  disabled={isSubmitting}
                >
                  {complaintTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={complaint}
                  onChange={(e) => setComplaint(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  rows="5"
                  placeholder="Describe your complaint in detail..."
                  disabled={isSubmitting}
                />
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 flex items-center text-red-600 text-sm"
                  >
                    <AlertTriangle className="mr-1" size={16} />
                    {error}
                  </motion.div>
                )}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all font-medium shadow-md hover:shadow-lg disabled:opacity-75 flex items-center justify-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    'Submit Complaint'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ComplaintForm;