import React from "react";
import {
  FaInstagram,
  FaFacebookF,
  FaXTwitter,
  FaLinkedinIn,
} from "react-icons/fa6";
import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="bg-black text-white px-6 py-18">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* Left: Logo + Copyright */}
        <div className="mb-6 md:mb-0 text-center md:text-left">
          <h1 className="text-6xl font-bold mb-2">WitScribe</h1>
          <p className="text-sm">Copyright © 2025 | All Rights Reserved</p>
        </div>

        {/* Center: Navigation */}
        <div className="flex space-x-6 mb-6 md:mb-0 text-sm font-medium ">
          <Link to='home' className="hover:text-red-500 px-3 py-2 rounded transition">Home</Link>
          <Link to='about' className="hover:text-red-500 px-3 py-2 rounded transition">About Us</Link>
          <Link to='contact' className="hover:text-red-500 px-3 py-2 rounded transition">Contact Us</Link>
        </div>

        {/* Right: Social Icons */}
        <div className="flex space-x-4">
          <a href="#"><FaInstagram className="w-5 h-5 hover:text-gray-400" /></a>
          <a href="#"><FaFacebookF className="w-5 h-5 hover:text-gray-400" /></a>
          <a href="#"><FaXTwitter className="w-5 h-5 hover:text-gray-400" /></a>
          <a href="#"><FaLinkedinIn className="w-5 h-5 hover:text-gray-400" /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;