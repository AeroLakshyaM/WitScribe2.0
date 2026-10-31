"use client"

import { useState, useEffect } from "react"
import "../App.css"
import { Link, useLocation } from "react-router-dom"
import { Menu, X, Home, BookOpen, Users } from "lucide-react"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  // Check if a path is active
  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <div className="navbar-container flex mt-8 relative w-full">
      <div className="navbar flex justify-between items-center gap-4 m-auto bg-[#dcdcdc] rounded-2xl px-6 md:px-8 py-3 w-full max-w-150">
        <Link to="/landing" className="flex items-center">
          <div className="logo text-2xl font-bold">WitScribe</div>
        </Link>

        {/* Hamburger Menu Button (visible on mobile) */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="flex items-center p-2 rounded hover:bg-gray-200 focus:outline-none transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="nav-links hidden md:flex items-center gap-4">
          <Link
            to="/home"
            className={`flex items-center gap-1 px-3 py-2 rounded transition ${isActive("/") ? "active text-red-500 font-medium" : "hover:text-red-500"}`}
            id={isActive("/") ? "redLink" : ""}
          >
            <Home size={16} />
            <span>Home</span>
          </Link>
          <Link
            to="/quiz"
            className={`flex items-center gap-1 px-3 py-2 rounded transition ${isActive("/quiz") ? "active text-red-500 font-medium" : "hover:text-red-500"}`}
            id={isActive("/quiz") ? "redLink" : ""}
          >
            <BookOpen size={16} />
            <span>Quiz</span>
          </Link>
          <Link
            to="/community"
            className={`flex items-center gap-1 px-3 py-2 rounded transition ${isActive("/community") ? "active text-red-500 font-medium" : "hover:text-red-500"}`}
            id={isActive("/community") ? "redLink" : ""}
          >
            <Users size={16} />
            <span>Community</span>
          </Link>
        </div>

        {/* Mobile Navigation (Dropdown) */}
        {isMenuOpen && (
          <div className="mobile-nav-links flex flex-col w-full md:hidden mt-4 gap-2 py-2 animate-fadeIn">
            <Link
              to="/"
              className={`flex items-center gap-2 py-3 px-2 rounded-md ${isActive("/") ? "bg-red-50 text-red-500 font-medium" : "hover:bg-gray-100"}`}
            >
              <Home size={18} />
              <span>Home</span>
            </Link>
            <Link
              to="/quiz"
              className={`flex items-center gap-2 py-3 px-2 rounded-md ${isActive("/quiz") ? "bg-red-50 text-red-500 font-medium" : "hover:bg-gray-100"}`}
            >
              <BookOpen size={18} />
              <span>Quiz</span>
            </Link>
            <Link
              to="/community"
              className={`flex items-center gap-2 py-3 px-2 rounded-md ${isActive("/community") ? "bg-red-50 text-red-500 font-medium" : "hover:bg-gray-100"}`}
            >
              <Users size={18} />
              <span>Community</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar