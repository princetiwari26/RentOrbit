import { useState } from "react";
import { X, ChevronDown, Plus, Minus, Upload, Image as ImageIcon } from "lucide-react";
import axios from 'axios';
import Notification from '../../components/Notification';
import PreLoader from '../../components/PreLoader'; // Import the PreLoader component

// Item Component with Add/Remove buttons
const SelectableItem = ({ text, isSelected, onAdd, onRemove }) => {
  return (
    <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm border ${
      isSelected ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200 hover:bg-gray-100"
    }`}>
      {text}
      {isSelected ? (
        <button 
          type="button" // Add type="button" to prevent form submission
          onClick={onRemove}
          className="text-red-400 hover:text-red-600 transition-colors"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
      ) : (
        <button 
          type="button" // Add type="button" to prevent form submission
          onClick={onAdd}
          className="text-green-400 hover:text-green-600 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
};

// Custom Select Component
const CustomSelect = ({ options, value, onChange, label, placeholder, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative mb-4 ${className}`}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <div
        className={`w-full p-2 border rounded-md cursor-pointer flex justify-between items-center bg-white ${
          isOpen ? "border-blue-400 ring-1 ring-blue-200" : "border-gray-200"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? "" : "text-gray-400"}>
          {value || placeholder}
        </span>
        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </div>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {options.map((option, index) => (
            <div
              key={index}
              className="p-2 hover:bg-blue-50 cursor-pointer text-sm"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const LandLordAddRoom = () => {
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [formData, setFormData] = useState({
    accommodation: [],
    roomType: [],
    address: {
      houseNumber: "",
      street: "",
      locality: "",
      landmark: "",
      city: "",
      district: "",
      state: "",
      pincode: "",
      country: "India",
    },
    deposit: "",
    paymentPlan: "",
    tenant: [],
    restriction: [],
    rent: "",
    caution: "",
    description: "",
  });
  const [photos, setPhotos] = useState([]);
  const [photoFiles, setPhotoFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Available options
  const options = {
    accommodation: [
      "Flat/Apartment",
      "Independent House/Villa",
      "Paying Guest (PG)",
      "Hostel/Shared Room",
      "Service Apartment",
      "Studio Apartment",
      "Penthouse",
      "Farm House",
      "Villa/Bungalow",
      "Row House",
      "Chawl Room",
      "Houseboat",
      "Cottage",
      "Tree House",
      "Traditional Haveli/Wada"
    ],
    roomType: [
      "1 RK",
      "1 BHK",
      "2 BHK",
      "3 BHK",
      "4 BHK",
      "Single Occupancy",
      "Double Occupancy",
      "Triple Occupancy",
      "Dormitory",
      "Shared Room",
      "Private Room",
      "Entire Place"
    ],
    countries: ["India"],
    states: {
      India: ["Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Uttar Pradesh", "West Bengal", "Gujarat"],
    },
    cities: {
      Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"],
      Delhi: ["New Delhi", "Noida", "Gurgaon", "Faridabad", "Ghaziabad"],
      Karnataka: ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum"],
      "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
      "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra", "Allahabad"],
      "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri"],
      "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar"],
    },
    districts: {
      Maharashtra: ["Mumbai City", "Mumbai Suburban", "Pune", "Thane", "Nagpur"],
      Delhi: ["Central Delhi", "New Delhi", "South Delhi", "East Delhi", "North Delhi"],
      Karnataka: ["Bangalore Urban", "Mysore", "Dakshina Kannada", "Belgaum", "Hubli-Dharwad"],
    },
    deposit: ["No Deposit", "1 Month Rent", "2 Months Rent", "3 Months Rent", "6 Months Rent", "Negotiable"],
    paymentPlans: ["Monthly", "Quarterly", "Half-Yearly", "Yearly", "Daily (Short Stay)"],
    tenant: ["Bachelors", "Working Professionals", "Students", "Families", "Senior Citizens", "Couples"],
    restrictions: ["No Smoking", "No Alcohol", "No Non-Veg", "No Pets", "Vegetarian Only", "Girls Only", "Boys Only", "Family Only", "No Guests"],
  };

  // Handle adding/removing items
  const handleToggleItem = (type, item) => {
    setFormData(prev => {
      const currentItems = prev[type];
      if (currentItems.includes(item)) {
        return {
          ...prev,
          [type]: currentItems.filter(i => i !== item)
        };
      } else {
        return {
          ...prev,
          [type]: [...currentItems, item]
        };
      }
    });
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle select changes
  const handleSelectChange = (name, value) => {
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle image selection
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + photoFiles.length > 5) {
      setNotification({ message: 'You can upload maximum 5 images', type: 'error' });
      return;
    }

    // Create preview URLs
    const newPhotos = files.map(file => URL.createObjectURL(file));
    setPhotos(prev => [...prev, ...newPhotos]);
    setPhotoFiles(prev => [...prev, ...files]);
  };

  // Handle image removal
  const handleRemoveImage = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
    setPhotoFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate at least one image is uploaded
    if (photoFiles.length === 0) {
      setNotification({ message: 'Please upload at least one image', type: 'error' });
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setNotification({ message: 'User is not authenticated', type: 'error' });
      return;
    }

    setUploading(true);

    try {
      // Create FormData object
      const formDataToSend = new FormData();

      // Append all form data
      formDataToSend.append('accommodation', JSON.stringify(formData.accommodation));
      formDataToSend.append('roomType', JSON.stringify(formData.roomType));
      formDataToSend.append('address', JSON.stringify(formData.address));
      formDataToSend.append('rent', formData.rent);
      formDataToSend.append('cautionDeposit', formData.caution);
      formDataToSend.append('securityDepositType', formData.deposit);
      formDataToSend.append('paymentPlan', formData.paymentPlan);
      formDataToSend.append('suitableFor', JSON.stringify(formData.tenant));
      formDataToSend.append('restrictions', JSON.stringify(formData.restriction));
      formDataToSend.append('description', formData.description);

      // Append all image files
      photoFiles.forEach((file, index) => {
        formDataToSend.append(`photos`, file);
      });

      // Make API call
      const response = await axios.post(
        'http://localhost:8000/api/room',
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Reset form on success
      setFormData({ 
        accommodation: [],
        roomType: [],
        address: {
          houseNumber: "",
          street: "",
          locality: "",
          landmark: "",
          city: "",
          district: "",
          state: "",
          pincode: "",
          country: "India",
        },
        deposit: "",
        paymentPlan: "",
        tenant: [],
        restriction: [],
        rent: "",
        caution: "",
        description: "",
      });
      setPhotos([]);
      setPhotoFiles([]);
      setNotification({ message: 'Room added successfully!', type: 'success' });
      
    } catch (error) {
      setNotification({ 
        message: error.response?.data?.message || 'Failed to create Room! Please try again later', 
        type: 'error' 
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-2 relative">
      {/* Overlay with PreLoader when uploading */}
      {uploading && (
        <div className="fixed inset-0 bg-black bg-opacity-10 z-50 flex items-center justify-center">
            <PreLoader />
        </div>
      )}

      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm p-8 border border-gray-100">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">
          List Your Property
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Image Upload Section - Moved to top */}
          <Section title="Property Images">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Images (1-5 images required)
              </label>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col gap-4">
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="h-10 w-10 text-gray-400 mb-3" />
                      <p className="text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, JPEG (Max 5 images)
                      </p>
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      multiple 
                      accept="image/*" 
                      onChange={handleImageSelect}
                      disabled={photoFiles.length >= 5 || uploading}
                    />
                  </label>
                  <div className="text-sm text-gray-500">
                    {photoFiles.length > 0 ? (
                      <span className="text-green-600 font-medium">{photoFiles.length} image(s) selected</span>
                    ) : (
                      "No images selected yet"
                    )}
                    <span className="block">Maximum 5 images allowed</span>
                  </div>
                </div>
                
                {/* Preview selected images */}
                <div className="flex-1">
                  {photos.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {photos.map((photo, index) => (
                        <div key={index} className="relative group">
                          <div className="w-full h-48 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                            <img 
                              src={photo} 
                              alt={`Property ${index + 1}`} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-80 hover:opacity-100 transition-opacity shadow-md"
                          >
                            <X className="h-4 w-4" />
                          </button>
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                            <p className="text-white text-xs truncate">Image {index + 1}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-48 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                      <div className="text-center">
                        <ImageIcon className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Image preview will appear here</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Section>

          {/* Property Type Section */}
          <Section title="Property Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Accommodation Type
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {options.accommodation.map((item) => (
                    <SelectableItem
                      key={item}
                      text={item}
                      isSelected={formData.accommodation.includes(item)}
                      onAdd={() => handleToggleItem("accommodation", item)}
                      onRemove={() => handleToggleItem("accommodation", item)}
                    />
                  ))}
                </div>
                <div className="min-h-12 p-3 border-2 border-gray-200 rounded-lg flex flex-wrap gap-2 bg-white">
                  {formData.accommodation.length > 0 ? (
                    formData.accommodation.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 bg-green-50 px-3 py-1 rounded-full text-sm border border-green-100"
                      >
                        {item}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm">No accommodation type selected</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Room Type
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {options.roomType.map((item) => (
                    <SelectableItem
                      key={item}
                      text={item}
                      isSelected={formData.roomType.includes(item)}
                      onAdd={() => handleToggleItem("roomType", item)}
                      onRemove={() => handleToggleItem("roomType", item)}
                    />
                  ))}
                </div>
                <div className="min-h-12 p-3 border-2 border-gray-200 rounded-lg flex flex-wrap gap-2 bg-white">
                  {formData.roomType.length > 0 ? (
                    formData.roomType.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 bg-green-50 px-3 py-1 rounded-full text-sm border border-green-100"
                      >
                        {item}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm">No room type selected</p>
                  )}
                </div>
              </div>
            </div>
          </Section>

          {/* Location Section */}
          <Section title="Property Address">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    House Number/Name
                  </label>
                  <input
                    type="text"
                    name="address.houseNumber"
                    placeholder="e.g., 12A, Sunshine Apartments"
                    className="w-full p-2 border border-gray-200 rounded-md bg-white"
                    value={formData.address.houseNumber}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street/Road Name
                  </label>
                  <input
                    type="text"
                    name="address.street"
                    placeholder="e.g., MG Road"
                    className="w-full p-2 border border-gray-200 rounded-md bg-white"
                    value={formData.address.street}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Locality/Area/Colony
                  </label>
                  <input
                    type="text"
                    name="address.locality"
                    placeholder="e.g., Bandra West"
                    className="w-full p-2 border border-gray-200 rounded-md bg-white"
                    value={formData.address.locality}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Landmark (if any)
                  </label>
                  <input
                    type="text"
                    name="address.landmark"
                    placeholder="e.g., Near City Mall"
                    className="w-full p-2 border border-gray-200 rounded-md bg-white"
                    value={formData.address.landmark}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <CustomSelect
                  label="Country"
                  options={options.countries}
                  value={formData.address.country}
                  onChange={(value) => handleSelectChange("address.country", value)}
                  placeholder="Select country"
                />

                <CustomSelect
                  label="State"
                  options={options.states[formData.address.country] || []}
                  value={formData.address.state}
                  onChange={(value) => handleSelectChange("address.state", value)}
                  placeholder="Select state"
                  disabled={!formData.address.country}
                />

                <CustomSelect
                  label="District"
                  options={options.districts[formData.address.state] || []}
                  value={formData.address.district}
                  onChange={(value) => handleSelectChange("address.district", value)}
                  placeholder="Select district"
                  disabled={!formData.address.state}
                />

                <CustomSelect
                  label="City/Town"
                  options={options.cities[formData.address.state] || []}
                  value={formData.address.city}
                  onChange={(value) => handleSelectChange("address.city", value)}
                  placeholder="Select city"
                  disabled={!formData.address.state}
                />

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    name="address.pincode"
                    placeholder="Enter 6-digit pincode"
                    className="w-full p-2 border border-gray-200 rounded-md bg-white"
                    value={formData.address.pincode}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </Section>

          {/* Pricing Section */}
          <Section title="Pricing Details">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly Rent (₹)
                </label>
                <input
                  type="number"
                  name="rent"
                  placeholder="Enter amount"
                  className="w-full p-2 border border-gray-200 rounded-md bg-white"
                  value={formData.rent}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Caution Deposit (₹)
                </label>
                <input
                  type="number"
                  name="caution"
                  placeholder="Enter amount"
                  className="w-full p-2 border border-gray-200 rounded-md bg-white"
                  value={formData.caution}
                  onChange={handleChange}
                />
              </div>

              <div>
                <CustomSelect
                  label="Security Deposit"
                  options={options.deposit}
                  value={formData.deposit}
                  onChange={(value) => handleSelectChange("deposit", value)}
                  placeholder="Select deposit type"
                />
              </div>

              <div className="md:col-span-3">
                <CustomSelect
                  label="Payment Plan"
                  options={options.paymentPlans}
                  value={formData.paymentPlan}
                  onChange={(value) => handleSelectChange("paymentPlan", value)}
                  placeholder="Select payment frequency"
                />
              </div>
            </div>
          </Section>

          {/* Tenant Preferences */}
          <Section title="Tenant Preferences">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Suitable For
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {options.tenant.map((item) => (
                    <SelectableItem
                      key={item}
                      text={item}
                      isSelected={formData.tenant.includes(item)}
                      onAdd={() => handleToggleItem("tenant", item)}
                      onRemove={() => handleToggleItem("tenant", item)}
                    />
                  ))}
                </div>
                <div className="min-h-12 p-3 border-2 border-gray-200 rounded-lg flex flex-wrap gap-2 bg-white">
                  {formData.tenant.length > 0 ? (
                    formData.tenant.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 bg-green-50 px-3 py-1 rounded-full text-sm border border-green-100"
                      >
                        {item}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm">No tenant preferences selected</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Restrictions
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {options.restrictions.map((item) => (
                    <SelectableItem
                      key={item}
                      text={item}
                      isSelected={formData.restriction.includes(item)}
                      onAdd={() => handleToggleItem("restriction", item)}
                      onRemove={() => handleToggleItem("restriction", item)}
                    />
                  ))}
                </div>
                <div className="min-h-12 p-3 border-2 border-gray-200 rounded-lg flex flex-wrap gap-2 bg-white">
                  {formData.restriction.length > 0 ? (
                    formData.restriction.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 bg-green-50 px-3 py-1 rounded-full text-sm border border-green-100"
                      >
                        {item}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm">No restrictions selected</p>
                  )}
                </div>
              </div>
            </div>
          </Section>

          {/* Additional Information */}
          <Section title="Additional Information">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Property Description
            </label>
            <textarea
              name="description"
              placeholder="Describe your property (rules, nearby facilities, special features etc.)"
              className="w-full p-2 border border-gray-200 rounded-md h-32 bg-white"
              value={formData.description}
              onChange={handleChange}
            />
          </Section>

          {/* Submit Button */}
          <div className="flex justify-center mt-8">
            <button
              type="submit"
              disabled={uploading || photoFiles.length === 0}
              className="bg-gradient-to-r from-green-600 to-green-800 text-white font-semibold px-6 py-3 rounded-lg hover:from-green-800 hover:to-green-600 focus:outline-none disabled:opacity-50 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              {uploading ? 'Processing...' : 'Submit Property Listing'}
            </button>
          </div>
        </form>
      </div>
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

// Reusable Section Component
const Section = ({ title, children }) => (
  <div className="border-b border-gray-100 pb-8 last:border-0">
    <h2 className="text-xl font-semibold text-gray-800 mb-6">{title}</h2>
    {children}
  </div>
);

export default LandLordAddRoom;