
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import AiCopilotWidget from './components/AiCopilotWidget';
import ErrorBoundary from './components/ErrorBoundary';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const FlightSearch = lazy(() => import('./pages/FlightSearch'));
const MyBookings = lazy(() => import('./pages/MyBookings'));

function RouteFallback() {
  return (
    <div className="flex flex-1 items-center justify-center bg-slate-950 p-6 text-slate-400" role="status">
      Loading your travel experience...
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
        <AuthProvider>
            <Router>
                <ErrorBoundary>
                    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col font-sans relative">
                        <Navbar />
                        <main className="flex-grow flex flex-col">
                            <Suspense fallback={<RouteFallback />}>
                                <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/signup" element={<Signup />} />
                                    <Route path="/search" element={<FlightSearch />} />
                                    <Route path="/bookings" element={<MyBookings />} />
                                    <Route path="*" element={<Navigate to="/" replace />} />
                                </Routes>
                            </Suspense>
                        </main>
                        <AiCopilotWidget />
                    </div>
                </ErrorBoundary>
            </Router>
        </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
