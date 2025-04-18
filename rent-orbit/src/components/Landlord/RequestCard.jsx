import React from 'react';
import {
    User,
    DoorOpen,
    Wrench,
    Calendar,
    Mail,
    Phone,
    Home,
    CheckCircle2,
    XCircle,
    MessageSquare,
    ArrowRight,
    ChevronDown,
    ChevronUp,
    Clock,
    Trash2,
    Zap,
    Droplets,
    Wifi,
    Hammer,
    CircleAlert,
    AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const getComplaintTypeIcon = (type) => {
    switch (type.toLowerCase()) {
        case 'electricity':
            return <Zap className="h-4 w-4 text-yellow-500" />;
        case 'plumbing':
            return <Droplets className="h-4 w-4 text-blue-500" />;
        case 'internet':
            return <Wifi className="h-4 w-4 text-indigo-500" />;
        case 'carpentry':
            return <Hammer className="h-4 w-4 text-amber-500" />;
        default:
            return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
};

export const RequestCard = ({
    request,
    expandedRequest,
    setExpandedRequest,
    handleStatusChange,
    handleDeleteComplaint,
    isMaintenance
}) => {
    const getTypeIcon = (type) => {
        if (isMaintenance) {
            return getComplaintTypeIcon(request.type);
        }
        switch (type) {
            case 'maintenance': return <Wrench className="h-4 w-4" />;
            default: return <DoorOpen className="h-4 w-4" />;
        }
    };

    const getStatusColor = (status) => {
        if (!status) return 'bg-gray-100 text-gray-800';

        switch (status.toLowerCase()) {
            case 'pending': return 'bg-orange-100 text-orange-800';
            case 'in-progress': return 'bg-blue-100 text-blue-800';
            case 'resolved': return 'bg-green-100 text-green-800';
            case 'approved': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatStatus = (status) => {
        if (!status) return 'Unknown';
        return status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ');
    };

    const formatComplaintType = (type) => {
        if (!type) return 'Maintenance';
        return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`bg-white rounded-xl shadow-md overflow-hidden ${!isMaintenance ? 'border-l-4 border-purple-500' : 'border-l-4 border-orange-500'}`}
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
                            <span className="ml-1">
                                {isMaintenance ? formatComplaintType(request.type) : 'Room Request'}
                            </span>
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
                                    {isMaintenance ? (
                                        <>
                                            <div className="mb-4">
                                                <div className="flex items-center mb-2">
                                                    {getComplaintTypeIcon(request.type)}
                                                    <span className="ml-2 font-medium">
                                                        {formatComplaintType(request.type)} Issue
                                                    </span>
                                                </div>
                                                <p className="text-gray-700">
                                                    {request.message || 'No additional details provided'}
                                                </p>
                                            </div>

                                            {request.room && (
                                                <div className="mb-4">
                                                    <h4 className="font-medium mb-2">Room Information</h4>
                                                    <div className="bg-gray-50 p-3 rounded-lg">
                                                        <p className="text-sm text-gray-500">Location</p>
                                                        <p className="font-medium">
                                                            {request.room?.address ?
                                                                `${request.room.address.houseNumber || ''} ${request.room.address.street || ''}, ${request.room.address.locality || ''}, ${request.room.address.city || ''}`
                                                                : 'Not specified'}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-gray-700 mb-4">
                                                {request.message || 'No additional details provided'}
                                            </p>
                                            {request.room && (
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
                                            )}
                                        </>
                                    )}

                                    {!isMaintenance && request.room?.photos?.length > 0 && (
                                        <div className="mb-4">
                                            <h4 className="font-medium mb-2">Room Photos</h4>
                                            <div className="flex space-x-2 overflow-x-auto pb-2">
                                                {request.room.photos.map((photo, index) => (
                                                    <motion.div
                                                        key={index}
                                                        className="h-40 w-60 rounded-md overflow-hidden flex-shrink-0"
                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ delay: index * 0.1 }}
                                                    >
                                                        <img
                                                            src={photo}
                                                            alt={`Room photo ${index}`}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-medium mb-3">{isMaintenance ? 'Tenant' : 'Applicant'} Information</h4>
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
                                            {isMaintenance && (
                                                <p className="flex items-center text-sm">
                                                    <Home className="h-4 w-4 mr-2 text-gray-500" />
                                                    {request.room?.address ?
                                                        `${request.room.address.houseNumber || ''} ${request.room.address.street || ''}, ${request.room.address.city || ''}`
                                                        : 'Not specified'}
                                                </p>
                                            )}
                                        </div>

                                        <h4 className="font-medium mt-6 mb-3">Request Actions</h4>
                                        <div className="space-y-2">
                                            {request.status === 'pending' && !isMaintenance && (
                                                <>
                                                    <motion.button
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        className="w-full flex items-center justify-center px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200"
                                                        onClick={() => handleStatusChange(request._id, 'approve')}
                                                    >
                                                        <CheckCircle2 className="h-4 w-4 mr-2" />
                                                        Approve Application
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        className="w-full flex items-center justify-center px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200"
                                                        onClick={() => handleStatusChange(request._id, 'landlord-cancel')}
                                                    >
                                                        <XCircle className="h-4 w-4 mr-2" />
                                                        Decline Application
                                                    </motion.button>
                                                </>
                                            )}
                                            {request.status === 'pending' && isMaintenance && (
                                                <>
                                                    <motion.button
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        className="w-full flex items-center justify-center px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200"
                                                        onClick={() => handleStatusChange(request._id, 'in-progress')}
                                                    >
                                                        <ArrowRight className="h-4 w-4 mr-2" />
                                                        Mark as In Progress
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        className="w-full flex items-center justify-center px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200"
                                                        onClick={() => handleStatusChange(request._id, 'resolved')}
                                                    >
                                                        <CheckCircle2 className="h-4 w-4 mr-2" />
                                                        Mark as Resolved
                                                    </motion.button>
                                                </>
                                            )}
                                            {request.status === 'in-progress' && isMaintenance && (
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="w-full flex items-center justify-center px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200"
                                                    onClick={() => handleStatusChange(request._id, 'resolved')}
                                                >
                                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                                    Mark as Resolved
                                                </motion.button>
                                            )}
                                            {isMaintenance && request.status === 'resolved' && (
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="w-full flex items-center justify-center px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200"
                                                    onClick={() => {

                                                        handleDeleteComplaint(request._id);

                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete Complaint
                                                </motion.button>
                                            )}
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                            >
                                                <MessageSquare className="h-4 w-4 mr-2" />
                                                Message {isMaintenance ? 'Tenant' : 'Applicant'}
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};