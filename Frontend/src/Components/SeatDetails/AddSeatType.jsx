import React, { useState } from "react";
import apiCalls from "../../Service/apiCalls";
import { toast } from "react-toastify";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  PlusCircle,
  Armchair,
  DollarSign,
  Star,
  Briefcase,
  Users,
  Minus,
  Plus,
  Loader2,
  Save,
  X,
} from "lucide-react";

// ─── Seat class options ───────────────────────────────────────────────────────
const SEAT_CLASSES = [
  {
    value: "Economy Class",
    label: "Economy",
    icon: Users,
    gradient: "from-sky-500 to-blue-600",
    activeBg: "bg-gradient-to-r from-sky-500 to-blue-600",
    activeText: "text-white",
    inactiveBg: "bg-white/5",
    inactiveText: "text-white/60",
    borderActive: "border-sky-400/60",
    borderInactive: "border-white/10",
    glow: "shadow-sky-500/30",
  },
  {
    value: "Business Class",
    label: "Business",
    icon: Briefcase,
    gradient: "from-violet-500 to-purple-600",
    activeBg: "bg-gradient-to-r from-violet-500 to-purple-600",
    activeText: "text-white",
    inactiveBg: "bg-white/5",
    inactiveText: "text-white/60",
    borderActive: "border-violet-400/60",
    borderInactive: "border-white/10",
    glow: "shadow-violet-500/30",
  },
  {
    value: "First Class",
    label: "First Class",
    icon: Star,
    gradient: "from-amber-400 to-yellow-500",
    activeBg: "bg-gradient-to-r from-amber-400 to-yellow-500",
    activeText: "text-white",
    inactiveBg: "bg-white/5",
    inactiveText: "text-white/60",
    borderActive: "border-amber-400/60",
    borderInactive: "border-white/10",
    glow: "shadow-amber-400/30",
  },
];

