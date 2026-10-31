const fs = require('fs');
const path = require('path');

const baseDir = "c:\\Resume\\ECommerce\\Airline-Booking 2 - Copy\\Frontend\\src";

// 1. FlightSearch.jsx
fs.writeFileSync(path.join(baseDir, 'pages', 'FlightSearch.jsx'), `
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Plane, Search, Clock, MapPin, ArrowRight, Loader2, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FlightSearch = () => {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const api = axios.create({ baseURL: 'http://localhost:4000/api' });

    useEffect(() => {
        const fetchFlights = async () => {
            try {
                const res = await api.get('/flights/all');
                setFlights(res.data);
            } catch (err) {
                console.error("Failed to fetch flights", err);
            } finally {
                setLoading(false);
            }
        };
        fetchFlights();
    }, []);

    const handleBook = async (flightId) => {
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            // Simplified booking for demonstration
            const payload = {
                customerId: user.id,
                flightId: flightId,
                seatType: "Economy",
                origin: "Origin", // Hardcoded for simplified mock demo
                destination: "Destination",
                date: "2026-12-01",
                nop: 1,
                totalPrice: 500
            };
            const token = localStorage.getItem('token');
            await api.post('/booking/add', payload, {
                headers: { Authorization: \`Bearer \${token}\` }
            });
            navigate('/bookings');
        } catch (err) {
            alert('Booking failed');
        }
    };

    const filteredFlights = flights.filter(f => 
        (f.flightName && f.flightName.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="min-h-[calc(100vh-5rem)] p-6 bg-slate-950">
            <div className="max-w-6xl mx-auto mt-10">
                <div className="flex flex-col md:flex-row justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">Search Flights</h1>
                        <p className="text-slate-400">Find and book your next premium journey.</p>
                    </div>
                    <div className="relative mt-6 md:mt-0 w-full md:w-96">
                        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input type="text" placeholder="Search by airline or flight name..." 
                            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 text-white rounded-full pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all" />
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filteredFlights.map(flight => (
                            <div key={flight.flightId} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:bg-slate-800/80 transition-all hover:-translate-y-1 shadow-lg">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-cyan-500/10 rounded-2xl">
                                            <Plane className="w-6 h-6 text-cyan-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white">{flight.flightName}</h3>
                                            <p className="text-sm text-slate-400 font-mono">{flight.flightNumber || 'FL-100'}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-emerald-400">$500</p>
                                        <p className="text-xs text-slate-500 uppercase tracking-wider">Economy</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 mb-8 px-4 py-6 bg-slate-950/50 rounded-2xl border border-slate-800/50">
                                    <div className="flex-1">
                                        <p className="text-sm text-slate-500 mb-1">Take Off</p>
                                        <p className="text-lg font-semibold text-white">{flight.takeOffTime}</p>
                                    </div>
                                    <div className="flex-1 flex justify-center">
                                        <ArrowRight className="w-6 h-6 text-slate-600" />
                                    </div>
                                    <div className="flex-1 text-right">
                                        <p className="text-sm text-slate-500 mb-1">Landing</p>
                                        <p className="text-lg font-semibold text-white">{flight.landingTime}</p>
                                    </div>
                                </div>

                                <button onClick={() => handleBook(flight.flightId)} className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3.5 rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)]">
                                    Book Now
                                </button>
                            </div>
                        ))}
                        {filteredFlights.length === 0 && (
                            <div className="col-span-full text-center py-20 text-slate-500">
                                <Plane className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                <p className="text-xl">No flights found matching your search.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FlightSearch;
`);

