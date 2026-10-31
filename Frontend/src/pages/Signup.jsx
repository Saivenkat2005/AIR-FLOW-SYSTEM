
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Phone, Loader2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

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
        <main className="relative flex min-h-[calc(100vh-4.75rem)] items-center justify-center overflow-hidden px-5 py-10 sm:px-8">
            <div className="nexus-grid pointer-events-none absolute inset-0 opacity-60" />
            <div className="pointer-events-none absolute -right-40 top-0 h-96 w-96 rounded-full bg-blue-500/[.1] blur-3xl" />
            <div className="pointer-events-none absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-cyan-400/[.08] blur-3xl" />

            <div className="relative grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/[.1] bg-slate-950/60 shadow-2xl backdrop-blur-2xl lg:grid-cols-[1.1fr_.9fr]">
                <div className="p-7 sm:p-10 lg:p-14">
                <div className="mb-9">
                    <p className="nexus-eyebrow mb-3">Start your journey</p>
                    <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Create your Nexus</h2>
                    <p className="mt-3 text-slate-400">One secure identity for every better journey.</p>
                </div>
                {error && <div role="alert" className="mb-6 rounded-xl border border-rose-300/20 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label htmlFor="signup-name" className="ml-1 text-xs font-semibold uppercase tracking-[.14em] text-slate-400">Full name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-300/70" />
                            <input id="signup-name" type="text" required value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} 
                                className="w-full rounded-xl border border-white/[.1] bg-white/[.04] py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:border-cyan-300/60 focus:outline-none focus:ring-2 focus:ring-cyan-300/20" 
                                placeholder="John Doe" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="signup-email" className="ml-1 text-xs font-semibold uppercase tracking-[.14em] text-slate-400">Email address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-300/70" />
                            <input id="signup-email" type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} 
                                className="w-full rounded-xl border border-white/[.1] bg-white/[.04] py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:border-cyan-300/60 focus:outline-none focus:ring-2 focus:ring-cyan-300/20" 
                                placeholder="name@example.com" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="signup-phone" className="ml-1 text-xs font-semibold uppercase tracking-[.14em] text-slate-400">Phone number</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-300/70" />
                            <input id="signup-phone" type="tel" required maxLength={10} value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})} 
                                className="w-full rounded-xl border border-white/[.1] bg-white/[.04] py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:border-cyan-300/60 focus:outline-none focus:ring-2 focus:ring-cyan-300/20" 
                                placeholder="9876543210 (10-digit mobile)" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="signup-password" className="ml-1 text-xs font-semibold uppercase tracking-[.14em] text-slate-400">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-300/70" />
                            <input id="signup-password" type="password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} 
                                className="w-full rounded-xl border border-white/[.1] bg-white/[.04] py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:border-cyan-300/60 focus:outline-none focus:ring-2 focus:ring-cyan-300/20" 
                                placeholder="••••••••" />
                        </div>
                    </div>
                    <button type="submit" disabled={loading} 
                        className="group mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-200 py-4 text-lg font-bold text-slate-950 shadow-[0_12px_35px_rgba(103,232,249,.15)] hover:-translate-y-0.5 hover:bg-cyan-100">
                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                            <>Create Account <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                        )}
                    </button>
                </form>
                <p className="mt-7 text-center text-sm text-slate-400">
                    Already part of Nexus? <Link to="/login" className="font-semibold text-cyan-200 hover:text-white">Sign in</Link>
                </p>
                </div>
                <div className="hidden flex-col justify-between bg-gradient-to-br from-blue-500/[.1] via-indigo-500/[.08] to-transparent p-10 lg:flex">
                    <div>
                        <div className="nexus-eyebrow inline-flex items-center gap-2"><Sparkles className="h-4 w-4" /> Designed for the journey</div>
                        <h1 className="nexus-display mt-8 text-5xl font-semibold text-white">Make every<br /><span className="text-cyan-200">mile matter.</span></h1>
                        <p className="mt-6 max-w-sm leading-7 text-slate-400">Save your preferences, follow your itinerary, and let intelligent tools make travel feel effortless.</p>
                    </div>
                    <div className="nexus-glass rounded-2xl p-4">
                        <div className="flex items-center gap-3 text-sm text-slate-300"><ShieldCheck className="h-5 w-5 text-emerald-300" /><span>Your profile stays in your control</span></div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Signup;
