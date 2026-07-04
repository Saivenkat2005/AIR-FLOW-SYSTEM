import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle,
  Home,
  Download,
  Plane,
  Mail,
  ClipboardList,
  Sparkles,
} from "lucide-react";

/* ─── confetti particle data ──────────────────────────────── */
const COLORS = [
  "#38bdf8", "#818cf8", "#34d399", "#fbbf24",
  "#f472b6", "#a78bfa", "#60a5fa", "#fb923c",
];

const generateParticles = (n = 60) =>
  Array.from({ length: n }, (_, i) => ({
    id: i,
    color: COLORS[i % COLORS.length],
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 2}s`,
    duration: `${2.5 + Math.random() * 2}s`,
    size: `${6 + Math.random() * 8}px`,
    shape: Math.random() > 0.5 ? "circle" : "square",
    rotation: `${Math.random() * 360}deg`,
  }));

/* ─── highlight card ──────────────────────────────────────── */
const InfoCard = ({ icon: Icon, label, color = "text-sky-400" }) => (
  <div className="flex items-center gap-3 p-4 bg-white/8 border border-white/10 rounded-xl">
    <div className={`${color}`}>
      <Icon size={20} />
    </div>
    <p className="text-white/80 text-sm">{label}</p>
  </div>
);

/* ─── main component ──────────────────────────────────────── */
export default function Confirmed() {
  const [particles] = useState(() => generateParticles(70));
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // trigger entrance animation after mount
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-600 via-blue-700 to-indigo-800 flex items-center justify-center p-4 relative overflow-hidden">

      {/* ── keyframe animations ── */}
      <style>{`
        @keyframes confettiFall {
          0%   { transform: translateY(-120px) rotate(0deg); opacity: 1; }
          85%  { opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        @keyframes checkPop {
          0%   { transform: scale(0) rotate(-15deg); opacity: 0; }
          60%  { transform: scale(1.15) rotate(5deg); opacity: 1; }
          80%  { transform: scale(0.95) rotate(-2deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ringPulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50%       { transform: scale(1.18); opacity: 0.1; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .check-icon { animation: checkPop 0.7s cubic-bezier(0.34,1.56,0.64,1) 0.3s both; }
        .ring-pulse { animation: ringPulse 2.5s ease-in-out infinite; }
        .fade-up { animation: fadeSlideUp 0.5s ease both; }
        .shimmer-text {
          background: linear-gradient(90deg, #fff 25%, #7dd3fc 50%, #fff 75%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }
      `}</style>

      {/* ── confetti particles ── */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute top-0 pointer-events-none"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.shape === "circle" ? "50%" : "2px",
            transform: `rotate(${p.rotation})`,
            animation: `confettiFall ${p.duration} ${p.delay} ease-in forwards`,
          }}
        />
      ))}

      {/* ── ambient blurs ── */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-sky-400/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />

      {/* ── main card ── */}
      <div
        className={`relative z-10 w-full max-w-md transition-all duration-700 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 text-center">

          {/* ── animated checkmark ── */}
          <div className="relative inline-flex items-center justify-center mb-6">
            {/* pulsing rings */}
            <div className="absolute w-32 h-32 rounded-full border-2 border-emerald-400/30 ring-pulse" />
            <div
              className="absolute w-24 h-24 rounded-full border-2 border-emerald-400/20 ring-pulse"
              style={{ animationDelay: "0.4s" }}
            />
            {/* icon container */}
            <div className="check-icon w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-2xl shadow-emerald-500/40">
              <CheckCircle size={40} className="text-white" strokeWidth={2.5} />
            </div>
          </div>

          {/* ── headline ── */}
          <div className="fade-up" style={{ animationDelay: "0.4s" }}>
            <div className="flex items-center justify-center gap-2 mb-1">
              <Sparkles size={16} className="text-amber-400" />
              <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">
                Booking Confirmed
              </span>
              <Sparkles size={16} className="text-amber-400" />
            </div>
            <h1 className="text-4xl font-black mt-1 mb-3 shimmer-text">
              SUCCESS!
            </h1>
            <p className="text-white/65 text-sm leading-relaxed max-w-xs mx-auto">
              Your reservation has been confirmed. You will receive your booking
              details via your registered email address.
            </p>
          </div>

          {/* ── info highlights ── */}
          <div
            className="fade-up mt-7 space-y-3 text-left"
            style={{ animationDelay: "0.55s" }}
          >
            <InfoCard
              icon={Mail}
              label="Confirmation sent to your email"
              color="text-sky-400"
            />
            <InfoCard
              icon={Plane}
              label="Seat reserved & locked in"
              color="text-indigo-400"
            />
            <InfoCard
              icon={ClipboardList}
              label="View all bookings in Reservations"
              color="text-emerald-400"
            />
          </div>

          {/* ── action buttons ── */}
          <div
            className="fade-up mt-8 flex flex-col sm:flex-row gap-3"
            style={{ animationDelay: "0.7s" }}
          >
            <button
              onClick={() => window.print()}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl
                bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-semibold
                transition-all duration-200 hover:-translate-y-0.5 backdrop-blur-md"
            >
              <Download size={16} />
              Download Ticket
            </button>

            <Link to={`/${window.btoa("viewBooking")}`} className="flex-1">
              <button className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl
                bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500
                text-white text-sm font-bold shadow-lg shadow-blue-900/40
                transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl">
                <ClipboardList size={16} />
                View Reservations
              </button>
            </Link>
          </div>

          {/* ── back to home ── */}
          <div
            className="fade-up mt-5"
            style={{ animationDelay: "0.8s" }}
          >
            <Link to={`/${window.btoa("flights")}`}>
              <button className="flex items-center justify-center gap-1.5 mx-auto text-white/45 hover:text-white/80 text-sm transition-colors duration-200">
                <Home size={14} />
                Back to Home
              </button>
            </Link>
          </div>
        </div>

        {/* card glow */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-sky-400/10 to-indigo-600/10 blur-xl -z-10 scale-105" />
      </div>
    </div>
  );
}
