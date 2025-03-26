// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const TenantRegistration = () => {
//   const navigate = useNavigate();
//   const [isLogin, setIsLogin] = useState(false);
//   const [userType, setUserType] = useState("tenant"); // Default to tenant

//   const handleLogin = () => {
//     // Simulate login logic
//     localStorage.setItem("userType", userType); // Store userType in local storage
//     localStorage.setItem("token", "dummy-token"); // Store a dummy token
//     navigate("/dashboard");
//   };

//   const toggleForm = () => {
//     setIsLogin(!isLogin);
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-6xl">
//         {/* Information Section */}
//         <div className="space-y-12">
//           {/* Hero Section */}
//           <div className="text-center">
//             <h1 className="text-4xl font-bold text-gray-800 mb-4">Find Your Perfect Home</h1>
//             <p className="text-gray-600 text-lg">
//               Join thousands of tenants who have found their dream homes through our platform. Register now to get access to exclusive listings, personalized recommendations, and more.
//             </p>
//           </div>

//           {/* Benefits Section */}
//           <div>
//             <h2 className="text-2xl font-bold text-gray-800 mb-4">Why Register as a Tenant?</h2>
//             <div className="grid grid-cols-1 gap-4">
//               <div className="bg-white p-4 rounded-lg shadow-md">
//                 <h3 className="text-xl font-semibold text-gray-800">Exclusive Listings</h3>
//                 <p className="text-gray-600">Access properties that are not available on other platforms.</p>
//               </div>
//               <div className="bg-white p-4 rounded-lg shadow-md">
//                 <h3 className="text-xl font-semibold text-gray-800">Personalized Matches</h3>
//                 <p className="text-gray-600">Get recommendations tailored to your preferences.</p>
//               </div>
//               <div className="bg-white p-4 rounded-lg shadow-md">
//                 <h3 className="text-xl font-semibold text-gray-800">Secure Process</h3>
//                 <p className="text-gray-600">Enjoy a safe and transparent rental process.</p>
//               </div>
//             </div>
//           </div>

//           {/* Testimonials Section */}
//           <div>
//             <h2 className="text-2xl font-bold text-gray-800 mb-4">What Our Tenants Say</h2>
//             <div className="space-y-4">
//               <div className="bg-white p-4 rounded-lg shadow-md">
//                 <p className="text-gray-600 italic">"I found my dream apartment within days of registering. The platform is so easy to use!"</p>
//                 <p className="text-gray-800 font-semibold mt-2">- Sarah T.</p>
//               </div>
//               <div className="bg-white p-4 rounded-lg shadow-md">
//                 <p className="text-gray-600 italic">"The personalized recommendations saved me so much time. Highly recommend!"</p>
//                 <p className="text-gray-800 font-semibold mt-2">- John D.</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Registration/Login Form */}
//         <div className="bg-white p-8 rounded-2xl shadow-xl transition-all duration-500 ease-in-out">
//           <h2 className="text-3xl font-bold text-gray-800 mb-6">
//             {isLogin ? "Login" : "Tenant Registration"}
//           </h2>
//           {isLogin ? (
//             <form className="space-y-5">
//               <input
//                 type="email"
//                 placeholder="Email Address"
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
//               />
//               <input
//                 type="password"
//                 placeholder="Password"
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
//               />
//               <button
//                 onClick={handleLogin}
//                 type="submit"
//                 className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300"
//               >
//                 Login
//               </button>
//             </form>
//           ) : (
//             <form className="space-y-5">
//               <input
//                 type="text"
//                 placeholder="Full Name"
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
//               />
//               <input
//                 type="email"
//                 placeholder="Email Address"
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
//               />
//               <input
//                 type="tel"
//                 placeholder="Phone Number"
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
//               />
//               <input
//                 type="text"
//                 placeholder="Password"
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
//               />
//               <input
//                 type="text"
//                 placeholder="Confirm Password"
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
//               />
//               <button
//                 type="submit"
//                 className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300"
//               >
//                 Register Now
//               </button>
//             </form>
//           )}
//           <button
//             onClick={() => navigate("/")}
//             className="w-full bg-gray-400 text-white px-6 py-3 rounded-lg mt-4 hover:bg-gray-500 transition-colors duration-300"
//           >
//             Go Back
//           </button>
//           <p className="text-center mt-4 text-gray-600">
//             {isLogin ? "Don't have an account? " : "Already have an account? "}
//             <button
//               onClick={toggleForm}
//               className="text-blue-500 hover:text-blue-600 font-semibold focus:outline-none"
//             >
//               {isLogin ? "Register" : "Login"}
//             </button>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TenantRegistration;



import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const TenantRegistration = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!formData.email) tempErrors.email = "Email is required.";
    if (!formData.password) tempErrors.password = "Password is required.";
    if (!isLogin) {
      if (!formData.fullName) tempErrors.fullName = "Full Name is required.";
      if (!formData.phone) tempErrors.phone = "Phone Number is required.";
      if (!formData.confirmPassword) tempErrors.confirmPassword = "Confirm Password is required.";
      if (formData.password !== formData.confirmPassword)
        tempErrors.confirmPassword = "Passwords do not match.";
    }
    return tempErrors;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const tempErrors = validateForm();
    if (Object.keys(tempErrors).length) {
      setErrors(tempErrors);
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/auth/register/tenant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          type: "tenant",
        }),
      });
      if (response.ok) {
        setIsLogin(true);
      } else {
        const data = await response.json();
        setErrorMessage(data.message || "Registration failed.");
      }
    } catch (error) {
      setErrorMessage("An error occurred during registration.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const tempErrors = validateForm();
    if (Object.keys(tempErrors).length) {
      setErrors(tempErrors);
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userType", data.type);
        navigate("/dashboard");
      } else {
        setErrorMessage(data.message || "Invalid email or password.");
      }
    } catch (error) {
      setErrorMessage("An error occurred during login.");
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
    setErrorMessage("");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-6xl">
        <div className="space-y-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Find Your Perfect Home</h1>
            <p className="text-gray-600 text-lg">
              Join thousands of tenants who have found their dream homes through our platform. Register now to get access to exclusive listings, personalized recommendations, and more.
            </p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl transition-all duration-500 ease-in-out">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">{isLogin ? "Login" : "Tenant Registration"}</h2>

          {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

          <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-5">
            {!isLogin && (
              <>
                <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
                <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
                <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </>
            )}
            <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />

            <button type="submit" className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600">
              {isLogin ? "Login" : "Register Now"}
            </button>
          </form>

          <p className="text-center mt-4 text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={toggleForm} className="text-blue-500 hover:text-blue-600 font-semibold focus:outline-none">
              {isLogin ? "Register" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TenantRegistration;