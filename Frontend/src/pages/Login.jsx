
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Loader2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

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
        <main className="relative flex min-h-[calc(100vh-4.75rem)] items-center justify-center overflow-hidden px-5 py-10 sm:px-8">
            <div className="nexus-grid pointer-events-none absolute inset-0 opacity-60" />
            <div className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-cyan-400/[.08] blur-3xl" />
            <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-indigo-500/[.1] blur-3xl" />

            <div className="relative grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/[.1] bg-slate-950/60 shadow-2xl backdrop-blur-2xl lg:grid-cols-[.9fr_1.1fr]">
                <div className="hidden flex-col justify-between bg-gradient-to-br from-cyan-300/[.12] via-blue-500/[.06] to-transparent p-10 lg:flex">
                    <div>
                        <div className="nexus-eyebrow inline-flex items-center gap-2"><Sparkles className="h-4 w-4" /> Nexus access</div>
                        <h1 className="nexus-display mt-8 text-5xl font-semibold text-white">Your journey,<br /><span className="text-cyan-200">already in motion.</span></h1>
                        <p className="mt-6 max-w-sm leading-7 text-slate-400">Return to a calmer travel experience with verified flights, intelligent assistance, and every trip in one place.</p>
                    </div>
                    <div className="nexus-glass rounded-2xl p-4">
                        <div className="flex items-center gap-3 text-sm text-slate-300"><ShieldCheck className="h-5 w-5 text-emerald-300" /><span>Protected by secure identity controls</span></div>
                    </div>
                </div>

                <div className="p-7 sm:p-10 lg:p-14">
                <div className="mb-9">
                    <p className="nexus-eyebrow mb-3">Welcome back</p>
                    <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Sign in to Nexus</h2>
                    <p className="mt-3 text-slate-400">Manage your bookings and continue your journey.</p>
                </div>
                {error && <div role="alert" className="mb-6 rounded-xl border border-rose-300/20 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label htmlFor="login-email" className="ml-1 text-xs font-semibold uppercase tracking-[.14em] text-slate-400">Email address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-300/70" />
                            <input id="login-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} 
                                className="w-full rounded-xl border border-white/[.1] bg-white/[.04] py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:border-cyan-300/60 focus:outline-none focus:ring-2 focus:ring-cyan-300/20" 
                                placeholder="name@example.com" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="login-password" className="ml-1 text-xs font-semibold uppercase tracking-[.14em] text-slate-400">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-300/70" />
                            <input id="login-password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} 
                                className="w-full rounded-xl border border-white/[.1] bg-white/[.04] py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:border-cyan-300/60 focus:outline-none focus:ring-2 focus:ring-cyan-300/20" 
                                placeholder="••••••••" />
                        </div>
                    </div>
                    <button type="submit" disabled={loading} 
                        className="group mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-200 py-4 text-lg font-bold text-slate-950 shadow-[0_12px_35px_rgba(103,232,249,.15)] hover:-translate-y-0.5 hover:bg-cyan-100">
                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                            <>Sign In <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                        )}
                    </button>
                </form>

                <div className="mt-7 border-t border-white/[.08] pt-6">
                    <p className="mb-3 text-center text-xs uppercase tracking-[.14em] text-slate-500">Demo access</p>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => { setEmail('passenger@persistent.com'); setPassword('password123'); }}
                            className="flex-1 rounded-xl border border-cyan-200/15 bg-cyan-300/[.06] px-3 py-2.5 text-xs font-semibold text-cyan-200 hover:bg-cyan-300/[.12]"
                        >
                            Passenger (Demo)
                        </button>
                        <button
                            type="button"
                            onClick={() => { setEmail('admin@persistent.com'); setPassword('password123'); }}
                            className="flex-1 rounded-xl border border-blue-200/15 bg-blue-300/[.06] px-3 py-2.5 text-xs font-semibold text-blue-200 hover:bg-blue-300/[.12]"
                        >
                            Admin (Demo)
                        </button>
                    </div>
                </div>

                <p className="mt-7 text-center text-sm text-slate-400">
                    New to Nexus? <Link to="/signup" className="font-semibold text-cyan-200 hover:text-white">Create your account</Link>
                </p>
                </div>
            </div>
        </main>
    );
};

export default Login;
