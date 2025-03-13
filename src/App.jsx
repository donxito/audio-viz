import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Dashboard from "./components/dashboard/Dashboard";

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar noAuth={true} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Dashboard noAuth={true} />} />
            <Route path="/dashboard" element={<Dashboard noAuth={true} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