export default function AddSeatType() {
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location.state.flightid.flightid);
  const flightid = location.state.flightid.flightid;

  const [addSeatType, setSeatTypes] = useState({
    flightId: flightid,
    seatType: "",
    availableSeats: "",
    price: "",
  });
  const [loading, setLoading] = useState(false);

  // ── Handlers ────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const value = e.target.value;
    setSeatTypes({ ...addSeatType, [e.target.name]: value });
  };

  const handleClassSelect = (classValue) => {
    setSeatTypes({ ...addSeatType, seatType: classValue });
  };

  const incrementSeats = () => {
    const current = parseInt(addSeatType.availableSeats) || 0;
    setSeatTypes({ ...addSeatType, availableSeats: String(current + 1) });
  };

  const decrementSeats = () => {
    const current = parseInt(addSeatType.availableSeats) || 0;
    if (current > 0) {
      setSeatTypes({ ...addSeatType, availableSeats: String(current - 1) });
    }
  };

  // ── API call ─────────────────────────────────────────────────────────────
  const addSeatTypes = (e) => {
    e.preventDefault();
    setLoading(true);
    apiCalls
      .saveSeatType(addSeatType)
      .then((response) => {
        toast.info(`SENT FOR APPROVAL`, { position: "top-center" });
        navigate(`/${window.btoa("flights")}`);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const isValid =
    addSeatType.seatType &&
    addSeatType.availableSeats &&
    addSeatType.price;

  const selectedClass = SEAT_CLASSES.find((c) => c.value === addSeatType.seatType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-600 via-blue-700 to-indigo-800">
      {/* Ambient blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
        {/* Back link */}
        <Link to={`/${window.btoa("flights")}`}>
          <button className="flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-200 group mb-6">
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform duration-200"
            />
            <span className="text-sm font-medium">Back to Flights</span>
          </button>
        </Link>

        {/* Header card */}
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 mb-6 flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-sky-400 to-blue-600 rounded-2xl shadow-lg shadow-blue-500/30">
            <PlusCircle size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Add Seat Type</h1>
            <p className="text-white/50 text-sm mt-0.5">
              Configure a new seat class for Flight #{flightid}
            </p>
          </div>
        </div>

        {/* Form card */}
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 space-y-6">
          {/* ── Seat Class ───────────────────────────────────────── */}
          <div>
            <label className="block text-white/70 text-sm font-semibold mb-3 uppercase tracking-wider">
              Seat Class
            </label>
            <div className="grid grid-cols-3 gap-3">
              {SEAT_CLASSES.map((cls) => {
                const Icon = cls.icon;
                const isActive = addSeatType.seatType === cls.value;
                return (
                  <button
                    key={cls.value}
                    type="button"
                    onClick={() => handleClassSelect(cls.value)}
                    className={`flex flex-col items-center gap-2 px-4 py-4 rounded-2xl border font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5
                      ${
                        isActive
                          ? `${cls.activeBg} ${cls.activeText} ${cls.borderActive} shadow-lg ${cls.glow}`
                          : `${cls.inactiveBg} ${cls.inactiveText} ${cls.borderInactive} hover:bg-white/10`
                      }`}
                  >
                    <Icon size={20} />
                    <span>{cls.label}</span>
                  </button>
                );
              })}
            </div>
            {addSeatType.seatType && (
              <p className="mt-2 text-xs text-white/40">
                Selected: <span className="text-white/70 font-medium">{addSeatType.seatType}</span>
              </p>
            )}
          </div>

          {/* Divider */}
          <div className="h-px bg-white/10" />

          {/* ── Available Seats (stepper) ─────────────────────── */}
          <div>
            <label className="block text-white/70 text-sm font-semibold mb-3 uppercase tracking-wider">
              Available Seats
            </label>
            <div className="flex items-center gap-0 backdrop-blur-md bg-white/5 border border-white/15 rounded-2xl overflow-hidden">
              <button
                type="button"
                onClick={decrementSeats}
                className="flex items-center justify-center w-14 h-14 text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200 border-r border-white/10"
              >
                <Minus size={18} />
              </button>
              <input
                type="number"
                name="availableSeats"
                value={addSeatType.availableSeats}
                onChange={handleChange}
                placeholder="0"
                min="0"
                className="flex-1 h-14 bg-transparent text-white text-center text-xl font-bold placeholder-white/20 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button
                type="button"
                onClick={incrementSeats}
                className="flex items-center justify-center w-14 h-14 text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200 border-l border-white/10"
              >
                <Plus size={18} />
              </button>
            </div>
            <p className="mt-2 text-xs text-white/40">
              Total seat capacity for this class
            </p>
          </div>

          {/* ── Price ────────────────────────────────────────── */}
          <div>
            <label className="block text-white/70 text-sm font-semibold mb-3 uppercase tracking-wider">
              Price per Seat
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <DollarSign size={18} className="text-white/40" />
              </div>
              <input
                type="number"
                name="price"
                value={addSeatType.price}
                onChange={handleChange}
                placeholder="Enter price (₹)"
                min="0"
                className="w-full h-14 pl-11 pr-4 backdrop-blur-md bg-white/5 border border-white/15 rounded-2xl text-white placeholder-white/25 font-medium focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            {addSeatType.price && (
              <p className="mt-2 text-xs text-white/40">
                ₹{Number(addSeatType.price).toLocaleString("en-IN")} per seat
              </p>
            )}
          </div>

          {/* ── Preview pill ─────────────────────────────────── */}
          {isValid && selectedClass && (
            <div
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
                selectedClass.borderActive
              } bg-white/5`}
            >
              <div className={`p-2 rounded-xl ${selectedClass.activeBg} shadow-lg ${selectedClass.glow}`}>
                {React.createElement(selectedClass.icon, { size: 16, className: "text-white" })}
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">{addSeatType.seatType}</p>
                <p className="text-white/50 text-xs">
                  {addSeatType.availableSeats} seats · ₹
                  {Number(addSeatType.price).toLocaleString("en-IN")} each
                </p>
              </div>
              <Armchair size={18} className="text-white/30" />
            </div>
          )}

          {/* Divider */}
          <div className="h-px bg-white/10" />

          {/* ── Action buttons ────────────────────────────────── */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={addSeatTypes}
              disabled={!isValid || loading}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/30 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Seat Type
                </>
              )}
            </button>
            <Link to={`/${window.btoa("flights")}`}>
              <button
                type="button"
                className="flex items-center gap-2 py-3.5 px-5 backdrop-blur-md bg-white/5 border border-white/15 hover:bg-white/10 text-white/70 hover:text-white font-semibold rounded-2xl transition-all duration-300 hover:-translate-y-0.5"
              >
                <X size={18} />
                Cancel
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
