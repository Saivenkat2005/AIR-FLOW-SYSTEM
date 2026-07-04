import React, { useState, useEffect } from "react";
import apiCalls from "../../Service/apiCalls";
import { toast } from "react-toastify";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  PencilLine,
} from "lucide-react";

const STATUS_OPTIONS = ["Scheduled", "Delayed", "Cancelled", "On Time", "Boarding"];
const AIRCRAFT_TYPES = ["Boeing 737", "Boeing 777", "Boeing 787", "Airbus A320", "Airbus A330", "Airbus A380", "Embraer E190"];

const InputField = ({ label, icon: Icon, hint, ...props }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-semibold text-sky-100 tracking-wide flex items-center gap-1.5">
      {Icon && <Icon size={14} className="text-sky-300" />}
      {label}
    </label>
    <input
      {...props}
      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white
        placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400/60
        focus:border-sky-400/60 backdrop-blur-sm transition-all duration-300 hover:bg-white/15
        [color-scheme:dark]"
    />
    {hint && <p className="text-white/40 text-xs italic">{hint}</p>}
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

export default function UpdateFlight() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [existing, setExisting] = useState({});

  const [addflight, setflight] = useState({
    flightId: location.state.id.selectedRow,
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
  };

  const updateFlight = (e) => {
    e.preventDefault();
    setLoading(true);
    apiCalls
      .updateFlightById(addflight)
      .then((response) => {
        console.log(addflight);
        toast.success("Flight updated & sent for approval!", {
          position: "top-center",
          style: { background: "#0f172a", color: "#e0f2fe", border: "1px solid #0ea5e9" },
        });
        navigate(`/${window.btoa("flights")}`);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Update failed. Please try again.", { position: "top-center" });
        setLoading(false);
      });
  };

  useEffect(() => {
    async function getData() {
      apiCalls
        .getFlightbyFlightId(location.state.id.selectedRow)
        .then((res) => {
          setExisting(res.data);
          // Pre-fill form with fetched data
          setflight((prev) => ({
            ...prev,
            flightName: res.data.flightName || "",
            origin: res.data.origin || "",
            destination: res.data.destination || "",
            takeOffTime: res.data.takeOffTime || "",
            arrivalTime: res.data.arrivalTime || "",
            aircraftType: res.data.aircraftType || "",
            totalSeats: res.data.totalSeats || "",
            status: res.data.status || "Scheduled",
          }));
        })
        .catch((err) => {
          console.log(err);
        });
    }
    getData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-600 via-blue-700 to-indigo-800 flex items-center justify-center p-6">
      {/* Decorative blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 mb-4 shadow-lg">
            <PencilLine size={30} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight" style={{ fontFamily: "Poppins, sans-serif" }}>
            Update Flight
          </h1>
          <p className="text-sky-200 mt-2 text-sm">
            Editing flight &nbsp;
            <span className="font-semibold text-white">
              #{location.state.id.selectedRow}
            </span>
          </p>
        </div>

        {/* Card */}
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8">
          <form onSubmit={updateFlight} noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Flight Name – full width */}
              <div className="md:col-span-2">
                <InputField
                  label="Flight Name / Number"
                  icon={Plane}
                  type="text"
                  name="flightName"
                  placeholder={existing.flightName || "Flight name"}
                  value={addflight.flightName}
                  onChange={handleChange}
                />
              </div>

              {/* Origin */}
              <InputField
                label="Origin"
                icon={MapPin}
                type="text"
                name="origin"
                placeholder={existing.origin || "Departure city"}
                value={addflight.origin}
                onChange={handleChange}
              />

              {/* Destination */}
              <InputField
                label="Destination"
                icon={MapPin}
                type="text"
                name="destination"
                placeholder={existing.destination || "Arrival city"}
                value={addflight.destination}
                onChange={handleChange}
              />

              {/* Departure Date & Time */}
              <InputField
                label="Departure Date & Time"
                icon={Calendar}
                type="datetime-local"
                name="takeOffTime"
                value={addflight.takeOffTime}
                onChange={handleChange}
                hint={existing.takeOffTime ? `Current: ${existing.takeOffTime}` : undefined}
              />

              {/* Arrival Time */}
              <InputField
                label="Arrival Date & Time"
                icon={Clock}
                type="datetime-local"
                name="arrivalTime"
                value={addflight.arrivalTime}
                onChange={handleChange}
                hint={existing.arrivalTime ? `Current: ${existing.arrivalTime}` : undefined}
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
                placeholder={existing.totalSeats || "e.g. 180"}
                min="1"
                value={addflight.totalSeats}
                onChange={handleChange}
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
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600
                  hover:from-emerald-400 hover:to-teal-500 disabled:opacity-60 disabled:cursor-not-allowed
                  text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-emerald-900/30
                  transition-all duration-300 hover:-translate-y-0.5 hover:shadow-emerald-700/40
                  active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <PencilLine size={18} />
                    Update Flight
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

        <p className="text-center text-sky-300/70 text-xs mt-6">
          Changes will be sent for admin approval after submission.
        </p>
      </div>
    </div>
  );
}
