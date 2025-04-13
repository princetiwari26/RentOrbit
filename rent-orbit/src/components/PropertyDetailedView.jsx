import { MapPin, Home, Bed, Users, ArrowLeft } from 'lucide-react';

const PropertyDetailedView = ({ property, onRequestClick, requestStatus, onCancelRequest, onBackClick }) => {
  const fullAddress = `${property?.address?.houseNumber || ''}, ${property?.address?.street || ''}, ${property?.address?.locality || ''}, ${property?.address?.city || ''}, ${property?.address?.state || ''}`;

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-fadeIn">
      {/* Back button */}
      <button
        onClick={onBackClick}
        className="flex items-center text-red-600 p-4 hover:text-red-800 font-semibold transition-colors mb-4"
      >
        <ArrowLeft className="h-5 w-5 mr-1" /> Back to results
      </button>

      {/* Property Image */}
      <div className="w-full h-64 bg-gray-200 relative">
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
        {property.photos.length > 0 ? (
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {property.photos.map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt={`Room ${index + 1}`}
                  className="h-64 w-auto rounded-lg object-cover"
                />
              ))}
            </div>
          ) : (
            <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p>No photos available</p>
              </div>
            </div>
          )}
        </div>
        <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
          ₹{property?.rent || 'N/A'}/month
        </div>
      </div>

      {/* Property Details */}
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-2 text-gray-800">
          {property?.accommodation?.join(', ') || 'Property'} - {property?.roomType?.join(", ") || 'Room'}
        </h1>
        
        <div className="flex items-center text-gray-600 mb-4">
          <MapPin className="h-5 w-5 mr-1 flex-shrink-0" />
          <span>{fullAddress || 'Address not available'}</span>
        </div>
        
        {/* Key Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <Bed className="h-6 w-6 text-gray-500 mb-1" />
            <span className="text-sm font-medium">Room Type</span>
            <span className="text-sm text-gray-600">
              {property?.roomType?.join(', ') || 'N/A'}
            </span>
          </div>
          
          <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <Users className="h-6 w-6 text-gray-500 mb-1" />
            <span className="text-sm font-medium">Suitable For</span>
            <span className="text-sm text-gray-600">
              {Array.isArray(property?.suitableFor) ? property.suitableFor.join(', ') : 'Not specified'}
            </span>
          </div>
          
          <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <span className="text-sm font-medium">Caution Deposit</span>
            <span className="text-sm text-gray-600">
            ₹{property?.cautionDeposit || 'Not specified'}
            </span>
          </div>
          
          <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <span className="text-sm font-medium">Payment</span>
            <span className="text-sm text-gray-600">
              {property?.paymentPlan || 'Monthly'}
            </span>
          </div>
        </div>
        
        {/* Description */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2 text-gray-800">Description</h2>
          <p className="text-gray-600">
            {property?.description || 'No description available'}
          </p>
        </div>
        
        {/* Restrictions */}
        {property?.restriction?.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2 text-gray-800">Restrictions</h2>
            <div className="flex flex-wrap gap-2">
              {property.restriction.map((restriction, index) => (
                <span key={index} className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full hover:bg-gray-200 transition-colors">
                  {restriction}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Amenities */}
        {property?.amenities?.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2 text-gray-800">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {property.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                  <span className="text-gray-600">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Action Button */}
        <div className="mt-8">
          {requestStatus === 'pending' ? (
            <button
              onClick={onCancelRequest}
              className="w-full md:w-auto px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Cancel Pending Request
            </button>
          ) : requestStatus === 'accepted' ? (
            <button
              className="w-full md:w-auto px-6 py-3 bg-green-600 text-white rounded-lg cursor-default"
            >
              Request Accepted
            </button>
          ) : (
            <button
              onClick={() => onRequestClick(property)}
              className="w-full md:w-auto px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Request Visit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailedView;