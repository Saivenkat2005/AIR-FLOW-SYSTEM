import React, { useState, useEffect } from "react";
import apiCalls from "../../Service/apiCalls";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import {
  User,
  Phone,
  Plane,
  MapPin,
  Calendar,
  Users,
  CheckCircle,
  ChevronRight,
  Loader2,
  ArrowRight,
  Armchair,
} from "lucide-react";

/* ─── Step progress indicator ─────────────────────────────── */
const steps = [
  { id: 1, label: "Passenger Details", icon: User },
  { id: 2, label: "Flight Info", icon: Plane },
  { id: 3, label: "Confirmation", icon: CheckCircle },
];

const StepIndicator = ({ currentStep }) => (
  <div className="flex items-center justify-center gap-0 mb-10">
    {steps.map((step, idx) => {
      const Icon = step.icon;
      const isActive = step.id === currentStep;
      const isDone = step.id < currentStep;
      return (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                isDone
                  ? "bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/30"
                  : isActive
                  ? "bg-sky-500 border-sky-400 text-white shadow-lg shadow-sky-500/30 scale-110"
                  : "bg-white/10 border-white/20 text-white/40"
              }`}
            >
              {isDone ? (
                <CheckCircle size={18} />
              ) : (
                <Icon size={18} />
              )}
            </div>
            <span
              className={`text-xs font-semibold whitespace-nowrap transition-colors duration-300 ${
                isActive ? "text-sky-300" : isDone ? "text-emerald-400" : "text-white/35"
              }`}
            >
              {step.label}
            </span>
          </div>
          {idx < steps.length - 1 && (
            <div
              className={`h-0.5 w-16 mx-2 mb-5 rounded-full transition-all duration-500 ${
                step.id < currentStep ? "bg-emerald-400" : "bg-white/15"
              }`}
            />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

/* ─── floating label input ────────────────────────────────── */
const FloatingInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  icon: Icon,
  readOnly = false,
}) => (
  <div className="relative group">
    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-sky-400 transition-colors duration-200 z-10">
      {Icon && <Icon size={16} />}
    </div>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder=" "
      readOnly={readOnly}
      className={`peer w-full pt-6 pb-2 pl-10 pr-4 bg-white/8 border border-white/15 rounded-xl text-white text-sm placeholder-transparent
        focus:outline-none focus:border-sky-400/60 focus:bg-white/12 focus:ring-2 focus:ring-sky-400/20
        transition-all duration-200 ${readOnly ? "opacity-60 cursor-not-allowed" : ""}`}
    />
    <label
      htmlFor={name}
      className="absolute left-10 top-2 text-white/45 text-xs font-medium peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-white/35
        peer-focus:top-2 peer-focus:text-xs peer-focus:text-sky-400 transition-all duration-200 pointer-events-none"
    >
      {label}
    </label>
    {readOnly && (
      <div className="absolute right-3 top-1/2 -translate-y-1/2">
        <span className="text-xs text-white/30 bg-white/10 px-2 py-0.5 rounded-full">auto</span>
      </div>
    )}
  </div>
);

/* ─── section card ────────────────────────────────────────── */
const SectionCard = ({ stepNum, title, children }) => (
  <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
    <div className="flex items-center gap-3 mb-2">
      <div className="w-7 h-7 rounded-full bg-sky-500/30 border border-sky-400/40 text-sky-300 text-xs font-bold flex items-center justify-center">
        {stepNum}
      </div>
      <h3 className="text-white/90 font-semibold text-sm uppercase tracking-wider">
        {title}
      </h3>
    </div>
    {children}
  </div>
);

/* ─── main component ──────────────────────────────────────── */
export default function AddBooking() {
  const location = useLocation();
  const navigate = useNavigate();
  const profileId = JSON.parse(localStorage.getItem("profileId"));
  const seatid = location.state.seatid.selectedRow;

  const [seat, setseat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visualStep, setVisualStep] = useState(1);

  const [addBooking, setaddBooking] = useState({
    customerId: profileId,
    seatType: "",
    flightId: "",
    origin: "",
    destination: "",
    date: "",
    nop: "",
  });

  const handleChange = (e) => {
    const value = e.target.value;
    setaddBooking({ ...addBooking, [e.target.name]: value });
    // auto-advance visual step based on filled fields
    if (["origin", "destination"].includes(e.target.name) && value) {
      setVisualStep((prev) => Math.max(prev, 2));
    }
    if (["date", "nop"].includes(e.target.name) && value) {
      setVisualStep((prev) => Math.max(prev, 3));
    }
  };

  const saveBooking = (e) => {
    e.preventDefault();
    addBooking.flightId = seat.flightId;
    addBooking.seatType = seat.seatType;
    setLoading(true);
    toast.info("Reservation in process. Please wait !!!", {
      position: "top-center",
    });
    apiCalls
      .addBooking(addBooking)
      .then(() => {
        setLoading(false);
        navigate(`/${window.btoa("success")}`);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    apiCalls
      .getSeatbySeatId(seatid)
      .then((res) => setseat(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-600 via-blue-700 to-indigo-800 flex items-center justify-center p-4 md:p-8">
      {/* background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-blue-600/5 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        {/* header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 shadow-2xl mb-4">
            <Plane size={28} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Book Your Flight
          </h1>
          <p className="text-white/55 mt-2 text-sm">
            Fill in the details below to reserve your seat
          </p>
        </div>

        {/* step indicator */}
        <StepIndicator currentStep={visualStep} />

        {/* main form card */}
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8">
          <form onSubmit={saveBooking} className="space-y-6">

            {/* Step 1 – Passenger Details */}
            <SectionCard stepNum={1} title="Passenger Details">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FloatingInput
                  label="Customer ID"
                  name="customerId"
                  value={addBooking.customerId}
                  onChange={handleChange}
                  icon={User}
                  readOnly
                />
                <FloatingInput
                  label="Number of Passengers"
                  name="nop"
                  type="number"
                  value={addBooking.nop}
                  onChange={handleChange}
                  icon={Users}
                />
              </div>
            </SectionCard>

            {/* Step 2 – Flight Selection */}
            <SectionCard stepNum={2} title="Flight Information">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* pre-filled from seat */}
                <div className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl">
                  <Armchair size={16} className="text-sky-400 flex-shrink-0" />
                  <div>
                    <p className="text-white/40 text-xs">Seat Class</p>
                    <p className="text-white font-semibold text-sm">
                      {seat.seatType || "—"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl">
                  <Plane size={16} className="text-sky-400 flex-shrink-0" />
                  <div>
                    <p className="text-white/40 text-xs">Flight ID</p>
                    <p className="text-white font-semibold text-sm">
                      {seat.flightId || "—"}
                    </p>
                  </div>
                </div>

                <FloatingInput
                  label="Origin"
                  name="origin"
                  value={addBooking.origin}
                  onChange={handleChange}
                  icon={MapPin}
                />
                <FloatingInput
                  label="Destination"
                  name="destination"
                  value={addBooking.destination}
                  onChange={handleChange}
                  icon={MapPin}
                />
              </div>
            </SectionCard>

            {/* Step 3 – Seat & Confirmation */}
            <SectionCard stepNum={3} title="Seat & Travel Date">
              <div className="grid grid-cols-1 gap-4">
                <FloatingInput
                  label="Travel Date"
                  name="date"
                  type="date"
                  value={addBooking.date}
                  onChange={handleChange}
                  icon={Calendar}
                />
              </div>

              {/* summary panel */}
              {addBooking.origin && addBooking.destination && addBooking.date && (
                <div className="mt-4 p-4 bg-sky-500/10 border border-sky-400/20 rounded-xl">
                  <p className="text-sky-300 text-xs font-bold uppercase tracking-wider mb-3">
                    Booking Summary
                  </p>
                  <div className="flex items-center gap-3 text-white/80 text-sm">
                    <span className="font-semibold">{addBooking.origin}</span>
                    <ArrowRight size={14} className="text-sky-400 flex-shrink-0" />
                    <span className="font-semibold">{addBooking.destination}</span>
                    <span className="ml-auto text-white/50">
                      {addBooking.date}
                    </span>
                  </div>
                  {addBooking.nop && (
                    <p className="text-white/50 text-xs mt-1">
                      {addBooking.nop} passenger{addBooking.nop > 1 ? "s" : ""}
                      {seat.seatType && ` · ${seat.seatType} class`}
                    </p>
                  )}
                </div>
              )}
            </SectionCard>

            {/* submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600
                hover:from-sky-400 hover:to-blue-500 disabled:opacity-60 disabled:cursor-not-allowed
                text-white font-bold text-base shadow-xl shadow-blue-900/40
                transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-blue-800/50"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Processing Reservation…
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  Confirm Booking
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          Your booking details will be sent to your registered email address
        </p>
      </div>
    </div>
  );
}
