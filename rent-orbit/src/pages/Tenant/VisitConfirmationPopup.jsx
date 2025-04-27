import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Home, Calendar, User, IndianRupee, MapPin, AlertCircle, Check, Ban, Clock } from 'lucide-react';

const VisitConfirmationPopup = ({ token, userType }) => {
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReasonPopup, setShowReasonPopup] = useState(false);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // New visibility state

  useEffect(() => {
    const fetchRequestData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/requests/requests-for-tenant",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRequest(res.data?.[0] || null);
      } catch (err) {
        if (err.response?.status === 404) {
          setRequest(null);
        } else {
          console.error("Request Fetch Error:", err);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchRequestData();
  }, [token]);
  

  const handleYesClick = async (id) => {
    try {
      await axios.put(
        `http://localhost:8000/api/requests/${id}`,
        { action: 'tenant-confirm' },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsVisible(false)
    } catch (error) {
      console.log(error)
    }
  };

  const handleReasonSubmit = async () => {
    if (!request) return;
    setIsSubmitting(true);
    try {
      await axios.post(
        `http://localhost:8000/api/requests/reject-request/${request._id}`,
        { reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsVisible(false);
    } catch (err) {
      alert('Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  if (loading) return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 grid place-items-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-8 animate-pulse">
        <div className="h-80 flex items-center justify-center">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto"></div>
            <p className="text-gray-600">Loading room details...</p>
          </div>
        </div>
      </div>
    </div>
  );

  if (!request) return null;

  return (
    <>
      {/* Main Popup */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-auto my-8 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                {userType === 'tenant' ? 'Room Visit Confirmation' : 'Tenant Visit Status'}
              </h2>
              <button onClick={() => setIsVisible(false)} className="text-white/80 hover:text-white">
                <X size={28} />
              </button>
            </div>
            <p className="mt-2 text-blue-100">
              {userType === 'tenant'
                ? 'Please confirm your visit status'
                : 'Update tenant visit information'}
            </p>
          </div>

          {/* Content */}
          <div className="grid md:grid-cols-3 gap-0">
            {/* Room Information */}
            <div className="md:col-span-2 p-6 border-r border-gray-200">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-100 rounded-xl overflow-hidden aspect-video flex items-center justify-center">
                  <div className="text-center p-4">
                    <Home className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Room Image</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <Home className="text-blue-600" /> Room Details
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Type</p>
                      <p className="text-gray-800 font-medium">
                        {request.room.roomType.join(' • ')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Rent</p>
                      <p className="text-gray-800 font-medium flex items-center gap-1">
                        <IndianRupee className="w-4 h-4" /> {request.room.rent}/month
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Location</p>
                      <p className="text-gray-800 font-medium flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> {request.room.address.city}, {request.room.address.state}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Visit Date</p>
                      <p className="text-gray-800 font-medium flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(request.visitDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Landlord Info */}
            <div className="p-6 bg-gray-50">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
                <User className="text-blue-600" /> Landlord Details
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="text-blue-600 w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{request.room.landlord.name}</p>
                    <p className="text-sm text-gray-500">Property Owner</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <a href={`mailto:${request.room.landlord.email}`} className="text-blue-600 hover:underline">
                      {request.room.landlord.email}
                    </a>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <a href={`tel:${request.room.landlord.phone}`} className="text-gray-800 hover:text-blue-600">
                      {request.room.landlord.phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-6 border-t border-gray-200 bg-white">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={()=>handleYesClick(request._id)}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg shadow hover:shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Check size={20} /> Confirm Room
              </button>
              <button
                onClick={() => setShowReasonPopup(true)}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg shadow hover:shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Ban size={20} /> Reject Room
              </button>
              <button
                onClick={() => setIsVisible(false)}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-medium rounded-lg shadow hover:shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Clock size={20} /> Not Visited
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reason Popup */}
      {showReasonPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 grid place-items-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 text-white">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Reason for Rejection</h2>
                <button
                  onClick={() => setShowReasonPopup(false)}
                  className="text-white/80 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <textarea
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all mb-6 min-h-[120px]"
                placeholder="Please share your reason (optional)"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
              <div className="flex gap-3">
                <button
                  onClick={handleReasonSubmit}
                  disabled={isSubmitting}
                  className={`flex-1 py-3 px-6 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg shadow hover:shadow-md transition-all ${isSubmitting ? 'opacity-70' : ''}`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
                <button
                  onClick={() => setShowReasonPopup(false)}
                  className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VisitConfirmationPopup;