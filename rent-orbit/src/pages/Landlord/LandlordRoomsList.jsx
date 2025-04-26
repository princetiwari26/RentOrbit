import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PreLoader from '../../components/PreLoader';
import ErrorHandler from '../../components/ErrorHandler';
import Notification from '../../components/Notification';
import { 
  ArrowLeft, 
  ChevronRight, 
  Check, 
  X, 
  Trash2, 
  MapPin, 
  IndianRupee, 
  Calendar, 
  FileText, 
  Users, 
  UserX, 
  Home, 
  Shield, 
  Wifi, 
  Snowflake, 
  Droplets, 
  Car, 
  BatteryCharging, 
  Key, 
  Dumbbell, 
  Sprout, 
  Shirt, 
  Tv, 
  WashingMachine,
  Loader2,
  AlertCircle,
  Plus
} from 'lucide-react';

const RoomCard = ({ room, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div
      className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden cursor-pointer transition-all hover:shadow-md flex flex-col md:flex-row h-full relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image on left - fixed width */}
      <div className="md:w-1/4 h-48 md:h-auto overflow-hidden relative bg-gray-100 flex items-center justify-center">
        {room.photos.length > 0 ? (
          <img
            src={room.photos[0]}
            alt="Room"
            className={`h-44 object-cover transition-transform duration-300 ${isHovered ? 'scale-105' : 'scale-100'}`}
          />
        ) : (
          <div className="text-gray-400">
            <Home className="h-12 w-12" />
          </div>
        )}
        <div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 rounded text-sm backdrop-blur-sm">
          {room.accommodation[0]}
        </div>
      </div>

      {/* Content on right - flexible width */}
      <div className="md:w-3/4 p-4 flex flex-col h-full">
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-800">
              {room.roomType[0]} in {room.address.city}
            </h3>
            <span
              className={`px-2 py-1 mr-10 rounded-full text-xs font-medium ${
                room.roomStatus === 'Active'
                  ? 'bg-green-200 text-green-800'
                  : room.roomStatus === 'Occupied'
                  ? 'bg-yellow-200 text-yellow-800'
                  : 'bg-red-200 text-red-900'
              }`}
            >
              {room.roomStatus}
            </span>
          </div>

          <p className="text-gray-600 mt-1 flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            {room.address.locality}, {room.address.street}
          </p>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left column */}
            <div className="space-y-2">
              <div className="flex items-center text-gray-700">
                <IndianRupee className="h-4 w-4 mr-2 text-gray-500" />
                <span className="font-medium">Rent:</span> ₹{room.rent.toLocaleString()}
              </div>

              <div className="flex items-center text-gray-700">
                <Shield className="h-4 w-4 mr-2 text-gray-500" />
                <span className="font-medium">Deposit:</span> ₹{room.cautionDeposit} ({room.securityDepositType})
              </div>

              <div className="flex items-center text-gray-700">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                <span className="font-medium">Posted:</span> {formatDate(room.createdAt)}
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-2">
              <div className="flex items-start text-gray-700">
                <Users className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                <div>
                  <span className="font-medium">Suitable for:</span> {room.suitableFor.length > 0 ? room.suitableFor.join(', ') : 'All'}
                </div>
              </div>

              <div className="flex items-start text-gray-700">
                <UserX className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                <div>
                  <span className="font-medium">Restrictions:</span> {room.restrictions.length > 0 ? room.restrictions.join(', ') : 'None'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Show more button */}
      <div
        className="absolute right-0 top-0 bottom-0 w-16 flex items-center justify-end pr-2"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <div className="relative h-full w-full">
          <div className="absolute inset-0 bg-gradient-to-l from-white to-transparent"></div>
          <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/70 rounded-full p-2 shadow-sm hover:bg-white transition-all group-hover:right-3">
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

