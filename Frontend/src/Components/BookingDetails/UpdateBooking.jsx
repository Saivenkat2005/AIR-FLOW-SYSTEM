import React, { useState, useEffect } from "react";
import apiCalls from "../../Service/apiCalls";
import { toast } from "react-toastify";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  BookOpen,
  User,
  MapPin,
  Calendar,
  Users,
  Armchair,
  Loader2,
  ArrowLeft,
  Save,
  MessageSquare,
} from "lucide-react";

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

export default function UpdateBooking() {
  const roleId = JSON.parse(localStorage.getItem("roleId"));
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [flights, setflights] = useState({});

  const [updatedBooking, setupdatedBooking] = useState({
    bookingId: location.state.bookingid.selectedRow,
    customerName: "",
    seatType: "",
    origin: "",
    destination: "",
    date: "",
    nop: "",
  });

  const handleChange = (e) => {
    const value = e.target.value;
    setupdatedBooking({ ...updatedBooking, [e.target.name]: value });
  };

  const updatingBooking = (e) => {
    e.preventDefault();
    setLoading(true);
    toast.info(
      "Please Wait! Updating Reservation. Check your Email for Confirmation.",
      { position: "top-center" }
    );
    apiCalls
      .updateBooking(updatedBooking)
      .then((response) => {
        console.log(updatedBooking);
        toast.success("Booking successfully updated!", {
          position: "top-center",
          style: { background: "#0f172a", color: "#e0f2fe", border: "1px solid #0ea5e9" },
        });
        if (roleId == 3) {
          navigate(`/${window.btoa("viewBooking")}`);
        } else if (roleId == 1) {
          navigate(`/${window.btoa("viewBooking")}`);
        } else {
          navigate(`/${window.btoa("viewBooking")}`);
        }
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
        .getBookingbyBookingId(location.state.bookingid.selectedRow)
        .then((res) => {
          setflights(res.data);
          // Pre-fill form with existing booking data
          setupdatedBooking((prev) => ({
            ...prev,
            customerName: res.data.customerName || "",
            seatType: res.data.seatType || "",
            origin: res.data.origin || "",
            destination: res.data.destination || "",
            date: res.data.date || "",
            nop: res.data.nop || "",
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
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 mb-4 shadow-lg">
            <BookOpen size={30} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight" style={{ fontFamily: "Poppins, sans-serif" }}>
            Update Booking
          </h1>
          <p className="text-sky-200 mt-2 text-sm">
            Modifying reservation&nbsp;
            <span className="font-semibold text-white">
              #{location.state.bookingid.selectedRow}
            </span>
          </p>
        </div>

        {/* Card */}
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8">
          <form onSubmit={updatingBooking} noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Customer Name – full width */}
              <div className="md:col-span-2">
                <InputField
                  label="Customer Name"
                  icon={User}
                  type="text"
                  name="customerName"
                  placeholder={flights.customerName || "Passenger full name"}
                  value={updatedBooking.customerName}
                  onChange={handleChange}
                />
              </div>

              {/* Origin */}
              <InputField
                label="Origin"
                icon={MapPin}
                type="text"
                name="origin"
                placeholder={flights.origin || "Departure city"}
                value={updatedBooking.origin}
                onChange={handleChange}
              />

              {/* Destination */}
              <InputField
                label="Destination"
                icon={MapPin}
                type="text"
                name="destination"
                placeholder={flights.destination || "Arrival city"}
                value={updatedBooking.destination}
                onChange={handleChange}
              />

              {/* Seat Type */}
              <SelectField
                label="Seat Preference"
                icon={Armchair}
                name="seatType"
                value={updatedBooking.seatType}
                onChange={handleChange}
              >
                <option value=" ">Select Seat Type</option>
                <option value="First Class">First Class</option>
                <option value="Business Class">Business Class</option>
                <option value="Economy Class">Economy Class</option>
              </SelectField>

              {/* Number of Passengers */}
              <InputField
                label="Number of Passengers"
                icon={Users}
                type="number"
                name="nop"
                placeholder={flights.nop || "e.g. 2"}
                min="1"
                value={updatedBooking.nop}
                onChange={handleChange}
              />

              {/* Travel Date – full width */}
              <div className="md:col-span-2">
                <InputField
                  label="Travel Date"
                  icon={Calendar}
                  type="date"
                  name="date"
                  value={updatedBooking.date}
                  onChange={handleChange}
                  hint={flights.date ? `Current date: ${flights.date}` : undefined}
                />
              </div>

              {/* Special Requests – full width */}
              <div className="md:col-span-2 flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-sky-100 tracking-wide flex items-center gap-1.5">
                  <MessageSquare size={14} className="text-sky-300" />
                  Special Requests
                </label>
                <textarea
                  name="specialRequests"
                  rows={3}
                  placeholder="Wheelchair assistance, meal preference, etc."
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white
                    placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400/60
                    focus:border-sky-400/60 backdrop-blur-sm transition-all duration-300 hover:bg-white/15
                    resize-none [color-scheme:dark]"
                />
              </div>
            </div>

            {/* Info banner */}
            <div className="mt-6 flex items-start gap-3 bg-sky-500/10 border border-sky-400/20 rounded-2xl px-5 py-4">
              <BookOpen size={16} className="text-sky-300 mt-0.5 shrink-0" />
              <p className="text-sky-200 text-xs leading-relaxed">
                A confirmation email will be sent after the booking is successfully updated. Seat allocation may change based on availability.
              </p>
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
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Changes
                  </>
                )}
              </button>

              <Link
                to={`/${window.btoa("viewBooking")}`}
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
          All booking changes are subject to fare rules and seat availability.
        </p>
      </div>
    </div>
  );
}
