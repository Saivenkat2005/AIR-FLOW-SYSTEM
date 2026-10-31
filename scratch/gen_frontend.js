const fs = require('fs');
const path = require('path');

const baseDir = "c:\\Resume\\ECommerce\\Airline-Booking 2 - Copy\\Frontend\\src";

function ensureDir(dir) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

ensureDir(path.join(baseDir, 'context'));
ensureDir(path.join(baseDir, 'components'));
ensureDir(path.join(baseDir, 'pages'));
ensureDir(path.join(baseDir, 'styles'));

// 1. AuthContext.jsx
fs.writeFileSync(path.join(baseDir, 'context', 'AuthContext.jsx'), `
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const api = axios.create({ baseURL: 'http://localhost:4000/api' });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            api.get('/auth/me', { headers: { Authorization: \`Bearer \${token}\` } })
                .then(res => setUser(res.data))
                .catch(() => {
                    localStorage.removeItem('token');
                    setUser(null);
                })
                .finally(() => setIsLoading(false));
        } else {
            setIsLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', res.data.accessToken);
        setUser(res.data);
    };

    const signup = async (username, email, password, phone) => {
        await api.post('/auth/signup', { username, email, password, phone, role: ['USER'] });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
`);

// 2. Navbar.jsx
fs.writeFileSync(path.join(baseDir, 'components', 'Navbar.jsx'), `
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { PlaneTakeoff, User, LogOut } from 'lucide-react';

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
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="p-2 bg-cyan-500/10 rounded-xl group-hover:bg-cyan-500/20 transition-colors">
                            <PlaneTakeoff className="w-8 h-8 text-cyan-400" />
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent tracking-tight">Airline Nexus</span>
                    </Link>
                    <div className="flex items-center gap-6">
                        {user ? (
                            <div className="flex items-center gap-6">
                                <span className="flex items-center gap-2 text-slate-300">
                                    <User className="w-4 h-4" />
                                    {user.username}
                                </span>
                                <button onClick={handleLogout} className="flex items-center gap-2 text-rose-400 hover:text-rose-300 transition-colors px-4 py-2 rounded-lg hover:bg-rose-500/10">
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login" className="text-slate-300 hover:text-white transition-colors font-medium">Login</Link>
                                <Link to="/signup" className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 px-6 py-2.5 rounded-full font-semibold transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40">Sign Up</Link>
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

// 3. Home.jsx
fs.writeFileSync(path.join(baseDir, 'pages', 'Home.jsx'), `
import React from 'react';
import { Plane, Calendar, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] p-6 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black">
            <div className="max-w-4xl w-full text-center space-y-8 animate-fade-in-up">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-sm font-medium mb-4">
                    <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span></span>
                    Next Generation Travel Platform
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
                    Experience the future of <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Global Aviation.</span>
                </h1>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed mb-10">
                    Seamless bookings, intelligent routing, and premium digital ticketing. Elevate your journey with Airline Nexus.
                </p>
                <div className="flex gap-6 justify-center items-center">
                    <Link to="/signup" className="bg-white text-slate-900 px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]">Get Started</Link>
                    <Link to="/login" className="bg-slate-800 border border-slate-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:bg-slate-700 hover:border-slate-600">Sign In</Link>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full mt-24">
                {[
                    { icon: Plane, title: "Global Fleet", desc: "Access thousands of flights across our international network." },
                    { icon: Calendar, title: "Smart Scheduling", desc: "AI-driven route optimization and dynamic pricing." },
                    { icon: ShieldCheck, title: "Secure Ticketing", desc: "Encrypted PDF e-tickets delivered instantly." }
                ].map((feature, i) => (
                    <div key={i} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-8 rounded-3xl hover:bg-slate-800 transition-all hover:-translate-y-1">
                        <feature.icon className="w-10 h-10 text-cyan-400 mb-6" />
                        <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                        <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
`);

// 4. Login.jsx
fs.writeFileSync(path.join(baseDir, 'pages', 'Login.jsx'), `
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-grow flex items-center justify-center p-6 bg-slate-950 relative overflow-hidden">
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none"></div>
            
            <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-10 rounded-[2rem] shadow-2xl relative z-10">
                <div className="mb-10 text-center">
                    <h2 className="text-3xl font-bold text-white mb-3">Welcome Back</h2>
                    <p className="text-slate-400">Sign in to manage your bookings</p>
                </div>
                {error && <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-sm text-center">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} 
                                className="w-full bg-slate-950/50 border border-slate-700 text-white rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all placeholder:text-slate-600" 
                                placeholder="name@example.com" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
                        <div className="relative">
                            <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} 
                                className="w-full bg-slate-950/50 border border-slate-700 text-white rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all placeholder:text-slate-600" 
                                placeholder="••••••••" />
                        </div>
                    </div>
                    <button type="submit" disabled={loading} 
                        className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold text-lg rounded-xl py-4 transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] mt-8">
                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                            <>Sign In <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                        )}
                    </button>
                </form>
                <p className="mt-8 text-center text-slate-400">
                    Don't have an account? <Link to="/signup" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
`);

// 5. Signup.jsx
fs.writeFileSync(path.join(baseDir, 'pages', 'Signup.jsx'), `
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Phone, Loader2, ArrowRight } from 'lucide-react';

const Signup = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '', phone: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { signup } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            await signup(formData.username, formData.email, formData.password, formData.phone);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-grow flex items-center justify-center p-6 bg-slate-950 relative overflow-hidden">
            <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none"></div>
            
            <div className="w-full max-w-lg bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-10 rounded-[2rem] shadow-2xl relative z-10 my-8">
                <div className="mb-10 text-center">
                    <h2 className="text-3xl font-bold text-white mb-3">Create Account</h2>
                    <p className="text-slate-400">Join Airline Nexus for a premium travel experience</p>
                </div>
                {error && <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-sm text-center">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">Full Name</label>
                        <div className="relative">
                            <User className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input type="text" required value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} 
                                className="w-full bg-slate-950/50 border border-slate-700 text-white rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-600" 
                                placeholder="John Doe" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} 
                                className="w-full bg-slate-950/50 border border-slate-700 text-white rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-600" 
                                placeholder="name@example.com" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">Phone Number</label>
                        <div className="relative">
                            <Phone className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input type="tel" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                                className="w-full bg-slate-950/50 border border-slate-700 text-white rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-600" 
                                placeholder="+1 (555) 000-0000" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
                        <div className="relative">
                            <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input type="password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} 
                                className="w-full bg-slate-950/50 border border-slate-700 text-white rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-600" 
                                placeholder="••••••••" />
                        </div>
                    </div>
                    <button type="submit" disabled={loading} 
                        className="w-full bg-blue-500 hover:bg-blue-400 text-white font-bold text-lg rounded-xl py-4 transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] mt-8">
                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                            <>Create Account <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                        )}
                    </button>
                </form>
                <p className="mt-8 text-center text-slate-400">
                    Already have an account? <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
`);

// 6. Fix index.jsx
fs.writeFileSync(path.join(baseDir, 'index.jsx'), `
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`);

// 7. Fix index.css
fs.writeFileSync(path.join(baseDir, 'index.css'), `
@import "tailwindcss";

@keyframes fade-in-up {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in-up {
    animation: fade-in-up 0.8s ease-out forwards;
}
`);
console.log("Frontend components generated successfully.");
