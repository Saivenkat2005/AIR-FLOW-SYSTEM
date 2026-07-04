import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Plane,
  Users,
  Ticket,
  MapPin,
  Settings,
  Bell,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Plus,
  Calendar,
  DollarSign,
  Activity,
  LogOut,
  Menu,
  X,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  ArrowRight,
} from "lucide-react";

// ─── Navigation Config ────────────────────────────────────────────────────────
const NAV_LINKS = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: `/${window.btoa("adminDashboard")}`,
    active: true,
  },
  {
    label: "Flights",
    icon: Plane,
    path: `/${window.btoa("flights")}`,
  },
  {
    label: "Reservations",
    icon: Ticket,
    path: `/${window.btoa("viewBooking")}`,
  },
  {
    label: "Users",
    icon: Users,
    path: `/${window.btoa("viewAllUsers")}`,
  },
  {
    label: "Seat Types",
    icon: MapPin,
    path: `/${window.btoa("seatTypes")}`,
  },
  {
    label: "Add Flight",
    icon: Plus,
    path: `/${window.btoa("addFlight")}`,
  },
];

// ─── Stat Cards Data ──────────────────────────────────────────────────────────
const STAT_CARDS = [
  {
    label: "Total Flights",
    value: "1,284",
    change: "+12%",
    up: true,
    icon: Plane,
    gradient: "from-sky-500 to-blue-600",
    bg: "bg-sky-50 dark:bg-sky-900/20",
    iconBg: "bg-gradient-to-br from-sky-500 to-blue-600",
  },
  {
    label: "Total Bookings",
    value: "38,492",
    change: "+8.3%",
    up: true,
    icon: Ticket,
    gradient: "from-violet-500 to-purple-600",
    bg: "bg-violet-50 dark:bg-violet-900/20",
    iconBg: "bg-gradient-to-br from-violet-500 to-purple-600",
  },
  {
    label: "Total Passengers",
    value: "94,210",
    change: "+5.1%",
    up: true,
    icon: Users,
    gradient: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    iconBg: "bg-gradient-to-br from-emerald-500 to-teal-600",
  },
  {
    label: "Revenue",
    value: "$4.2M",
    change: "-2.4%",
    up: false,
    icon: DollarSign,
    gradient: "from-amber-500 to-orange-500",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    iconBg: "bg-gradient-to-br from-amber-500 to-orange-500",
  },
];

// ─── Recent Activity ──────────────────────────────────────────────────────────
const ACTIVITIES = [
  {
    icon: CheckCircle,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    text: "Flight PA-204 departed on schedule from JFK → LAX",
    time: "2 mins ago",
  },
  {
    icon: AlertCircle,
    color: "text-amber-500",
    bg: "bg-amber-50",
    text: "Reservation #BK-8821 flagged for payment review",
    time: "15 mins ago",
  },
  {
    icon: Users,
    color: "text-sky-500",
    bg: "bg-sky-50",
    text: "New user account created: sarah.johnson@email.com",
    time: "32 mins ago",
  },
  {
    icon: XCircle,
    color: "text-red-500",
    bg: "bg-red-50",
    text: "Flight PA-119 cancelled due to weather conditions",
    time: "1 hr ago",
  },
  {
    icon: Plane,
    color: "text-blue-500",
    bg: "bg-blue-50",
    text: "New flight PA-310 added: ORD → MIA, departs 08:30",
    time: "2 hrs ago",
  },
  {
    icon: CheckCircle,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    text: "Booking #BK-9042 confirmed — Business Class, 2 seats",
    time: "3 hrs ago",
  },
];

// ─── Upcoming Flights ─────────────────────────────────────────────────────────
const UPCOMING_FLIGHTS = [
  { id: "PA-201", route: "JFK → LAX", time: "06:00 AM", status: "active" },
  { id: "PA-305", route: "ORD → MIA", time: "08:30 AM", status: "active" },
  { id: "PA-119", route: "ATL → SEA", time: "10:15 AM", status: "delayed" },
  { id: "PA-422", route: "DFW → BOS", time: "12:00 PM", status: "active" },
  { id: "PA-558", route: "SFO → DEN", time: "02:45 PM", status: "cancelled" },
  { id: "PA-677", route: "LAS → PHX", time: "04:30 PM", status: "active" },
];

