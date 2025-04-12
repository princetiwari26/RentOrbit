import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Search, Filter, Home, ArrowLeft, ChevronRight, ChevronLeft, X } from 'lucide-react';
import Notification from '../../components/Notification';
import PreLoader from '../../components/PreLoader';
import ErrorHandler from '../../components/ErrorHandler';
import PropertyCard from '../../components/PropertyCard';
import PropertyDetailedView from '../../components/PropertyDetailedView';
import FiltersModal from '../../components/FiltersModal';

const TenantDashboard = () => {
  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [propertiesPerPage] = useState(6);
  const [detailedView, setDetailedView] = useState(null);
  const [requests, setRequests] = useState([]);
  const [visitDate, setVisitDate] = useState('');
  const [message, setMessage] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const token = localStorage.getItem("token");

  // Filter options and state
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    accommodationType: [],
    roomType: [],
    suitableFor: [],
    deposit: [],
  });

  const filterOptions = {
    accommodationType: [
      "Flat/Apartment", "Independent House/Villa", "Paying Guest (PG)",
      "Hostel/Shared Room", "Service Apartment", "Studio Apartment",
    ],
    roomType: [
      "1 RK", "1 BHK", "2 BHK", "3 BHK", "4 BHK",
      "Single Occupancy", "Double Occupancy",
    ],
    suitableFor: [
      "Bachelors", "Working Professionals", "Students", "Families", "Couples",
    ],
    deposit: [
      "No Deposit", "1 Month Rent", "2 Months Rent", "3 Months Rent",
    ],
  };

  // Fetch properties with debounce
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        if (searchQuery.trim() !== "") {
          const params = new URLSearchParams();
          if (searchQuery) params.append('search', searchQuery);
          if (filters.minPrice) params.append('minPrice', filters.minPrice);
          if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

          ['accommodationType', 'roomType', 'suitableFor', 'deposit'].forEach(filter => {
            if (filters[filter]?.length > 0) {
              params.append(filter, filters[filter].join(','));
            }
          });

          const response = await axios.get(`http://localhost:8000/api/room/search?${params.toString()}`);
          setProperties(response.data.data || []);
          setFilteredProperties(response.data.data || []);
          setCurrentPage(1);
        } else {
          setProperties([]);
          setFilteredProperties([]);
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(fetchProperties, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, filters]);

  // Fetch tenant's requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/requests', {
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
        });
        setRequests(response.data);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    if (token) fetchRequests();
  }, [token]);

  // Apply filters
  useEffect(() => {
    let result = [...properties];

    // Price filter
    if (filters.minPrice) result = result.filter(p => p.rent >= parseInt(filters.minPrice));
    if (filters.maxPrice) result = result.filter(p => p.rent <= parseInt(filters.maxPrice));

    // Array filters
    ['accommodationType', 'roomType', 'suitableFor', 'deposit'].forEach(filter => {
      if (filters[filter].length > 0) {
        result = result.filter(p =>
          p[filter] && filters[filter].some(type =>
            Array.isArray(p[filter]) ? p[filter].includes(type) : p[filter] === type
          )
        );
      }
    });

    setFilteredProperties(result);
    setCurrentPage(1);
  }, [filters, properties]);

  const cancelRequest = async (id) => {
    try {
      await axios.put(
        `http://localhost:8000/api/requests/${id}`,
        { action: "tenant-cancel" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Refresh requests
      const response = await axios.get('http://localhost:8000/api/requests', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      setRequests(response.data);

      setNotification({
        message: 'Request cancelled successfully',
        type: 'success'
      });
    } catch (error) {
      console.error("Error:", error.response?.data?.message || error.message);
      setNotification({
        message: error.response?.data?.message || "Failed to cancel request",
        type: 'error'
      });
    }
  };

  // Define confirmRequest function
  const confirmRequest = async () => {
    try {
      await axios.post(
        "http://localhost:8000/api/requests",
        {
          roomId: selectedProperty._id,
          visitDate,
          message
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Refresh requests
      const response = await axios.get('http://localhost:8000/api/requests', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      setRequests(response.data);

      setShowRequestModal(false);
      setNotification({
        message: 'Your request has been sent to the landlord',
        type: 'success'
      });
    } catch (error) {
      console.error("Error:", error.response?.data?.message || error.message);
      setNotification({
        message: error.response?.data?.message || "Something went wrong.",
        type: 'error'
      });
    }
  };


  // Helper functions
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const toggleFilterOption = (filterType, option) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(option)
        ? prev[filterType].filter(item => item !== option)
        : [...prev[filterType], option]
    }));
  };

  const clearFilters = () => {
    setFilters({
      minPrice: '', maxPrice: '',
      accommodationType: [], roomType: [],
      suitableFor: [], deposit: [],
    });
    setSearchQuery("");
    setDetailedView(null);
    setShowFilters(false);
  };

  const handleRequestClick = (property) => {
    setSelectedProperty(property);
    // Calculate next 5 working days
    const today = new Date();
    const nextFiveDays = [];
    while (nextFiveDays.length < 5) {
      today.setDate(today.getDate() + 1);
      if (today.getDay() !== 0 && today.getDay() !== 6) {
        nextFiveDays.push(new Date(today));
      }
    }
    const firstDate = nextFiveDays[0];
    setVisitDate(`${firstDate.getFullYear()}-${String(firstDate.getMonth() + 1).padStart(2, '0')}-${String(firstDate.getDate()).padStart(2, '0')}`);
    setMessage('');
    setShowRequestModal(true);
  };

  const getRequestStatus = (propertyId) => {
    return requests.find(req => req.room._id === propertyId)?.status;
  };

  const getRequestId = (propertyId) => {
    return requests.find(req => req.room._id === propertyId)?._id;
  };

  // Render loading or error states
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <SearchSection
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setShowFilters={setShowFilters}
          clearFilters={clearFilters}
        />
        <div className="max-w-7xl mx-auto mt-6">
          <PreLoader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <SearchSection
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setShowFilters={setShowFilters}
          clearFilters={clearFilters}
        />
        <div className="max-w-7xl mx-auto mt-6">
          <ErrorHandler
            error={error}
            onRetry={() => {
              setError(null);
              setSearchQuery("");
            }}
          />
        </div>
      </div>
    );
  }

  // Pagination calculations
  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = filteredProperties.slice(indexOfFirstProperty, indexOfLastProperty);
  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Always visible search section */}
      <SearchSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setShowFilters={setShowFilters}
        clearFilters={clearFilters}
      />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6 mt-6">
          {/* Desktop Filters - Left Side */}
          <div className="hidden md:block w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Filter className="h-5 w-5" /> Filters
                </h3>
                <button onClick={clearFilters} className="text-sm text-green-600 hover:text-green-800">
                  Clear all
                </button>
              </div>

              <FilterSection
                filters={filters}
                filterOptions={filterOptions}
                toggleFilterOption={toggleFilterOption}
                handleFilterChange={(type, value) => setFilters(prev => ({ ...prev, [type]: value }))}
              />
            </div>
          </div>

          {/* Main Content - Right Side */}
          <div className="flex-1">
            {detailedView ? (
              <PropertyDetailedView
                property={detailedView}
                onRequestClick={handleRequestClick}
                requestStatus={getRequestStatus(detailedView._id)}
                onCancelRequest={() => cancelRequest(getRequestId(detailedView._id))}
                onBackClick={() => setDetailedView(null)}
              />
            ) : searchQuery.trim() === "" ? (
              <EmptyState
                icon={<Home className="h-12 w-12" />}
                title="Enter a location to search for properties"
                description="Start by typing a city, area, or landmark in the search bar above"
              />
            ) : filteredProperties.length === 0 ? (
              <EmptyState
                icon={<Home className="h-12 w-12" />}
                title="No properties found in this location"
                description="Try adjusting your filters or search for a different location"
                action={
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                }
              />
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6">
                  {currentProperties.map((property) => (
                    <PropertyCard
                      key={property._id}
                      property={property}
                      onRequestClick={handleRequestClick}
                      requestStatus={getRequestStatus(property._id)}
                      onCancelRequest={() => cancelRequest(getRequestId(property._id))}
                      onViewDetails={() => setDetailedView(property)}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    paginate={paginate}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      <FiltersModal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        filterOptions={filterOptions}
        toggleFilterOption={toggleFilterOption}
        handleFilterChange={(type, value) => setFilters(prev => ({ ...prev, [type]: value }))}
        clearFilters={clearFilters}
      />

      {/* Request Confirmation Modal */}
      <RequestModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        property={selectedProperty}
        visitDate={visitDate}
        setVisitDate={setVisitDate}
        message={message}
        setMessage={setMessage}
        confirmRequest={confirmRequest}
      />

      {/* Notification */}
      {notification.message && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification({ message: '', type: '' })}
        />
      )}
    </div>
  );
};

// Component Sub-sections
const SearchSection = ({ searchQuery, setSearchQuery, setShowFilters, clearFilters }) => (
  <div className="bg-white rounded-lg shadow-sm p-4">
    <div className="relative flex items-center">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="Enter your location to search for properties..."
        className="block w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-green-500"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        autoFocus
        required
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-2">
        <div className="md:hidden">
          <button
            type="button"
            onClick={() => setShowFilters(true)}
            className="p-1 text-gray-500 hover:text-green-600 transition-colors"
          >
            <Filter className="h-5 w-5" />
          </button>
        </div>
        <button
          type="button"
          onClick={clearFilters}
          className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  </div>
);

const FilterSection = ({ filters, filterOptions, toggleFilterOption, handleFilterChange }) => (
  <div className="space-y-6">
    {/* Price Range Filter */}
    <div>
      <h4 className="font-medium text-gray-700 mb-2">Price Range (₹/month)</h4>
      <div className="grid grid-cols-2 gap-2">
        <input
          type="number"
          placeholder="Min"
          className="w-full p-2 border border-gray-200 rounded-md text-sm"
          value={filters.minPrice}
          onChange={(e) => handleFilterChange('minPrice', e.target.value)}
        />
        <input
          type="number"
          placeholder="Max"
          className="w-full p-2 border border-gray-200 rounded-md text-sm"
          value={filters.maxPrice}
          onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
        />
      </div>
    </div>

    {/* Filter Groups */}
    {Object.entries(filterOptions).map(([filterType, options]) => (
      <div key={filterType}>
        <h4 className="font-medium text-gray-700 mb-2">
          {filterType.split(/(?=[A-Z])/).join(' ')}
        </h4>
        <div className="space-y-2">
          {options.map((option) => (
            <div key={option} className="flex items-center">
              <input
                type="checkbox"
                id={`${filterType}-${option}`}
                checked={filters[filterType].includes(option)}
                onChange={() => toggleFilterOption(filterType, option)}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor={`${filterType}-${option}`} className="ml-2 text-sm text-gray-700">
                {option}
              </label>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const EmptyState = ({ icon, title, description, action }) => (
  <div className="bg-white rounded-lg shadow-sm p-8 text-center animate-fadeIn">
    <div className="h-12 w-12 mx-auto mb-4 text-gray-400">{icon}</div>
    <h3 className="text-lg font-medium text-gray-700 mb-2">{title}</h3>
    <p className="text-gray-500 mb-4">{description}</p>
    {action}
  </div>
);

const Pagination = ({ currentPage, totalPages, paginate }) => (
  <div className="flex justify-center mt-8">
    <nav className="inline-flex rounded-md shadow">
      <button
        onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-colors"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
        <button
          key={number}
          onClick={() => paginate(number)}
          className={`px-4 py-2 border-t border-b border-gray-300 transition-colors ${currentPage === number ? 'bg-green-100 text-green-600' : 'bg-white text-gray-500 hover:bg-gray-50'
            }`}
        >
          {number}
        </button>
      ))}
      <button
        onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-colors"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </nav>
  </div>
);

const RequestModal = ({ isOpen, onClose, property, visitDate, setVisitDate, message, setMessage, confirmRequest }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Request Visit for {property?.accommodation?.[0] || 'Property'}
        </h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Visit Date</label>
          <input
            type="date"
            min={new Date().toISOString().split('T')[0]}
            className="w-full p-2 border border-gray-300 rounded-md"
            value={visitDate}
            onChange={(e) => setVisitDate(e.target.value)}
            required
          />
          <p className="text-xs text-gray-500 mt-1">Please select a date within next 5 working days</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Message to Landlord</label>
          <textarea
            placeholder="Add any additional information for the landlord..."
            className="w-full p-2 border border-gray-300 rounded-md"
            rows="3"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={confirmRequest}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Confirm Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default TenantDashboard;