// 2. MyBookings.jsx
fs.writeFileSync(path.join(baseDir, 'pages', 'MyBookings.jsx'), `
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Ticket, Calendar, MapPin, Mail, Loader2, CheckCircle2 } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, isLoading } = useContext(AuthContext);

    const api = axios.create({ baseURL: 'http://localhost:4000/api' });

    useEffect(() => {
        if (!user) return;
        const fetchBookings = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await api.get(\`/booking/get/\${user.id}\`, {
                    headers: { Authorization: \`Bearer \${token}\` }
                });
                setBookings(res.data);
            } catch (err) {
                console.error("Failed to fetch bookings", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, [user]);

    if (isLoading) return <div className="flex h-screen items-center justify-center bg-slate-950"><Loader2 className="w-10 h-10 text-cyan-500 animate-spin" /></div>;
    if (!user) return <Navigate to="/login" />;

    return (
        <div className="min-h-[calc(100vh-5rem)] p-6 bg-slate-950">
            <div className="max-w-5xl mx-auto mt-10">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-white mb-2">My Bookings</h1>
                    <p className="text-slate-400">Manage your upcoming and past flights.</p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
                    </div>
                ) : (
                    <div className="space-y-6">
                        {bookings.map(booking => (
                            <div key={booking.bookingId} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center shadow-lg relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[50px] rounded-full pointer-events-none"></div>
                                
                                <div className="flex-1 w-full">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2 bg-emerald-500/10 rounded-lg">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                        </div>
                                        <span className="text-emerald-400 font-semibold tracking-wide text-sm">CONFIRMED</span>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                                        <div>
                                            <p className="text-sm text-slate-500 mb-1 flex items-center gap-1"><Ticket className="w-4 h-4"/> PNR</p>
                                            <p className="text-xl font-bold text-white font-mono">{booking.pnr || 'A33F342B'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500 mb-1 flex items-center gap-1"><MapPin className="w-4 h-4"/> Route</p>
                                            <p className="text-lg font-semibold text-white">{booking.origin} → {booking.destination}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500 mb-1 flex items-center gap-1"><Calendar className="w-4 h-4"/> Date</p>
                                            <p className="text-lg font-semibold text-white">{booking.date}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500 mb-1">Total</p>
                                            <p className="text-xl font-bold text-emerald-400">\${booking.totalPrice}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 text-sm text-slate-400 bg-slate-950/50 p-3 rounded-xl border border-slate-800/50 inline-flex">
                                        <Mail className="w-4 h-4 text-cyan-400" />
                                        E-Ticket PDF sent to {user.email} (Status: {booking.ticketEmailStatus || 'QUEUED'})
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        {bookings.length === 0 && (
                            <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-slate-800 border-dashed">
                                <Ticket className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                                <h3 className="text-xl font-bold text-white mb-2">No bookings yet</h3>
                                <p className="text-slate-400">When you book a flight, it will appear here.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookings;
`);

// 3. Update App.jsx
fs.writeFileSync(path.join(baseDir, 'App.jsx'), `
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import FlightSearch from './pages/FlightSearch';
import MyBookings from './pages/MyBookings';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col font-sans">
          <Navbar />
          <main className="flex-grow flex flex-col">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/search" element={<FlightSearch />} />
              <Route path="/bookings" element={<MyBookings />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
`);

// 4. Update Navbar.jsx to add links
fs.writeFileSync(path.join(baseDir, 'components', 'Navbar.jsx'), `
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { PlaneTakeoff, User, LogOut, Search, Ticket } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="p-2 bg-cyan-500/10 rounded-xl group-hover:bg-cyan-500/20 transition-colors">
                                <PlaneTakeoff className="w-8 h-8 text-cyan-400" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent tracking-tight hidden sm:block">Airline Nexus</span>
                        </Link>
                        <div className="hidden md:flex items-center gap-6 border-l border-slate-800 pl-8">
                            <Link to="/search" className="flex items-center gap-2 text-slate-300 hover:text-cyan-400 font-medium transition-colors">
                                <Search className="w-4 h-4" /> Flights
                            </Link>
                            {user && (
                                <Link to="/bookings" className="flex items-center gap-2 text-slate-300 hover:text-cyan-400 font-medium transition-colors">
                                    <Ticket className="w-4 h-4" /> My Bookings
                                </Link>
                            )}
                        </div>
                    </div>
                    
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
                                <Link to="/signup" className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 px-6 py-2.5 rounded-full font-bold transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40">Sign Up</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
`);

// 5. Update Home.jsx to link to Search
fs.writeFileSync(path.join(baseDir, 'pages', 'Home.jsx'), fs.readFileSync(path.join(baseDir, 'pages', 'Home.jsx'), 'utf8').replace('/signup', '/search').replace('Get Started', 'Search Flights'));

console.log("Phases generated.");
