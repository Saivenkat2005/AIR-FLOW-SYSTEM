import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Plane, User, Ticket, Menu, X, ChevronDown, Bell, ShieldCheck } from "lucide-react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isPersonaDropdownOpen, setIsPersonaDropdownOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize roles on first load if not present
  const [roleId, setRoleId] = useState(() => {
    const stored = localStorage.getItem("roleId");
    return stored ? JSON.parse(stored) : 3; // Default to Passenger (3)
  });

  useEffect(() => {
    if (!localStorage.getItem("roleId")) {
      localStorage.setItem("roleId", "3");
      localStorage.setItem("profileId", "1");
      localStorage.setItem("username", "Passenger");
    }
  }, []);

  // Handle scroll for glassmorphism effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const goHome = () => {
    if (roleId === 1) navigate(`/${window.btoa('adminDashboard')}`);
    else if (roleId === 2) navigate(`/${window.btoa('managerDashboard')}`);
    else if (roleId === 3) navigate(`/${window.btoa('userDashboard')}`);
    else navigate('/');
  };

  const handlePersonaChange = (newRole) => {
    localStorage.setItem("roleId", JSON.stringify(newRole));
    setRoleId(newRole);
    setIsPersonaDropdownOpen(false);

    if (newRole === 1) {
      localStorage.setItem("profileId", "1");
      localStorage.setItem("username", "Admin User");
      navigate(`/${window.btoa('adminDashboard')}`);
    } else if (newRole === 2) {
      localStorage.setItem("profileId", "2");
      localStorage.setItem("username", "Manager User");
      navigate(`/${window.btoa('managerDashboard')}`);
    } else {
      localStorage.setItem("profileId", "3");
      localStorage.setItem("username", "Passenger");
      navigate(`/${window.btoa('userDashboard')}`);
    }
  };

  const navigateTo = (path) => {
    navigate(path);
    setIsProfileDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const getPersonaLabel = () => {
    if (roleId === 1) return "Admin View";
    if (roleId === 2) return "Manager View";
    return "Passenger View";
  };

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-white/20 dark:border-slate-800/50 shadow-sm py-3" 
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={goHome}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-primary-400 flex items-center justify-center text-white shadow-lg shadow-primary-500/30 group-hover:scale-105 transition-transform duration-300">
              <Plane size={24} className="transform -rotate-45" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800 dark:text-white group-hover:text-primary-600 transition-colors">
              Persistent Airways
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex space-x-6">
              <button onClick={goHome} className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                Dashboard
              </button>
              {roleId === 3 && (
                <button onClick={() => navigateTo(`/${window.btoa('flights')}`)} className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Book Flight
                </button>
              )}
            </nav>

            <div className="flex items-center space-x-4 border-l border-slate-200 dark:border-slate-700 pl-6">
              
              {/* Persona Switcher Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setIsPersonaDropdownOpen(!isPersonaDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border border-primary-200 dark:border-primary-800 bg-primary-50/50 dark:bg-primary-950/20 text-primary-700 dark:text-primary-300 hover:bg-primary-50 transition-colors"
                >
                  <ShieldCheck size={14} />
                  <span>{getPersonaLabel()}</span>
                  <ChevronDown size={12} className={`transition-transform duration-200 ${isPersonaDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isPersonaDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden py-1 z-50">
                    <button 
                      onClick={() => handlePersonaChange(3)}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50 ${roleId === 3 ? 'text-primary-600 font-medium' : 'text-slate-700 dark:text-slate-200'}`}
                    >
                      Passenger Persona
                    </button>
                    <button 
                      onClick={() => handlePersonaChange(2)}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50 ${roleId === 2 ? 'text-primary-600 font-medium' : 'text-slate-700 dark:text-slate-200'}`}
                    >
                      Manager Persona
                    </button>
                    <button 
                      onClick={() => handlePersonaChange(1)}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50 ${roleId === 1 ? 'text-primary-600 font-medium' : 'text-slate-700 dark:text-slate-200'}`}
                    >
                      Admin Persona
                    </button>
                  </div>
                )}
              </div>

              <button className="relative p-2 text-slate-500 hover:text-primary-600 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-accent-orange rounded-full"></span>
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 p-1 pr-3 rounded-full border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700 transition-colors bg-white dark:bg-slate-800"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-600">
                    <User size={18} />
                  </div>
                  <ChevronDown size={16} className={`text-slate-500 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden origin-top-right z-50">
                    <div className="py-2">
                      <button 
                        onClick={() => navigateTo(`/${window.btoa('myprofile')}`)}
                        className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-3 transition-colors"
                      >
                        <User size={16} className="text-slate-400" /> My Profile
                      </button>
                      <button 
                        onClick={() => navigateTo(`/${window.btoa('viewBooking')}`)}
                        className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-3 transition-colors"
                      >
                        <Ticket size={16} className="text-slate-400" /> My Reservations
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button 
              onClick={() => setIsPersonaDropdownOpen(!isPersonaDropdownOpen)}
              className="px-2.5 py-1 rounded-full text-xs font-semibold border border-primary-200 dark:border-primary-800 bg-primary-50/50 dark:bg-primary-950/20 text-primary-700 dark:text-primary-300 hover:bg-primary-50"
            >
              {getPersonaLabel()}
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 absolute top-full left-0 w-full shadow-lg z-50">
          <div className="px-4 pt-2 pb-6 space-y-1">
            <button onClick={goHome} className="block w-full text-left px-3 py-3 rounded-xl text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
              Dashboard
            </button>
            <button onClick={() => navigateTo(`/${window.btoa('myprofile')}`)} className="block w-full text-left px-3 py-3 rounded-xl text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
              Profile
            </button>
            <button onClick={() => navigateTo(`/${window.btoa('viewBooking')}`)} className="block w-full text-left px-3 py-3 rounded-xl text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
              Reservations
            </button>
            <div className="h-px bg-slate-100 dark:bg-slate-800 my-2"></div>
            <p className="px-3 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Switch View</p>
            <button onClick={() => handlePersonaChange(3)} className={`block w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium ${roleId === 3 ? 'text-primary-600 bg-primary-50 dark:bg-primary-950/20' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
              Passenger View
            </button>
            <button onClick={() => handlePersonaChange(2)} className={`block w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium ${roleId === 2 ? 'text-primary-600 bg-primary-50 dark:bg-primary-950/20' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
              Manager View
            </button>
            <button onClick={() => handlePersonaChange(1)} className={`block w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium ${roleId === 1 ? 'text-primary-600 bg-primary-50 dark:bg-primary-950/20' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
              Admin View
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