// ─── Status Chip ──────────────────────────────────────────────────────────────
const StatusChip = ({ status }) => {
  const config = {
    active: {
      dot: "bg-emerald-500",
      text: "text-emerald-700",
      bg: "bg-emerald-100",
      label: "Active",
    },
    delayed: {
      dot: "bg-amber-500",
      text: "text-amber-700",
      bg: "bg-amber-100",
      label: "Delayed",
    },
    cancelled: {
      dot: "bg-red-500",
      text: "text-red-700",
      bg: "bg-red-100",
      label: "Cancelled",
    },
  };
  const c = config[status] || config.active;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications] = useState(5);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 to-blue-50 font-sans">
      {/* ── Mobile Overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SIDEBAR
      ══════════════════════════════════════════════════════════════════════ */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-30 w-64
          bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900
          border-r border-slate-700/50
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:flex
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-700/50">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Plane className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-base leading-tight tracking-wide">
              Persistent
            </p>
            <p className="text-sky-400 text-xs font-medium tracking-widest uppercase">
              Airways
            </p>
          </div>
          {/* Mobile close */}
          <button
            className="ml-auto lg:hidden text-slate-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav Label */}
        <p className="px-6 pt-6 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-widest">
          Main Menu
        </p>

        {/* Nav Links */}
        <nav className="flex-1 px-3 space-y-1">
          {NAV_LINKS.map(({ label, icon: Icon, path, active }) => (
            <Link
              key={label}
              to={path}
              onClick={() => setSidebarOpen(false)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                transition-all duration-200 group
                ${
                  active
                    ? "bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-lg shadow-blue-700/30"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }
              `}
            >
              <Icon
                className={`w-4.5 h-4.5 flex-shrink-0 ${active ? "text-white" : "text-slate-400 group-hover:text-sky-400"} transition-colors`}
                size={18}
              />
              <span>{label}</span>
              {active && <ChevronRight className="w-4 h-4 ml-auto opacity-70" />}
            </Link>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-slate-700/50">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/5 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">Admin</p>
              <p className="text-slate-400 text-xs truncate">admin@airways.com</p>
            </div>
          </div>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 text-sm font-medium">
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ══════════════════════════════════════════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">

        {/* ── Top Bar ── */}
        <header className="sticky top-0 z-10 bg-white/70 backdrop-blur-md border-b border-white/50 px-6 py-4 flex items-center gap-4 shadow-sm">
          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Greeting */}
          <div className="flex-1">
            <h1 className="text-xl font-bold text-slate-800 leading-tight">
              Welcome back, <span className="text-sky-600">Admin</span> 👋
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <button className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all duration-200 hover:-translate-y-0.5">
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
              )}
            </button>

            {/* Settings */}
            <button className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all duration-200 hover:-translate-y-0.5">
              <Settings className="w-5 h-5" />
            </button>

            {/* Avatar */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-blue-500/30 cursor-pointer hover:-translate-y-0.5 transition-transform duration-200">
              AD
            </div>
          </div>
        </header>

        {/* ── Scrollable Body ── */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* ── Stat Cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {STAT_CARDS.map(({ label, value, change, up, icon: Icon, iconBg }) => (
              <div
                key={label}
                className="bg-white/70 backdrop-blur-md border border-white/50 rounded-2xl shadow-sm p-5 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group cursor-default"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${
                      up
                        ? "text-emerald-700 bg-emerald-100"
                        : "text-red-600 bg-red-100"
                    }`}
                  >
                    {up ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-slate-800 leading-none mb-1">
                  {value}
                </p>
                <p className="text-sm text-slate-500 font-medium">{label}</p>
              </div>
            ))}
          </div>

          {/* ── Quick Actions ── */}
          <div>
            <h2 className="text-base font-bold text-slate-700 mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-sky-500" />
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {/* Manage Flights */}
              <button
                onClick={() => navigate(`/${window.btoa("flights")}`)}
                className="group relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 text-left"
              >
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full group-hover:scale-125 transition-transform duration-500" />
                <div className="absolute -bottom-6 -left-2 w-16 h-16 bg-white/10 rounded-full" />
                <Plane className="w-8 h-8 mb-4 opacity-90" />
                <p className="text-lg font-bold mb-1">Manage Flights</p>
                <p className="text-sm text-blue-100">View, edit & schedule flights</p>
                <ArrowRight className="w-5 h-5 mt-4 group-hover:translate-x-1 transition-transform duration-200" />
              </button>

              {/* Manage Reservations */}
              <button
                onClick={() => navigate(`/${window.btoa("viewBooking")}`)}
                className="group relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-purple-500/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 text-left"
              >
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full group-hover:scale-125 transition-transform duration-500" />
                <div className="absolute -bottom-6 -left-2 w-16 h-16 bg-white/10 rounded-full" />
                <Ticket className="w-8 h-8 mb-4 opacity-90" />
                <p className="text-lg font-bold mb-1">Manage Reservations</p>
                <p className="text-sm text-purple-100">Review & process bookings</p>
                <ArrowRight className="w-5 h-5 mt-4 group-hover:translate-x-1 transition-transform duration-200" />
              </button>

              {/* Manage Users */}
              <button
                onClick={() => navigate(`/${window.btoa("viewAllUsers")}`)}
                className="group relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-300 text-left"
              >
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full group-hover:scale-125 transition-transform duration-500" />
                <div className="absolute -bottom-6 -left-2 w-16 h-16 bg-white/10 rounded-full" />
                <Users className="w-8 h-8 mb-4 opacity-90" />
                <p className="text-lg font-bold mb-1">Manage Users</p>
                <p className="text-sm text-emerald-100">View & manage user accounts</p>
                <ArrowRight className="w-5 h-5 mt-4 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          </div>

          {/* ── Lower Grid: Recent Activity + Upcoming Flights ── */}
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">

            {/* Recent Activity */}
            <div className="xl:col-span-2 bg-white/70 backdrop-blur-md border border-white/50 rounded-2xl shadow-sm p-6 flex flex-col">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-sky-500" />
                  Recent Activity
                </h2>
                <span className="text-xs text-sky-600 font-semibold cursor-pointer hover:underline">
                  View all
                </span>
              </div>
              <div className="space-y-3 flex-1">
                {ACTIVITIES.map(({ icon: Icon, color, bg, text, time }, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors duration-150 group"
                  >
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-lg ${bg} flex items-center justify-center mt-0.5`}
                    >
                      <Icon className={`w-4 h-4 ${color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-700 font-medium leading-snug line-clamp-2">
                        {text}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">{time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Flights */}
            <div className="xl:col-span-3 bg-white/70 backdrop-blur-md border border-white/50 rounded-2xl shadow-sm p-6 flex flex-col">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-sky-500" />
                  Upcoming Flights
                </h2>
                <button
                  onClick={() => navigate(`/${window.btoa("flights")}`)}
                  className="text-xs text-sky-600 font-semibold hover:underline flex items-center gap-1"
                >
                  View all <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="overflow-x-auto -mx-2">
                <table className="w-full text-sm min-w-[400px]">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider pb-3 px-2">
                        Flight
                      </th>
                      <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider pb-3 px-2">
                        Route
                      </th>
                      <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider pb-3 px-2">
                        Departure
                      </th>
                      <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider pb-3 px-2">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {UPCOMING_FLIGHTS.map(({ id, route, time, status }) => (
                      <tr
                        key={id}
                        className="hover:bg-slate-50/70 transition-colors duration-150 group"
                      >
                        <td className="py-3.5 px-2">
                          <span className="font-bold text-slate-800 text-sm">
                            {id}
                          </span>
                        </td>
                        <td className="py-3.5 px-2">
                          <span className="text-slate-600 font-medium text-sm">
                            {route}
                          </span>
                        </td>
                        <td className="py-3.5 px-2">
                          <span className="text-slate-500 text-sm font-medium">
                            {time}
                          </span>
                        </td>
                        <td className="py-3.5 px-2">
                          <StatusChip status={status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add Flight CTA */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                <button
                  onClick={() => navigate(`/${window.btoa("addFlight")}`)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-sky-300 text-sky-600 text-sm font-semibold hover:bg-sky-50 hover:border-sky-400 transition-all duration-200"
                >
                  <Plus className="w-4 h-4" />
                  Add New Flight
                </button>
              </div>
            </div>
          </div>

          {/* ── Footer ── */}
          <div className="text-center pb-4">
            <p className="text-xs text-slate-400">
              © {new Date().getFullYear()} Persistent Airways Admin Panel. All
              rights reserved.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
