import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plane,
  Ticket,
  User,
  ArrowRight,
  MapPin,
  ChevronRight,
  Wind,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Inline keyframe styles injected once into <head>
   (No external CSS file — all animation via a
   single <style> tag injected at mount time)
───────────────────────────────────────────── */
const KEYFRAME_STYLES = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50%       { transform: translateY(-18px) rotate(5deg); }
  }
  @keyframes floatCloud {
    0%, 100% { transform: translateY(0px) scale(1); opacity: 0.18; }
    50%       { transform: translateY(-12px) scale(1.04); opacity: 0.28; }
  }
  @keyframes planeFly {
    0%   { transform: translateX(-60px) translateY(10px) rotate(-5deg); opacity: 0; }
    10%  { opacity: 1; }
    90%  { opacity: 1; }
    100% { transform: translateX(60px) translateY(-10px) rotate(5deg); opacity: 0; }
  }
  @keyframes fadeSlideUp {
    0%   { opacity: 0; transform: translateY(32px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.35); }
    50%       { box-shadow: 0 0 0 14px rgba(255,255,255,0); }
  }
  .anim-float        { animation: float 5s ease-in-out infinite; }
  .anim-float-cloud  { animation: floatCloud 6s ease-in-out infinite; }
  .anim-plane        { animation: planeFly 4s ease-in-out infinite; }
  .anim-fade-up      { animation: fadeSlideUp 0.7s ease both; }
  .anim-delay-1      { animation-delay: 0.1s; }
  .anim-delay-2      { animation-delay: 0.22s; }
  .anim-delay-3      { animation-delay: 0.34s; }
  .anim-delay-4      { animation-delay: 0.46s; }
  .anim-delay-5      { animation-delay: 0.58s; }
  .anim-delay-6      { animation-delay: 0.7s; }
  .anim-delay-cloud1 { animation-delay: 0s; }
  .anim-delay-cloud2 { animation-delay: 1.5s; }
  .anim-delay-cloud3 { animation-delay: 3s; }
  .pulse-glow        { animation: pulse-glow 2.5s ease-in-out infinite; }
  .glass-card {
    background: rgba(255,255,255,0.08);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255,255,255,0.18);
  }
  .glass-card-light {
    background: rgba(255,255,255,0.72);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255,255,255,0.55);
  }
