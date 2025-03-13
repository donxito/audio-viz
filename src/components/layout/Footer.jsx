import React from "react";
import logo from "../../assets/wave.png";
import { FaLink, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-4 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
          <div className="flex items-center space-x-2">
            <img src={logo} alt="AudioViz" className="h-5 w-5" />
            <span className="text-sm font-medium text-gray-300">AudioViz</span>
          </div>
          <div className="text-sm text-gray-400">
            © 2025 AudioViz. All rights reserved.
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-400">Created by Miguel</div>
            <div className="flex space-x-3">
              <a
                href="https://mchito.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Portfolio"
              >
                <FaLink className="w-4 h-4 hover:scale-110 transition-transform" />
              </a>
              <a
                href="mailto:mchito@gmail.com"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Email"
              >
                <FaEnvelope className="w-4 h-4 hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