const RoomDetails = ({ room, onBack, onDelete }) => {
  const [currentStatus, setCurrentStatus] = useState(room.isActive);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleStatusChange = async (confirmed) => {
    if (!confirmed) {
      setShowStatusConfirm(false);
      return;
    }

    setIsUpdating(true);
    try {
      const token = localStorage.getItem('token');
      const newStatus = !currentStatus;
      
      await axios.patch(
        `http://localhost:8000/api/room/${room._id}/status`,
        { isActive: newStatus },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      setCurrentStatus(newStatus);
      room.isActive = newStatus;
      room.roomStatus = newStatus ? 'Active' : 'Inactive';
      showNotification(`Room status updated to ${newStatus ? 'Active' : 'Inactive'}`);
    } catch (error) {
      console.error("Error updating status:", error);
      showNotification('Failed to update status', 'error');
    } finally {
      setIsUpdating(false);
      setShowStatusConfirm(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete();
      showNotification('Room deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      showNotification('Failed to delete room', 'error');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const isOccupied = room.roomStatus === 'Occupied';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transform transition-all duration-300">
      {/* Notification */}
      {notification && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification(null)}
        />
      )}

      {/* Header with back button */}
      <div className="border-b border-gray-200 px-4 flex items-center bg-gradient-to-r from-purple-100 to-white">
        <button
          onClick={onBack}
          className="mr-3 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
        >
          <ArrowLeft className="h-6 w-6 text-gray-600" />
        </button>
        <h2 className="text-xl font-bold text-gray-800">Room Details</h2>
      </div>

      {/* Content */}
      <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
        {/* Image Gallery */}
        <div className="mb-6">
          {room.photos.length > 0 ? (
            <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
              {room.photos.map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt={`Room ${index + 1}`}
                  className="h-64 w-auto rounded-lg object-cover shadow-md transition-transform duration-300 hover:scale-105"
                />
              ))}
            </div>
          ) : (
            <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-400">
                <Home className="h-12 w-12 mx-auto" />
                <p>No photos available</p>
              </div>
            </div>
          )}
        </div>

        {/* Basic Info */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">{room.roomType[0]} {room.accommodation[0]}</h3>
          <div className="flex items-center text-gray-600 mb-1">
            <MapPin className="h-5 w-5 mr-1" />
            <p>
              {room.address.houseNumber}, {room.address.street}, {room.address.locality},<br />
              {room.address.city}, {room.address.state} - {room.address.pincode}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-4">
            <div className="flex items-center text-gray-600">
              <IndianRupee className="h-5 w-5 mr-1" />
              <p>₹{room.rent.toLocaleString()}/month</p>
            </div>

            <div className="flex items-center text-gray-600">
              <Shield className="h-5 w-5 mr-1" />
              <p>₹{room.cautionDeposit} ({room.securityDepositType})</p>
            </div>

            <div className="flex items-center text-gray-600">
              <Calendar className="h-5 w-5 mr-1" />
              <p>{new Date(room.createdAt).toLocaleDateString()}</p>
            </div>

            {!isOccupied && (
              <button
                onClick={() => setShowStatusConfirm(true)}
                className={`px-3 py-1 rounded-full text-sm font-medium flex items-center transition-all duration-200 ${
                  currentStatus
                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                }`}
              >
                {isUpdating ? (
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                ) : currentStatus ? (
                  <Check className="w-4 h-4 mr-1 text-green-500" />
                ) : (
                  <X className="w-4 h-4 mr-1 text-gray-500" />
                )}
                {currentStatus ? 'Active' : 'Inactive'}
              </button>
            )}
          </div>
        </div>

        {/* Description */}
        {room.description && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
              <FileText className="h-5 w-5 mr-1" />
              Description
            </h4>
            <p className="text-gray-600">{room.description}</p>
          </div>
        )}

        {/* Room Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Room Information</h4>
            <div className="space-y-2">
              <div className="flex items-center text-gray-600">
                <span className="font-medium w-32">Accommodation:</span>
                <span>{room.accommodation.join(', ')}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <span className="font-medium w-32">Room Type:</span>
                <span>{room.roomType.join(', ')}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <span className="font-medium w-32">Payment Plan:</span>
                <span>{room.paymentPlan}</span>
              </div>
              {room.joiningDate && (
                <div className="flex items-center text-gray-600">
                  <span className="font-medium w-32">Joining Date:</span>
                  <span>{new Date(room.joiningDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Tenant Preferences</h4>
            <div className="space-y-2">
              <div className="flex items-start text-gray-600">
                <span className="font-medium w-32">Suitable For:</span>
                <span>{room.suitableFor.length > 0 ? room.suitableFor.join(', ') : 'All'}</span>
              </div>
              <div className="flex items-start text-gray-600">
                <span className="font-medium w-32">Restrictions:</span>
                <span>{room.restrictions.length > 0 ? room.restrictions.join(', ') : 'None'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Address Details */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Address Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center text-gray-600">
                <span className="font-medium w-24">House No:</span>
                <span>{room.address.houseNumber}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <span className="font-medium w-24">Street:</span>
                <span>{room.address.street}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <span className="font-medium w-24">Locality:</span>
                <span>{room.address.locality}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <span className="font-medium w-24">Landmark:</span>
                <span>{room.address.landmark || 'None'}</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center text-gray-600">
                <span className="font-medium w-24">City:</span>
                <span>{room.address.city}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <span className="font-medium w-24">District:</span>
                <span>{room.address.district}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <span className="font-medium w-24">State:</span>
                <span>{room.address.state}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <span className="font-medium w-24">Pincode:</span>
                <span>{room.address.pincode}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with action buttons */}
      <div className="border-t border-gray-200 p-4">
        {!isOccupied && (
          <button
            onClick={handleDeleteClick}
            className={`w-full px-4 py-2 rounded-lg transition-colors flex items-center justify-center ${
              isDeleting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
            disabled={isDeleting || isOccupied}
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-5 w-5 mr-2" />
                Delete Room
              </>
            )}
          </button>
        )}
        {isOccupied && (
          <div className="w-full text-center py-2 text-yellow-700 bg-yellow-100 rounded-lg flex items-center justify-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            This room is currently occupied. Actions are disabled until the tenant moves out.
          </div>
        )}
      </div>

      {/* Status change confirmation modal */}
      {showStatusConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg max-w-md w-full animate-fadeIn">
            <h3 className="text-lg font-bold mb-4">Confirm Status Change</h3>
            <p className="mb-6">
              Are you sure you want to change this room's status to{' '}
              <span className={`font-semibold ${currentStatus ? 'text-red-500' : 'text-green-500'}`}>
                {currentStatus ? 'Inactive' : 'Active'}
              </span>
              ?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowStatusConfirm(false)}
                className="px-4 py-2 border text-slate-800 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleStatusChange(true)}
                className={`px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity ${
                  currentStatus ? 'bg-red-500' : 'bg-green-500'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg max-w-md w-full animate-fadeIn">
            <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
            <p className="mb-6">Are you sure you want to delete this room? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border text-slate-800 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center"
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Confirm Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const LandlordRoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [view, setView] = useState('list');
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('User is not authenticated');
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get('http://localhost:8000/api/room', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        if (response.data.success) {
          setRooms(response.data.data);
          if (response.data.data.length === 0) {
            // No rooms found, but this is not an error
            setError(null);
          }
        } else {
          setError(response.data.message || 'Failed to fetch rooms');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCardClick = (room) => {
    setSelectedRoom(room);
    setView('details');
  };

  const handleBackToList = () => {
    setView('list');
  };

  const handleDeleteRoom = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/api/room/${selectedRoom._id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      setRooms(rooms.filter(r => r._id !== selectedRoom._id));
      setView('list');
      showNotification('Room deleted successfully');
      return Promise.resolve();
    } catch (error) {
      showNotification('Failed to delete room', 'error');
      console.error('Delete error:', error);
      return Promise.reject(error);
    }
  };

  if (loading) {
    return <PreLoader />;
  }

  // Only show error handler if there's an actual error (not just empty data)
  if (error && !(rooms.length === 0 && !error)) {
    return <ErrorHandler error={error} />;
  }

  return (
    <div className="w-full">
      {notification && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification(null)}
        />
      )}

      {view === 'list' ? (
        <div className="max-w-6xl mx-auto px-4 md:p-6">

          {rooms.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-lg border border-gray-200">
              <Home className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 mb-4">No rooms available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {rooms.map(room => (
                <RoomCard
                  key={room._id}
                  room={room}
                  onClick={() => handleCardClick(room)}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-full mx-auto">
          <RoomDetails
            room={selectedRoom}
            onBack={handleBackToList}
            onDelete={handleDeleteRoom}
          />
        </div>
      )}
    </div>
  );
};

export default LandlordRoomList;