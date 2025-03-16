import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import TenantRegistration from "./pages/TenantRegistration";
import LandlordRegistration from "./pages/LandlordRegistration";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tenant-registration" element={<TenantRegistration />} />
        <Route path="/landlord-registration" element={<LandlordRegistration />} />
      </Routes>
    </Router>
  );
}

export default App;