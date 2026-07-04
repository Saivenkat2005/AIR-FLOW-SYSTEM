import React, { useState } from "react";
import apiCalls from "../../Service/apiCalls";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import {
  Plane,
  MapPin,
  Clock,
  Calendar,
  Cpu,
  Users,
  CheckCircle,
  Loader2,
  ArrowLeft,
  PlusCircle,
} from "lucide-react";

const STATUS_OPTIONS = ["Scheduled", "Delayed", "Cancelled", "On Time", "Boarding"];
const AIRCRAFT_TYPES = ["Boeing 737", "Boeing 777", "Boeing 787", "Airbus A320", "Airbus A330", "Airbus A380", "Embraer E190"];

const InputField = ({ label, icon: Icon, error, ...props }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-semibold text-sky-100 tracking-wide flex items-center gap-1.5">
      {Icon && <Icon size={14} className="text-sky-300" />}
      {label}
    </label>
    <div className="relative">
      <input
        {...props}
        className={`w-full bg-white/10 border ${
          error ? "border-red-400/60" : "border-white/20"
        } rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm
          focus:outline-none focus:ring-2 focus:ring-sky-400/60 focus:border-sky-400/60
          backdrop-blur-sm transition-all duration-300 hover:bg-white/15
          [color-scheme:dark]`}
      />
    </div>
    {error && <p className="text-red-400 text-xs mt-0.5">{error}</p>}
  </div>
);

const SelectField = ({ label, icon: Icon, children, ...props }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-semibold text-sky-100 tracking-wide flex items-center gap-1.5">
      {Icon && <Icon size={14} className="text-sky-300" />}
      {label}
    </label>
    <select
      {...props}
      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm
        focus:outline-none focus:ring-2 focus:ring-sky-400/60 focus:border-sky-400/60
        backdrop-blur-sm transition-all duration-300 hover:bg-white/15
        [color-scheme:dark] cursor-pointer"
    >
      {children}
    </select>
  </div>
);

export default function AddFlight() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [addflight, setflight] = useState({
    flightName: "",
    origin: "",
    destination: "",
    takeOffTime: "",
    arrivalTime: "",
    aircraftType: "",
    totalSeats: "",
    status: "Scheduled",
  });

  const handleChange = (e) => {
    const value = e.target.value;
    setflight({ ...addflight, [e.target.name]: value });
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!addflight.flightName.trim()) newErrors.flightName = "Flight name is required";
    if (!addflight.origin.trim()) newErrors.origin = "Origin is required";
    if (!addflight.destination.trim()) newErrors.destination = "Destination is required";
    if (!addflight.takeOffTime) newErrors.takeOffTime = "Departure date & time is required";
    if (!addflight.totalSeats) newErrors.totalSeats = "Total seats is required";
    return newErrors;
  };

  const saveFlight = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    apiCalls
      .addFlight(addflight)
      .then((response) => {
        toast.success("Flight submitted for approval!", {
          position: "top-center",
          style: { background: "#0f172a", color: "#e0f2fe", border: "1px solid #0ea5e9" },
        });
        navigate(`/${window.btoa("flights")}`);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to add flight. Please try again.", { position: "top-center" });
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-600 via-blue-700 to-indigo-800 flex items-center justify-center p-6">
      {/* Decorative blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 mb-4 shadow-lg">
            <Plane size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight" style={{ fontFamily: "Poppins, sans-serif" }}>
            Add New Flight
          </h1>
          <p className="text-sky-200 mt-2 text-sm">Fill in the details to schedule a new flight</p>
        </div>

        {/* Card */}
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8">
          <form onSubmit={saveFlight} noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Flight Name – full width */}
              <div className="md:col-span-2">
                <InputField
                  label="Flight Name / Number"
                  icon={Plane}
                  type="text"
                  name="flightName"
                  placeholder="e.g. AI-202, IndiGo 6E-175"
                  value={addflight.flightName}
                  onChange={handleChange}
                  error={errors.flightName}
                />
              </div>

              {/* Origin */}
              <InputField
                label="Origin"
                icon={MapPin}
                type="text"
                name="origin"
                placeholder="Departure city or airport"
                value={addflight.origin}
                onChange={handleChange}
                error={errors.origin}
              />

              {/* Destination */}
              <InputField
                label="Destination"
                icon={MapPin}
                type="text"
                name="destination"
                placeholder="Arrival city or airport"
                value={addflight.destination}
                onChange={handleChange}
                error={errors.destination}
              />

              {/* Departure Date & Time */}
              <InputField
                label="Departure Date & Time"
                icon={Calendar}
                type="datetime-local"
                name="takeOffTime"
                value={addflight.takeOffTime}
                onChange={handleChange}
                error={errors.takeOffTime}
              />

              {/* Arrival Time */}
              <InputField
                label="Arrival Date & Time"
                icon={Clock}
                type="datetime-local"
                name="arrivalTime"
                value={addflight.arrivalTime}
                onChange={handleChange}
              />

              {/* Aircraft Type */}
              <SelectField
                label="Aircraft Type"
                icon={Cpu}
                name="aircraftType"
                value={addflight.aircraftType}
                onChange={handleChange}
              >
                <option value="">Select Aircraft Type</option>
                {AIRCRAFT_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </SelectField>

              {/* Total Seats */}
              <InputField
                label="Total Seats"
                icon={Users}
                type="number"
                name="totalSeats"
                placeholder="e.g. 180"
                min="1"
                value={addflight.totalSeats}
                onChange={handleChange}
                error={errors.totalSeats}
              />

              {/* Status – full width */}
              <div className="md:col-span-2">
                <SelectField
                  label="Flight Status"
                  icon={CheckCircle}
                  name="status"
                  value={addflight.status}
                  onChange={handleChange}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </SelectField>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-white/10 my-7" />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-blue-600
                  hover:from-sky-400 hover:to-blue-500 disabled:opacity-60 disabled:cursor-not-allowed
                  text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-sky-900/30
                  transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sky-700/40
                  active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-sky-400"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <PlusCircle size={18} />
                    Add Flight
                  </>
                )}
              </button>

              <Link
                to={`/${window.btoa("flights")}`}
                className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20
                  border border-white/20 hover:border-white/40 text-white font-semibold py-3.5 rounded-xl
                  transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white/40"
              >
                <ArrowLeft size={18} />
                Cancel
              </Link>
            </div>
          </form>
        </div>

        {/* Footer hint */}
        <p className="text-center text-sky-300/70 text-xs mt-6">
          Flight will be sent for admin approval after submission.
        </p>
      </div>
    </div>
  );
}
