import React, { useState } from 'react';
import { 
  X, 
  Home, 
  MapPin, 
  DollarSign, 
  Calendar, 
  User, 
  Phone, 
  Mail,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

const OccupiedRoomDetails = ({ room, onClose }) => {
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [complaint, setComplaint] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [complaintSubmitted, setComplaintSubmitted] = useState(false);

  const handleSubmitComplaint = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Here you would typically make an API call to submit the complaint
      // await axios.post('/api/complaints', { complaint, roomId: room._id });
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setComplaintSubmitted(true);
      setComplaint('');
    } catch (error) {
      console.error('Error submitting complaint:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold flex items-center">
            <Home className="mr-2" size={20} />
            Room Details
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {/* Room Images */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Room Photos</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {room.photos.length > 0 ? (
                room.photos.map((photo, index) => (
                  <div key={index} className="rounded-lg overflow-hidden h-40">
                    <img 
                      src={photo} 
                      alt={`Room ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-3 py-8 text-center bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No photos available</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Room Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Room Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Accommodation Type</p>
                  <p className="font-medium">{room.accommodation.join(', ')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Room Type</p>
                  <p className="font-medium">{room.roomType.join(', ')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Suitable For</p>
                  <p className="font-medium">
                    {room.suitableFor.length > 0 ? room.suitableFor.join(', ') : 'Not specified'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Restrictions</p>
                  <p className="font-medium">
                    {room.restrictions.length > 0 ? room.restrictions.join(', ') : 'None'}
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Financial Details</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <DollarSign className="mr-2 text-gray-500" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">Monthly Rent</p>
                    <p className="font-medium">₹{room.rent.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <DollarSign className="mr-2 text-gray-500" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">Security Deposit</p>
                    <p className="font-medium">₹{room.cautionDeposit.toLocaleString()}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Deposit Type</p>
                  <p className="font-medium">{room.securityDepositType || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Plan</p>
                  <p className="font-medium">{room.paymentPlan || 'Not specified'}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Address */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <MapPin className="mr-2" size={20} />
              Address
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              {room.address ? (
                <div>
                  <p>{room.address.houseNumber} {room.address.street}</p>
                  <p>{room.address.locality}</p>
                  <p>{room.address.landmark && `${room.address.landmark}, `}{room.address.city}</p>
                  <p>{room.address.district}, {room.address.state} - {room.address.pincode}</p>
                  <p>{room.address.country}</p>
                </div>
              ) : (
                <p className="text-gray-500">Address not available</p>
              )}
            </div>
          </div>
          
          {/* Landlord Details */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <User className="mr-2" size={20} />
              Landlord Information
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              {room.landlord ? (
                <div className="flex items-start">
                  <img 
                    src={room.landlord.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(room.landlord.name)}&background=random`}
                    alt="Landlord"
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-medium">{room.landlord.name}</h4>
                    <p className="text-gray-600 flex items-center mt-1">
                      <Phone className="mr-2" size={14} />
                      {room.landlord.phone || 'Not available'}
                    </p>
                    <p className="text-gray-600 flex items-center mt-1">
                      <Mail className="mr-2" size={14} />
                      {room.landlord.email || 'Not available'}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Landlord information not available</p>
              )}
            </div>
          </div>
          
          {/* Occupancy Details */}
          {room.joiningDate && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Calendar className="mr-2" size={20} />
                Occupancy Details
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="flex items-center">
                  <Calendar className="mr-2 text-gray-500" size={16} />
                  <span className="font-medium">Date of Joining: </span>
                  <span className="ml-2">
                    {new Date(room.joiningDate).toLocaleDateString()}
                  </span>
                </p>
              </div>
            </div>
          )}
          
          {/* Complaint Section */}
          <div>
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <AlertCircle className="mr-2" size={20} />
              Report an Issue
            </h3>
            {complaintSubmitted ? (
              <div className="bg-green-50 text-green-700 p-4 rounded-lg">
                Your complaint has been submitted successfully. We'll get back to you soon.
              </div>
            ) : showComplaintForm ? (
              <form onSubmit={handleSubmitComplaint} className="bg-gray-50 p-4 rounded-lg">
                <textarea
                  value={complaint}
                  onChange={(e) => setComplaint(e.target.value)}
                  className="w-full p-3 border rounded-lg mb-3"
                  rows="4"
                  placeholder="Describe your complaint or issue..."
                  required
                ></textarea>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowComplaintForm(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-75"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setShowComplaintForm(true)}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
              >
                File a Complaint
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OccupiedRoomDetails;