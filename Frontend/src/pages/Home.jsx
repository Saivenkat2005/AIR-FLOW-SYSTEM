import React from 'react';
import { ArrowUpRight, Calendar, ChevronRight, Globe2, Plane, ShieldCheck, Sparkles, Tickets } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
    const features = [
        { icon: Globe2, label: 'Global network', value: '184+', detail: 'verified destinations' },
        { icon: Tickets, label: 'Smart ticketing', value: '24/7', detail: 'journey intelligence' },
        { icon: ShieldCheck, label: 'Trusted by design', value: '100%', detail: 'secure transactions' }
    ];

    return (
        <main className="relative min-h-[calc(100vh-4.75rem)] overflow-hidden px-5 py-10 sm:px-8 lg:px-12">
            <div className="nexus-grid pointer-events-none absolute inset-0 opacity-70" />
            <div className="pointer-events-none absolute -right-40 top-12 h-[34rem] w-[34rem] rounded-full bg-blue-500/[.08] blur-3xl" />
            <div className="pointer-events-none absolute -left-40 bottom-0 h-[28rem] w-[28rem] rounded-full bg-cyan-400/[.06] blur-3xl" />

            <div className="relative mx-auto max-w-7xl">
                <section className="grid items-center gap-14 pb-20 pt-6 lg:grid-cols-[1.05fr_.95fr] lg:gap-10 lg:pb-28 lg:pt-14">
                    <div className="animate-fade-in-up max-w-3xl">
                        <div className="nexus-eyebrow mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-200/15 bg-cyan-300/[.07] px-4 py-2">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300 shadow-[0_0_12px_#67e8f9]" />
                            Air Flow Buddy · intelligence online
                        </div>
                        <h1 className="nexus-display max-w-3xl text-5xl font-semibold text-white sm:text-7xl lg:text-[6.6rem]">
                            Travel at the <span className="bg-gradient-to-r from-cyan-200 via-sky-300 to-indigo-300 bg-clip-text text-transparent">speed of insight.</span>
                        </h1>
                        <p className="mt-8 max-w-xl text-base leading-8 text-slate-400 sm:text-lg">
                            A calmer way to navigate the world. Discover verified schedules, intelligent routes, and a journey experience designed around you.
                        </p>
                        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                            <Link to="/search" className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-cyan-200 px-6 py-4 font-bold text-slate-950 shadow-[0_12px_40px_rgba(103,232,249,.18)] hover:-translate-y-0.5 hover:bg-cyan-100">
                                Explore verified flights <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                            </Link>
                            <Link to="/login" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[.04] px-6 py-4 font-semibold text-slate-200 hover:border-cyan-200/30 hover:bg-white/[.08]">
                                Sign in to your Nexus <ChevronRight className="h-4 w-4 text-cyan-300" />
                            </Link>
                        </div>
                        <div className="mt-12 flex items-center gap-4 text-xs text-slate-500">
                            <div className="flex -space-x-2">
                                {['JD', 'AK', 'RM'].map((initials) => <span key={initials} className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#050914] bg-slate-700 text-[10px] font-bold text-cyan-100">{initials}</span>)}
                            </div>
                            <span><strong className="text-slate-300">Built for better journeys.</strong><br />Real schedules. Clear decisions.</span>
                        </div>
                    </div>

                    <div className="relative mx-auto h-[25rem] w-full max-w-[34rem] lg:h-[34rem]">
                        <div className="nexus-orbit absolute inset-8 sm:inset-12" />
                        <div className="nexus-orbit absolute inset-20 opacity-60 [animation-delay:-4s] sm:inset-28" />
                        <div className="absolute inset-10 rounded-full bg-gradient-to-br from-cyan-300/20 via-blue-500/10 to-indigo-500/20 blur-2xl sm:inset-16" />
                        <div className="absolute inset-16 overflow-hidden rounded-full border border-white/15 bg-gradient-to-br from-slate-700/80 via-slate-950 to-blue-950/90 shadow-[0_0_100px_rgba(56,189,248,.18)] sm:inset-24">
                            <div className="absolute inset-0 opacity-50 [background-image:linear-gradient(115deg,transparent_42%,rgba(103,232,249,.25)_43%,transparent_44%),linear-gradient(25deg,transparent_47%,rgba(96,165,250,.2)_48%,transparent_49%)] [background-size:140px_120px]" />
                            <div className="absolute left-[24%] top-[35%] h-2 w-2 rounded-full bg-cyan-200 shadow-[0_0_18px_6px_rgba(103,232,249,.7)]" />
                            <div className="absolute right-[25%] top-[48%] h-2 w-2 rounded-full bg-blue-200 shadow-[0_0_18px_6px_rgba(96,165,250,.7)]" />
                            <div className="absolute bottom-[28%] left-[45%] h-2 w-2 rounded-full bg-violet-200 shadow-[0_0_18px_6px_rgba(167,139,250,.7)]" />
                            <Plane className="absolute left-[28%] top-[29%] h-5 w-5 rotate-12 text-cyan-200" />
                            <Plane className="absolute right-[28%] top-[43%] h-4 w-4 -rotate-12 text-blue-200" />
                        </div>
                        <div className="nexus-glass absolute left-0 top-8 rounded-2xl px-4 py-3 sm:left-2 sm:top-16">
                            <p className="nexus-eyebrow text-[.58rem]">Live network</p>
                            <p className="mt-1 text-sm font-semibold text-white">184 destinations connected</p>
                        </div>
                        <div className="nexus-glass absolute bottom-8 right-0 rounded-2xl px-4 py-3 sm:bottom-14 sm:right-2">
                            <p className="nexus-eyebrow text-[.58rem]">Route intelligence</p>
                            <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-white"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Systems nominal</p>
                        </div>
                    </div>
                </section>

                <section className="grid gap-3 border-t border-white/[.08] pt-6 sm:grid-cols-3">
                    {features.map(({ icon: Icon, label, value, detail }) => (
                        <div key={label} className="group flex items-center gap-4 rounded-2xl px-4 py-4 hover:bg-white/[.04]">
                            <Icon className="h-5 w-5 text-cyan-300" />
                            <div><p className="text-xs uppercase tracking-[.16em] text-slate-500">{label}</p><p className="mt-1 text-sm text-slate-300"><strong className="text-lg text-white">{value}</strong> {detail}</p></div>
                        </div>
                    ))}
                </section>
            </div>
        </main>
    );
};

export default Home;
