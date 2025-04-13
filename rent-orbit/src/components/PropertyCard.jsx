import { MapPin, Home, Bed, Users } from 'lucide-react';

const PropertyCard = ({ property, onRequestClick, requestStatus, onCancelRequest, onViewDetails }) => {
  const fullAddress = `${property?.address?.houseNumber || ''}, ${property?.address?.street || ''}, ${property?.address?.locality || ''}, ${property?.address?.city || ''}, ${property?.address?.state || ''}`;

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 transform hover:-translate-y-1 flex flex-col md:flex-row">
      {/* Property Image - Left Side */}
      <div className="md:w-1/3 h-48 md:h-auto bg-gray-200 relative">
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

      {/* Property Details - Right Side */}
      <div className="md:w-2/3 p-4 flex flex-col">
        <div className="flex-grow">
          <h3 className="font-bold text-lg mb-1 text-gray-800">
            {(property?.accommodation?.[0] || 'Property')} - {(property?.roomType?.[0] || 'Room')}
          </h3>

          <div className="flex items-center text-gray-600 text-sm mb-3">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="line-clamp-1">{fullAddress || 'Address not available'}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center text-sm">
              <Bed className="h-4 w-4 mr-2 text-gray-500" />
              <span>{(property?.roomType?.find(rt => rt?.includes('BHK') || rt?.includes('RK')) || property?.roomType?.[0] || 'Room')}</span>
            </div>
            <div className="flex items-center text-sm">
              <Users className="h-4 w-4 mr-2 text-gray-500" />
              <span>Suitable for: {(Array.isArray(property?.suitableFor) ? property.suitableFor.join(', ') : 'Not specified')}</span>
            </div>
            <div className="flex items-center text-sm">
              <span className="font-medium">Deposit:</span>
              <span className="ml-1">{property?.deposit || 'Not specified'}</span>
            </div>
            <div className="flex items-center text-sm">
              <span className="font-medium">Payment:</span>
              <span className="ml-1">{property?.paymentPlan || 'Monthly'}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <button
            onClick={() => onViewDetails(property)}
            className="px-2 py-1 text-orange-600 border border-orange-600 rounded hover:bg-orange-50 transition-colors"
          >
            View Details
          </button>

          {requestStatus === 'pending' ? (
            <button
              onClick={onCancelRequest}
              className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
            >
              Pending
            </button>
          ) : requestStatus === 'confirmed' ? (
            <button
              className="px-3 py-1 bg-green-600 text-white rounded cursor-default"
            >
              Accepted
            </button>
          ) : (
            <button
              onClick={() => onRequestClick(property)}
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Request Visit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;