`;

/* ─────────────────────────────────────────────
   Data
───────────────────────────────────────────── */
const QUICK_ACTIONS = [
  {
    id: "flights",
    label: "Search Flights",
    description: "Find the best deals and book your next adventure instantly.",
    icon: Plane,
    iconBg: "from-sky-400 to-cyan-500",
    navKey: "flights",
  },
  {
    id: "viewBooking",
    label: "My Bookings",
    description: "View, manage and download all your active reservations.",
    icon: Ticket,
    iconBg: "from-violet-500 to-purple-600",
    navKey: "viewBooking",
  },
  {
    id: "myprofile",
    label: "My Profile",
    description: "Update your personal details, preferences and travel info.",
    icon: User,
    iconBg: "from-emerald-400 to-teal-500",
    navKey: "myprofile",
  },
];

const DESTINATIONS = [
  {
    city: "Delhi",
    tagline: "The Capital City",
    gradient: "from-rose-500 via-orange-400 to-yellow-400",
    emoji: "🏛️",
  },
  {
    city: "Mumbai",
    tagline: "City of Dreams",
    gradient: "from-blue-500 via-cyan-400 to-teal-400",
    emoji: "🌆",
  },
  {
    city: "Bangalore",
    tagline: "Silicon Valley of India",
    gradient: "from-violet-600 via-purple-500 to-fuchsia-500",
    emoji: "🌿",
  },
  {
    city: "Hyderabad",
    tagline: "City of Pearls",
    gradient: "from-amber-500 via-orange-500 to-red-500",
    emoji: "🕌",
  },
];

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */

/** Decorative animated cloud blob */
const CloudBlob = ({ className = "", delay = "" }) => (
  <div
    className={`absolute rounded-full bg-white anim-float-cloud ${delay} ${className}`}
  />
);

/** Quick-action card */
const ActionCard = ({ action, onClick }) => {
  const Icon = action.icon;
  return (
    <button
      onClick={onClick}
      className="
        group relative glass-card-light rounded-2xl p-6 text-left w-full
        shadow-xl hover:-translate-y-2 hover:shadow-2xl
        transition-all duration-300 cursor-pointer
        focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500
      "
    >
      {/* Icon badge */}
      <div
        className={`
          inline-flex items-center justify-center w-14 h-14 rounded-2xl
          bg-gradient-to-br ${action.iconBg} shadow-lg mb-5
          group-hover:scale-110 transition-transform duration-300
        `}
      >
        <Icon className="text-white" size={26} strokeWidth={1.8} />
      </div>

      {/* Text */}
      <h3 className="text-lg font-bold text-slate-800 mb-1 leading-snug">
        {action.label}
      </h3>
      <p className="text-sm text-slate-500 leading-relaxed mb-4">
        {action.description}
      </p>

      {/* Arrow */}
      <span className="inline-flex items-center gap-1 text-sky-600 font-semibold text-sm group-hover:gap-2 transition-all duration-200">
        Explore <ArrowRight size={16} />
      </span>

      {/* Subtle top-right glow */}
      <div
        className={`
          absolute top-4 right-4 w-8 h-8 rounded-full opacity-20
          bg-gradient-to-br ${action.iconBg}
          group-hover:opacity-40 transition-opacity duration-300
        `}
      />
    </button>
  );
};

/** Destination card */
const DestinationCard = ({ dest }) => (
  <div
    className="
      group relative rounded-2xl overflow-hidden shadow-xl
      hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 cursor-pointer
    "
    style={{ minHeight: "200px" }}
  >
    {/* Gradient background */}
    <div
      className={`absolute inset-0 bg-gradient-to-br ${dest.gradient}`}
    />

    {/* Noise / texture overlay */}
    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />

    {/* Large emoji as "art" */}
    <div className="absolute -bottom-4 -right-4 text-8xl opacity-25 select-none pointer-events-none group-hover:opacity-35 transition-opacity duration-300">
      {dest.emoji}
    </div>

    {/* Content */}
    <div className="relative z-10 p-5 flex flex-col h-full justify-between" style={{ minHeight: "200px" }}>
      <div className="flex items-start justify-between">
        <MapPin className="text-white/80 mt-0.5" size={18} />
        <span className="text-white/70 text-xs font-medium px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm">
          Popular
        </span>
      </div>

      <div>
        <h4 className="text-2xl font-extrabold text-white leading-tight">
          {dest.city}
        </h4>
        <p className="text-white/80 text-sm font-medium mt-0.5">
          {dest.tagline}
        </p>
        <div className="flex items-center gap-1 mt-3 text-white/90 text-sm font-semibold group-hover:gap-2 transition-all duration-200">
          Explore <ChevronRight size={15} />
        </div>
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
const UserDashboard = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("Traveler");

  /* Inject keyframe styles once */
  useEffect(() => {
    if (!document.getElementById("ud-keyframes")) {
      const style = document.createElement("style");
      style.id = "ud-keyframes";
      style.textContent = KEYFRAME_STYLES;
      document.head.appendChild(style);
    }
    return () => {
      // Leave styles in place for SPA performance
    };
  }, []);

  /* Load username from localStorage */
  useEffect(() => {
    const stored = localStorage.getItem("username");
    if (stored) setUsername(stored);
  }, []);

  /* Navigation helper */
  const go = (key) => navigate(`/${window.btoa(key)}`);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-sky-50 to-indigo-100 font-sans">
      {/* ══════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700">
        {/* Decorative cloud blobs */}
        <CloudBlob
          className="w-72 h-72 -top-20 -left-20 opacity-[0.12] anim-delay-cloud1"
          delay="anim-delay-cloud1"
        />
        <CloudBlob
          className="w-96 h-96 -bottom-32 -right-24 opacity-[0.10] anim-delay-cloud2"
          delay="anim-delay-cloud2"
        />
        <CloudBlob
          className="w-48 h-48 top-10 right-1/3 opacity-[0.08] anim-delay-cloud3"
          delay="anim-delay-cloud3"
        />

        {/* Faint grid lines */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Hero content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 md:py-28 flex flex-col items-center text-center">
          {/* Animated plane icon */}
          <div className="anim-float mb-6">
            <div className="pulse-glow inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/15 border border-white/30 backdrop-blur-sm">
              <Plane
                className="text-white drop-shadow-lg"
                size={40}
                strokeWidth={1.6}
              />
            </div>
          </div>

          {/* Heading */}
          <h1 className="anim-fade-up anim-delay-1 text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
            Ready to Take Off?
          </h1>

          {/* Subtitle */}
          <p className="anim-fade-up anim-delay-2 mt-4 text-lg md:text-xl text-white/85 font-medium">
            Welcome back,{" "}
            <span className="text-yellow-300 font-bold">{username}</span>! Your
            next adventure is just a click away.
          </p>

          {/* CTA Button */}
          <button
            onClick={() => go("flights")}
            className="
              anim-fade-up anim-delay-3
              mt-8 inline-flex items-center gap-2
              bg-white text-sky-700 font-bold text-base md:text-lg
              px-8 py-4 rounded-full shadow-2xl
              hover:scale-105 hover:shadow-white/30
              active:scale-95
              transition-all duration-300
              focus:outline-none focus-visible:ring-4 focus-visible:ring-white/60
            "
          >
            <Plane size={20} strokeWidth={2} className="-rotate-45" />
            Book a Flight
          </button>

          {/* Mini stat pills */}
          <div className="anim-fade-up anim-delay-4 mt-10 flex flex-wrap justify-center gap-4">
            {[
              { icon: Wind, label: "50+ Destinations" },
              { icon: Plane, label: "Daily Flights" },
              { icon: Ticket, label: "Easy Booking" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="glass-card flex items-center gap-2 px-4 py-2 rounded-full text-white/90 text-sm font-medium"
              >
                <Icon size={15} className="text-yellow-300" />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom wave */}
        <div className="relative">
          <svg
            viewBox="0 0 1440 60"
            className="w-full block"
            preserveAspectRatio="none"
            style={{ height: "60px" }}
          >
            <path
              d="M0,40 C360,80 1080,0 1440,40 L1440,60 L0,60 Z"
              fill="rgb(240 249 255)"
              className="dark:fill-slate-900"
            />
          </svg>
        </div>
      </section>

      {/* ══════════════════════════════════════
          QUICK ACTIONS
      ══════════════════════════════════════ */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="anim-fade-up anim-delay-1 mb-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 leading-tight">
            Quick Actions
          </h2>
          <p className="text-slate-500 mt-1 text-sm md:text-base">
            Everything you need, right at your fingertips.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {QUICK_ACTIONS.map((action, idx) => (
            <div
              key={action.id}
              className={`anim-fade-up anim-delay-${idx + 2}`}
            >
              <ActionCard action={action} onClick={() => go(action.navKey)} />
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          POPULAR DESTINATIONS
      ══════════════════════════════════════ */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="anim-fade-up anim-delay-1 mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 leading-tight">
              Popular Destinations
            </h2>
            <p className="text-slate-500 mt-1 text-sm md:text-base">
              Trending routes loved by our travellers.
            </p>
          </div>
          <button
            onClick={() => go("flights")}
            className="hidden sm:inline-flex items-center gap-1 text-sky-600 font-semibold text-sm hover:gap-2 transition-all duration-200"
          >
            View all <ChevronRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {DESTINATIONS.map((dest, idx) => (
            <div
              key={dest.city}
              className={`anim-fade-up anim-delay-${idx + 2}`}
            >
              <DestinationCard dest={dest} />
            </div>
          ))}
        </div>

        {/* Mobile "view all" link */}
        <div className="sm:hidden mt-6 text-center">
          <button
            onClick={() => go("flights")}
            className="inline-flex items-center gap-1 text-sky-600 font-semibold text-sm"
          >
            View all destinations <ChevronRight size={16} />
          </button>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FOOTER STRIP
      ══════════════════════════════════════ */}
      <footer className="bg-gradient-to-r from-sky-600 to-indigo-700 py-5 text-center">
        <p className="text-white/70 text-xs font-medium tracking-wide">
          © {new Date().getFullYear()} SkyBook Airlines · Your Journey, Our
          Passion
        </p>
      </footer>
    </div>
  );
};

export default UserDashboard;
