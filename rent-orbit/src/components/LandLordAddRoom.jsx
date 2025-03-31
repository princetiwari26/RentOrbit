import { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { X, ChevronDown } from "lucide-react";
import axios from 'axios';

// Draggable Item Component
const DragItem = ({ text, type, onDrop }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type,
    item: { text },
    end: (item, monitor) => {
      if (monitor.didDrop()) {
        onDrop(item.text);
      }
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`px-3 py-1.5 bg-blue-50 rounded-full cursor-grab border border-blue-200 text-sm ${
        isDragging ? "opacity-50" : ""
      } hover:bg-blue-100 transition-colors`}
    >
      {text}
    </div>
  );
};

// Drop Zone Component
const DropZone = ({ type, items, onRemove, label }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: type,
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <div
        ref={drop}
        className={`min-h-12 p-3 border-2 ${
          isOver ? "border-green-400 bg-green-50" : "border-gray-200"
        } rounded-lg flex flex-wrap gap-2 bg-white`}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-1 bg-green-50 px-3 py-1 rounded-full text-sm border border-green-100"
          >
            {item}
            <button 
              onClick={() => onRemove(index)}
              className="text-red-400 hover:text-red-600 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-gray-400 text-sm">Drag items here</p>
        )}
      </div>
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
  // State for selected items
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
    // amenities: [],
    rent: "",
    caution: "",
    description: "",
  });

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
    amenities: [
      "Fully Furnished",
      "Semi-Furnished",
      "Unfurnished",
      "Wi-Fi",
      "AC",
      "Geyser",
      "Modular Kitchen",
      "Parking",
      "Power Backup",
      "Lift/Elevator",
      "Security",
      "Gym",
      "Swimming Pool",
      "Garden",
      "Housekeeping",
      "Laundry",
      "Meals Included",
      "24/7 Water Supply",
      "Wardrobe",
      "TV",
      "Washing Machine"
    ],
  };

  // Handle dropping an item into a zone
  const handleDrop = (type, item) => {
    setFormData((prev) => ({
      ...prev,
      [type]: [...prev[type], item],
    }));
  };

  // Handle removing an item
  const handleRemove = (type, index) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Get token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      alert('User is not Authenticated');
      return;
    }
    try {
      // API call to create a room
      const response = await axios.post(
        'http://localhost:8000/api/room',
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );
      // console.log('Room created successfully:', response.data);
      alert('Room created successfully!');
      
    } catch (error) {
      console.error('Error submitting room:', error);
      alert(error.response?.data?.message || 'Failed to create room');
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-50 p-2">
        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm p-8 border border-gray-100">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">
            List Your Property
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Property Type Section */}
            <Section title="Property Details">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Accommodation Type
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {options.accommodation.map((item) => (
                      <DragItem
                        key={item}
                        text={item}
                        type="accommodation"
                        onDrop={(item) => handleDrop("accommodation", item)}
                      />
                    ))}
                  </div>
                  <DropZone
                    type="accommodation"
                    items={formData.accommodation}
                    onRemove={(index) => handleRemove("accommodation", index)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room Type
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {options.roomType.map((item) => (
                      <DragItem
                        key={item}
                        text={item}
                        type="roomType"
                        onDrop={(item) => handleDrop("roomType", item)}
                      />
                    ))}
                  </div>
                  <DropZone
                    type="roomType"
                    items={formData.roomType}
                    onRemove={(index) => handleRemove("roomType", index)}
                  />
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
                      <DragItem
                        key={item}
                        text={item}
                        type="tenant"
                        onDrop={(item) => handleDrop("tenant", item)}
                      />
                    ))}
                  </div>
                  <DropZone
                    type="tenant"
                    items={formData.tenant}
                    onRemove={(index) => handleRemove("tenant", index)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Restrictions
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {options.restrictions.map((item) => (
                      <DragItem
                        key={item}
                        text={item}
                        type="restriction"
                        onDrop={(item) => handleDrop("restriction", item)}
                      />
                    ))}
                  </div>
                  <DropZone
                    type="restriction"
                    items={formData.restriction}
                    onRemove={(index) => handleRemove("restriction", index)}
                  />
                </div>
              </div>
            </Section>

            {/* Amenities Section */}
            {/* <Section title="Amenities & Features">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Amenities
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {options.amenities.map((item) => (
                  <DragItem
                    key={item}
                    text={item}
                    type="amenities"
                    onDrop={(item) => handleDrop("amenities", item)}
                  />
                ))}
              </div>
              <DropZone
                type="amenities"
                items={formData.amenities}
                onRemove={(index) => handleRemove("amenities", index)}
              />
            </Section> */}

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
                className="bg-gradient-to-r from-green-600 to-green-800 text-white font-semibold px-4 py-2 rounded-lg hover:from-green-800 hover:to-green-600 focus:outline-none"
              >
                Submit Property Listing
              </button>
            </div>
          </form>
        </div>
      </div>
    </DndProvider>
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