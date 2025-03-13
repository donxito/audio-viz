import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/wave.png";
import { FaGithub } from "react-icons/fa";
const Navbar = () => {
  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="AudioViz" className="h-10 w-10" />
              <span className="ml-2 text-xl font-bold">AudioViz</span>
            </Link>
          </div>

          <div className="flex items-center">
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-primary-400">
                Audio Visualization Dashboard
              </span>
              <a
                href="https://github.com/donxito/audio-viz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white"
              >
                <FaGithub style={{ width: "2rem", height: "2rem" }} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
