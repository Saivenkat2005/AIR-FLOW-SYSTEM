
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { PlaneTakeoff, User, LogOut, Search, Ticket, Sun, Moon, Smartphone } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const { theme, cycleTheme } = useTheme();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-[#050914]/80 backdrop-blur-2xl border-b border-white/[.08] sticky top-0 z-50 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-[4.75rem]">
                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-cyan-300/20 to-blue-500/10 border border-cyan-200/20 shadow-[0_0_24px_rgba(34,211,238,.12)] group-hover:scale-105">
                                <PlaneTakeoff className="w-7 h-7 text-cyan-300" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-black bg-gradient-to-r from-white via-cyan-100 to-slate-300 bg-clip-text text-transparent tracking-tight hidden sm:block">Airline Nexus</span>
                                <span className="text-[9px] uppercase tracking-[.22em] font-mono text-cyan-300/80 font-bold hidden sm:block">Intelligence online</span>
                            </div>
                        </Link>
                        <div className="hidden md:flex items-center gap-2 border-l border-white/[.08] pl-7">
                            <Link to="/search" className="flex items-center gap-2 text-slate-300 hover:text-cyan-300 font-medium px-3 py-2 rounded-xl hover:bg-white/[.05]">
                                <Search className="w-4 h-4" /> Flights
                            </Link>
                            {user && (
                                <Link to="/bookings" className="flex items-center gap-2 text-slate-300 hover:text-cyan-300 font-medium px-3 py-2 rounded-xl hover:bg-white/[.05]">
                                    <Ticket className="w-4 h-4" /> My Bookings
                                </Link>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={cycleTheme}
                            aria-label={`Switch theme. Current theme: ${theme}`}
                            title={`Theme: ${theme}`}
                            className="p-2.5 rounded-xl text-slate-300 hover:text-cyan-300 hover:bg-white/[.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400"
                        >
                            {theme === 'light' ? <Sun className="w-4 h-4" /> : theme === 'amoled' ? <Smartphone className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </button>
                        <div className="flex items-center gap-6">
                        {user ? (
                            <div className="flex items-center gap-6">
                                <span className="flex items-center gap-2 text-slate-300 font-medium bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700/50">
                                    <User className="w-4 h-4 text-cyan-400" />
                                    {user.username}
                                </span>
                                <button onClick={handleLogout} className="flex items-center gap-2 text-rose-400 hover:text-rose-300 transition-colors px-4 py-2 rounded-lg hover:bg-rose-500/10 font-medium">
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                                </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login" className="text-slate-300 hover:text-white transition-colors font-medium">Login</Link>
                                <Link to="/signup" className="bg-cyan-300 hover:bg-cyan-200 text-slate-950 px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40">Get started</Link>
                            </div>
                        )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
