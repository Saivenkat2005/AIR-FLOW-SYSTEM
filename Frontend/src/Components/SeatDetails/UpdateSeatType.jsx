import React, { useState, useEffect } from "react";
import apiCalls from "../../Service/apiCalls";
import { toast } from "react-toastify";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Edit2,
  Armchair,
  DollarSign,
  Star,
  Briefcase,
  Users,
  Minus,
  Plus,
  Loader2,
  RefreshCw,
  X,
  CheckCircle,
} from "lucide-react";

// ─── Seat class options ───────────────────────────────────────────────────────
const SEAT_CLASSES = [
  {
    value: "Economy Class",
    label: "Economy",
    icon: Users,
    activeBg: "bg-gradient-to-r from-sky-500 to-blue-600",
    activeText: "text-white",
    inactiveBg: "bg-white/5",
    inactiveText: "text-white/60",
    borderActive: "border-sky-400/60",
    borderInactive: "border-white/10",
    glow: "shadow-sky-500/30",
    badge: "bg-sky-400/20 text-sky-300 border-sky-400/40",
  },
  {
    value: "Business Class",
    label: "Business",
    icon: Briefcase,
    activeBg: "bg-gradient-to-r from-violet-500 to-purple-600",
    activeText: "text-white",
    inactiveBg: "bg-white/5",
    inactiveText: "text-white/60",
    borderActive: "border-violet-400/60",
    borderInactive: "border-white/10",
    glow: "shadow-violet-500/30",
    badge: "bg-violet-400/20 text-violet-300 border-violet-400/40",
  },
  {
    value: "First Class",
    label: "First Class",
    icon: Star,
    activeBg: "bg-gradient-to-r from-amber-400 to-yellow-500",
    activeText: "text-white",
    inactiveBg: "bg-white/5",
    inactiveText: "text-white/60",
    borderActive: "border-amber-400/60",
    borderInactive: "border-white/10",
    glow: "shadow-amber-400/30",
    badge: "bg-amber-400/20 text-amber-300 border-amber-400/40",
  },
];

export default function UpdateSeatType() {
  const navigate = useNavigate();
  const location = useLocation();
  const [seat, setseat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [addSeatType, setSeatTypes] = useState({
    seatId: location.state.seatTypesObj.selectedRow,
    flightId: "",
    seatType: "",
    availableSeats: "",
    price: "",
  });

  // ── Handlers ────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const value = e.target.value;
    console.log(value);
    setSeatTypes({ ...addSeatType, [e.target.name]: value });
  };

  const changeSeatType = (e) => {
    const value = e.target.value;
    console.log(value);
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

  // ── API: fetch existing seat data ────────────────────────────────────────
  useEffect(() => {
    async function getData() {
      apiCalls
        .getSeatbySeatId(location.state.seatTypesObj.selectedRow)
        .then((res) => {
          setseat(res.data);
          // Pre-fill form with fetched values
          setSeatTypes((prev) => ({
            ...prev,
            seatType: res.data.seatType || "",
            availableSeats: String(res.data.availableSeats || ""),
            price: String(res.data.price || ""),
          }));
          setFetching(false);
        })
        .catch((err) => {
          console.log(err);
          setFetching(false);
        });
    }
    getData();
  }, []);

  // ── API: update seat ─────────────────────────────────────────────────────
  const updateSeatType = (e) => {
    addSeatType.flightId = seat.flightId;
    e.preventDefault();
    setLoading(true);
    navigate(`/${window.btoa("flights")}`);
    apiCalls
      .updateSeatType(addSeatType)
      .then((response) => {
        console.log(addSeatType);
        toast.info(`SENT FOR APPROVAL`, { position: "top-center" });
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

  // ─── Loading / fetching state ─────────────────────────────────────────
  if (fetching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-600 via-blue-700 to-indigo-800 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4" />
          <p className="text-white/70 font-medium">Loading seat data…</p>
        </div>
      </div>
    );
  }

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
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl shadow-lg shadow-emerald-500/30">
              <Edit2 size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Update Seat Type</h1>
              <p className="text-white/50 text-sm mt-0.5">
                Editing seat #{location.state.seatTypesObj.selectedRow}
              </p>
            </div>
          </div>
          {/* Current class badge */}
          {seat.seatType && (
            <div
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 ${
                (SEAT_CLASSES.find((c) => c.value === seat.seatType) || SEAT_CLASSES[0]).badge
              }`}
            >
              <CheckCircle size={12} />
              {seat.seatType}
            </div>
          )}
        </div>

        {/* Form card */}
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 space-y-6">
          {/* ── Seat Class ─────────────────────────────────────── */}
          <div>
            <label className="block text-white/70 text-sm font-semibold mb-1 uppercase tracking-wider">
              Seat Class
            </label>
            {seat.seatType && (
              <p className="text-white/40 text-xs mb-3">
                Current:{" "}
                <span className="text-white/60 font-medium">{seat.seatType}</span>
              </p>
            )}
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
          </div>

          {/* Divider */}
          <div className="h-px bg-white/10" />

          {/* ── Available Seats (stepper) ─────────────────────── */}
          <div>
            <label className="block text-white/70 text-sm font-semibold mb-1 uppercase tracking-wider">
              Available Seats
            </label>
            {seat.availableSeats !== undefined && (
              <p className="text-white/40 text-xs mb-3">
                Current:{" "}
                <span className="text-white/60 font-medium">{seat.availableSeats} seats</span>
              </p>
            )}
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
                placeholder={String(seat.availableSeats || "0")}
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
          </div>

          {/* ── Price ────────────────────────────────────────── */}
          <div>
            <label className="block text-white/70 text-sm font-semibold mb-1 uppercase tracking-wider">
              Price per Seat
            </label>
            {seat.price !== undefined && (
              <p className="text-white/40 text-xs mb-3">
                Current:{" "}
                <span className="text-white/60 font-medium">
                  ₹{Number(seat.price).toLocaleString("en-IN")}
                </span>
              </p>
            )}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <DollarSign size={18} className="text-white/40" />
              </div>
              <input
                type="number"
                name="price"
                value={addSeatType.price}
                onChange={handleChange}
                placeholder={String(seat.price || "Enter price (₹)")}
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
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${selectedClass.borderActive} bg-white/5`}
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
              onClick={updateSeatType}
              disabled={!isValid || loading}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold rounded-2xl shadow-xl shadow-emerald-500/30 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Updating…
                </>
              ) : (
                <>
                  <RefreshCw size={18} />
                  Update Seat Type
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
