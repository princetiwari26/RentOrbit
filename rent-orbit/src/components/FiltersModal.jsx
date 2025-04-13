import { X, Filter } from 'lucide-react';

const FiltersModal = ({ 
  isOpen, 
  onClose, 
  filters, 
  filterOptions, 
  toggleFilterOption, 
  handleFilterChange, 
  clearFilters 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-4 sticky top-0 bg-white border-b flex justify-between items-center">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" /> Filters
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-4">
          {/* Price Range Filter */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-700 mb-2">Price Range (₹/month)</h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Min</label>
                <input
                  type="number"
                  placeholder="Min"
                  className="w-full p-2 border border-gray-200 rounded-md text-sm"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Max</label>
                <input
                  type="number"
                  placeholder="Max"
                  className="w-full p-2 border border-gray-200 rounded-md text-sm"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Accommodation Type Filter */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-700 mb-2">Accommodation Type</h4>
            <div className="space-y-2">
              {filterOptions.accommodationType.map((option) => (
                <div key={option} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`accommodation-${option}`}
                    checked={filters.accommodationType.includes(option)}
                    onChange={() => toggleFilterOption('accommodationType', option)}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`accommodation-${option}`} className="ml-2 text-sm text-gray-700">
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Room Type Filter */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-700 mb-2">Room Type</h4>
            <div className="space-y-2">
              {filterOptions.roomType.map((option) => (
                <div key={option} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`room-${option}`}
                    checked={filters.roomType.includes(option)}
                    onChange={() => toggleFilterOption('roomType', option)}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`room-${option}`} className="ml-2 text-sm text-gray-700">
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Suitable For Filter */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-700 mb-2">Suitable For</h4>
            <div className="space-y-2">
              {filterOptions.suitableFor.map((option) => (
                <div key={option} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`suitableFor-${option}`}
                    checked={filters.suitableFor.includes(option)}
                    onChange={() => toggleFilterOption('suitableFor', option)}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`suitableFor-${option}`} className="ml-2 text-sm text-gray-700">
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Deposit Filter */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-700 mb-2">Deposit Type</h4>
            <div className="space-y-2">
              {filterOptions.deposit.map((option) => (
                <div key={option} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`deposit-${option}`}
                    checked={filters.deposit.includes(option)}
                    onChange={() => toggleFilterOption('deposit', option)}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`deposit-${option}`} className="ml-2 text-sm text-gray-700">
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t flex justify-between">
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-gray-700 hover:text-gray-900"
          >
            Clear All
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FiltersModal;