import React, { useState, useEffect } from "react";
import apiCalls from "../../Service/apiCalls";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  User,
  Mail,
  Phone,
  Hash,
  Edit3,
  Trash2,
  Calendar,
  Clock,
  Plane,
  Ticket,
  MapPin,
  ArrowRight,
  Star,
} from "lucide-react";

function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function SpecificProfile() {
  const selectedRow = JSON.parse(localStorage.getItem("profileId"));
  const [user, setUsers] = useState({});
  const [bookings, setBookings] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();
  const roleId = JSON.parse(localStorage.getItem("roleId"));

  const deleteuser = (id) => {
    toast.error("USER DELETED", { position: "top-center" });
    apiCalls
      .deleteUser(id)
      .then(() => {
        if (roleId == 1) navigate(`/${window.btoa("viewAllUsers")}`);
        else if (roleId == 3) navigate("/");
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    apiCalls
      .getUserByUserId(selectedRow)
      .then((res) => setUsers(res.data))
      .catch((err) => console.log(err));
  }, [selectedRow]);

  useEffect(() => {
    if (selectedRow) {
      apiCalls
        .getBookingsByUserId(selectedRow)
        .then((res) => setBookings(Array.isArray(res.data) ? res.data : []))
        .catch(() => setBookings([]));
    }
  }, [selectedRow]);

  useEffect(() => {
    console.log(user);
  }, [user]);

  const authority = user.authorities?.[0]?.authority || "ROLE_USER";
  const roleLabel =
    authority === "ROLE_ADMIN"
      ? "Admin"
      : authority === "ROLE_MANAGER"
      ? "Manager"
      : "Member";

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-600 via-blue-700 to-indigo-800">
      {/* Ambient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
      </div>

      <div className="relative">
        {/* ── Hero Banner ── */}
        <div className="relative h-64 bg-gradient-to-r from-sky-500/40 via-blue-600/30 to-indigo-700/40 backdrop-blur-sm overflow-hidden">
          {/* decorative lines */}
          <div className="absolute inset-0">
            <div className="absolute top-8 left-1/4 w-px h-full bg-white/5" />
            <div className="absolute top-8 left-2/4 w-px h-full bg-white/5" />
            <div className="absolute top-8 left-3/4 w-px h-full bg-white/5" />
          </div>
          {/* floating plane icon */}
          <Plane className="absolute right-16 top-12 w-32 h-32 text-white/5 -rotate-12" />
          <Plane className="absolute left-8 bottom-4 w-16 h-16 text-white/5 rotate-12" />

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-sky-200/60 text-xs tracking-[0.3em] uppercase font-semibold mb-2">
              User Profile
            </p>
            <h1 className="text-4xl font-bold text-white tracking-tight">
              My Profile
            </h1>
          </div>
        </div>

        {/* ── Avatar (overlaps hero) ── */}
        <div className="flex justify-center -mt-16 mb-4 relative z-10">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold shadow-2xl border-4 border-white/20 ring-4 ring-blue-700/50">
              {getInitials(user.username)}
            </div>
            <div className="absolute -bottom-1 -right-1 w-9 h-9 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-blue-700 shadow-lg">
              <Star className="w-4 h-4 text-white fill-white" />
            </div>
          </div>
        </div>

        {/* Username + Role below avatar */}
        <div className="text-center mb-8 px-6">
          <h2 className="text-2xl font-bold text-white">
            {user.username || "Loading…"}
          </h2>
          <span className="inline-block mt-2 px-3 py-1 bg-sky-500/20 border border-sky-400/30 text-sky-200 text-xs font-semibold rounded-full uppercase tracking-wider">
            {roleLabel}
          </span>
        </div>

        <div className="max-w-4xl mx-auto px-6 pb-12 space-y-6">
          {/* ── Stats Row ── */}
          <div className="grid grid-cols-3 gap-4">
            {[
              {
                icon: Ticket,
                label: "Total Bookings",
                value: bookings.length || 0,
                color: "from-sky-400 to-blue-500",
              },
              {
                icon: Calendar,
                label: "Member Since",
                value: "2024",
                color: "from-violet-400 to-purple-600",
              },
              {
                icon: Clock,
                label: "Flight Hours",
                value: `${(bookings.length * 3.5).toFixed(0)}h`,
                color: "from-emerald-400 to-teal-600",
              },
            ].map(({ icon: Icon, label, value, color }) => (
              <div
                key={label}
                className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-5 text-center hover:bg-white/15 transition-all duration-300 hover:-translate-y-0.5"
              >
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mx-auto mb-3 shadow-md`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-sky-200/70 text-xs mt-0.5 font-medium">{label}</p>
              </div>
            ))}
          </div>

          {/* ── Profile Details Card ── */}
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/15 flex items-center justify-between">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <User className="w-4 h-4 text-sky-300" /> Personal Information
              </h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { icon: Hash, label: "User ID", value: user.userId },
                { icon: User, label: "Username", value: user.username },
                { icon: Mail, label: "Email", value: user.userEmail },
                { icon: Phone, label: "Phone", value: user.userPhno },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200"
                >
                  <div className="w-10 h-10 rounded-lg bg-sky-500/20 border border-sky-400/20 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-sky-300" />
                  </div>
                  <div>
                    <p className="text-sky-200/60 text-xs font-medium uppercase tracking-wider">
                      {label}
                    </p>
                    <p className="text-white font-semibold text-sm mt-0.5">
                      {value || "—"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Recent Bookings ── */}
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/15 flex items-center justify-between">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Plane className="w-4 h-4 text-sky-300" /> Recent Bookings
              </h3>
              {bookings.length > 0 && (
                <span className="text-xs text-sky-200/60 font-medium">
                  {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            {bookings.length === 0 ? (
              <div className="py-14 flex flex-col items-center gap-3 text-sky-300/50">
                <Plane className="w-10 h-10" />
                <p className="text-sm font-medium">No bookings yet</p>
                <p className="text-xs">Flights booked will appear here</p>
              </div>
            ) : (
              <div className="divide-y divide-white/10">
                {bookings.slice(0, 5).map((booking, idx) => (
                  <div
                    key={booking.bookingId || idx}
                    className="px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-all duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500/30 to-blue-600/30 border border-sky-400/20 flex items-center justify-center">
                        <Ticket className="w-5 h-5 text-sky-300" />
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">
                          Booking #{booking.bookingId || idx + 1}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5 text-sky-200/60 text-xs">
                          <MapPin className="w-3 h-3" />
                          <span>
                            {booking.source || "—"}{" "}
                            <ArrowRight className="inline w-3 h-3" />{" "}
                            {booking.destination || "—"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sky-200/70 text-xs">
                        {formatDate(booking.bookingDate || booking.travelDate)}
                      </p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs rounded-full">
                        Confirmed
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Action Buttons ── */}
          <div className="flex gap-3">
            <Link
              to={`/${window.btoa("updateUser")}`}
              state={{ userid: { selectedRow } }}
              className="flex-1"
            >
              <button className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </button>
            </Link>

            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/30 text-rose-300 hover:text-white font-semibold rounded-xl transition-all duration-300 hover:-translate-y-0.5"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 backdrop-blur-md bg-rose-500/20 border border-rose-400/40 rounded-xl">
                <p className="text-rose-200 text-sm font-medium whitespace-nowrap">
                  Are you sure?
                </p>
                <button
                  onClick={() => deleteuser(user.userId)}
                  className="px-3 py-1.5 bg-rose-500 hover:bg-rose-400 text-white text-sm font-semibold rounded-lg transition-all duration-200"
                >
                  Yes
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-lg transition-all duration-200"
                >
                  No
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
