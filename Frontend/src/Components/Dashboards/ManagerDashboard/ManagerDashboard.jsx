import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiCalls from "../../../Service/apiCalls";
import { toast } from "react-toastify";
import {
  LayoutDashboard,
  Plane,
  CheckCircle,
  XCircle,
  BarChart3,
  LogOut,
  Clock,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  TrendingUp,
  Menu,
  X,
} from "lucide-react";

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const [flights, setFlights] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeNav, setActiveNav] = useState("dashboard");
  const [loading, setLoading] = useState(true);

  /* ── Preserved logic ── */
  const handleRadioChange = (rowId) => setSelectedRow(rowId);

  const deleteFlight = (id) => {
    if (!id) {
      toast.warn("Please select a flight first.", { position: "top-center" });
      return;
    }
    setFlights((prev) => prev.filter((f) => f.flightId !== id));
    setSelectedRow(null);
    toast.error("Flight Rejected", { position: "top-center" });
    apiCalls
      .deleteFlightById(id)
      .then(() => {
        console.log("FLIGHT REMOVED");
        navigate(`/${window.btoa("managerDashboard")}`);
      })
      .catch((err) => console.log(err));
  };

  const approveFlight = (id) => {
    if (!id) {
      toast.warn("Please select a flight first.", { position: "top-center" });
      return;
    }
    setFlights((prev) => prev.filter((f) => f.flightId !== id));
    setSelectedRow(null);
    toast.success("Flight Approved", { position: "top-center" });
    navigate(`/${window.btoa("managerDashboard")}`);
  };

  useEffect(() => {
    apiCalls
      .getAllFlights()
      .then((res) => {
        setFlights(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  /* ── Derived stats ── */
  const totalFlights = flights.length;
  const pendingApprovals = flights.length;
  const approvedFlights = 0; // reflects approved in session
  const rejectedFlights = 0;

  /* ── Nav items ── */
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: `/${window.btoa("managerDashboard")}` },
    { id: "flights", label: "Review Flights", icon: Plane, path: `/${window.btoa("flights")}` },
    { id: "approve", label: "Approve / Reject", icon: ShieldCheck, path: `/${window.btoa("managerDashboard")}` },
    { id: "reports", label: "Reports", icon: BarChart3, path: `/${window.btoa("managerDashboard")}` },
  ];

  const statCards = [
    {
      label: "Pending Approvals",
      value: pendingApprovals,
      icon: Clock,
      gradient: "from-amber-500 to-orange-600",
      glow: "shadow-amber-500/30",
    },
    {
      label: "Approved Flights",
      value: approvedFlights,
      icon: CheckCircle,
      gradient: "from-emerald-500 to-green-600",
      glow: "shadow-emerald-500/30",
    },
    {
      label: "Rejected Flights",
      value: rejectedFlights,
      icon: XCircle,
      gradient: "from-rose-500 to-red-600",
      glow: "shadow-rose-500/30",
    },
    {
      label: "Total Flights",
      value: totalFlights,
      icon: TrendingUp,
      gradient: "from-sky-500 to-blue-600",
      glow: "shadow-sky-500/30",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-sky-600 via-blue-700 to-indigo-800 font-sans">

      {/* ═══════════ SIDEBAR ═══════════ */}
      <aside
        className={`
          ${sidebarOpen ? "w-64" : "w-20"}
          flex flex-col min-h-screen
          bg-white/10 backdrop-blur-md border-r border-white/20
          transition-all duration-300 ease-in-out
          z-30 shrink-0
        `}
      >
        {/* Branding */}
        <div className="flex items-center gap-3 px-5 py-6 border-b border-white/20">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/20 shrink-0">
            <Plane className="w-5 h-5 text-white" />
          </div>
          {sidebarOpen && (
            <div>
              <p className="text-white font-bold text-sm leading-tight">Persistent</p>
              <p className="text-sky-200 text-xs">Airways</p>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto text-white/70 hover:text-white transition-colors"
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {/* Role Badge */}
        {sidebarOpen && (
          <div className="mx-4 mt-4 px-3 py-2 rounded-xl bg-white/15 border border-white/20">
            <p className="text-sky-200 text-xs font-medium uppercase tracking-widest">Role</p>
            <p className="text-white font-semibold text-sm">Manager</p>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ id, label, icon: Icon, path }) => (
            <Link
              key={id}
              to={path}
              onClick={() => setActiveNav(id)}
              className={`
                flex items-center gap-3 px-3 py-3 rounded-xl
                transition-all duration-200 group
                ${activeNav === id
                  ? "bg-white/25 text-white shadow-md"
                  : "text-white/70 hover:bg-white/15 hover:text-white"
                }
              `}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {sidebarOpen && (
                <>
                  <span className="text-sm font-medium flex-1">{label}</span>
                  {activeNav === id && <ChevronRight className="w-4 h-4 opacity-60" />}
                </>
              )}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-white/20">
          <button
            onClick={() => {
              localStorage.clear();
              navigate(`/${window.btoa("login")}`);
            }}
            className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-white/70 hover:bg-white/15 hover:text-white transition-all duration-200"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* ═══════════ MAIN CONTENT ═══════════ */}
      <main className="flex-1 overflow-y-auto">

        {/* Top Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-8 py-4 bg-white/5 backdrop-blur-md border-b border-white/10">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Manager Dashboard</h1>
            <p className="text-sky-200 text-sm">Welcome back — manage your flight approvals below</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-white text-sm font-semibold">Manager</p>
              <p className="text-sky-200 text-xs">Persistent Airways</p>
            </div>
          </div>
        </div>

        <div className="px-8 py-8 space-y-8">

          {/* ── Stat Cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {statCards.map(({ label, value, icon: Icon, gradient, glow }) => (
              <div
                key={label}
                className={`
                  relative overflow-hidden rounded-2xl p-5
                  bg-gradient-to-br ${gradient}
                  shadow-xl ${glow}
                  hover:-translate-y-1 transition-all duration-300 cursor-default
                `}
              >
                <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/10" />
                <div className="absolute -bottom-6 -right-2 w-28 h-28 rounded-full bg-white/5" />
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-xs font-medium uppercase tracking-wider mb-1">{label}</p>
                    <p className="text-white text-3xl font-extrabold">{value}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Review Flights Section ── */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden shadow-xl">

            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 border-b border-white/15">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <Plane className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-lg">Review Flights</h2>
                  <p className="text-sky-200 text-xs">Select a flight and approve or reject</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <Link to={`/${window.btoa("flights")}`}>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white text-sm font-medium transition-all duration-200">
                    <Plane className="w-4 h-4" />
                    All Flights
                  </button>
                </Link>
                <button
                  onClick={() => approveFlight(selectedRow)}
                  disabled={!selectedRow}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
                    transition-all duration-200
                    ${selectedRow
                      ? "bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/30 hover:-translate-y-0.5"
                      : "bg-white/10 text-white/40 cursor-not-allowed border border-white/10"
                    }
                  `}
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </button>
                <button
                  onClick={() => deleteFlight(selectedRow)}
                  disabled={!selectedRow}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
                    transition-all duration-200
                    ${selectedRow
                      ? "bg-rose-500 hover:bg-rose-400 text-white shadow-lg shadow-rose-500/30 hover:-translate-y-0.5"
                      : "bg-white/10 text-white/40 cursor-not-allowed border border-white/10"
                    }
                  `}
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex items-center justify-center py-16 gap-3">
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <p className="text-white/70 text-sm">Loading flights…</p>
                </div>
              ) : flights.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <AlertCircle className="w-10 h-10 text-white/30" />
                  <p className="text-white/50 text-sm">No flights pending review</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-sky-200 uppercase tracking-wider w-16">
                        Select
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-sky-200 uppercase tracking-wider">
                        Flight Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-sky-200 uppercase tracking-wider">
                        Take-off Time
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-sky-200 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-sky-200 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {flights.map((flight, idx) => {
                      const isSelected = selectedRow === flight.flightId;
                      return (
                        <tr
                          key={flight.flightId}
                          onClick={() => handleRadioChange(flight.flightId)}
                          className={`
                            cursor-pointer transition-all duration-150
                            ${isSelected
                              ? "bg-white/20"
                              : idx % 2 === 0 ? "bg-white/5 hover:bg-white/10" : "bg-transparent hover:bg-white/10"
                            }
                          `}
                        >
                          {/* Radio */}
                          <td className="px-6 py-4">
                            <div
                              className={`
                                w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                                ${isSelected ? "border-sky-300 bg-sky-400/30" : "border-white/40"}
                              `}
                            >
                              {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-sky-300" />}
                            </div>
                          </td>

                          {/* Flight Name */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                                <Plane className="w-4 h-4 text-sky-300" />
                              </div>
                              <span className="text-white font-semibold text-sm">
                                {flight.flightName}
                              </span>
                            </div>
                          </td>

                          {/* Take-off Time */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-sky-100 text-sm">
                              <Clock className="w-4 h-4 text-sky-300/70" />
                              {flight.takeOffTime}
                            </div>
                          </td>

                          {/* Status Badge */}
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              <Clock className="w-3 h-3" />
                              Pending
                            </span>
                          </td>

                          {/* Inline Actions */}
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={(e) => { e.stopPropagation(); approveFlight(flight.flightId); }}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition-all duration-200 hover:-translate-y-0.5"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                Approve
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); deleteFlight(flight.flightId); }}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 text-xs font-semibold border border-rose-500/30 transition-all duration-200 hover:-translate-y-0.5"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Footer */}
            {flights.length > 0 && (
              <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
                <p className="text-white/50 text-xs">
                  {flights.length} flight{flights.length !== 1 ? "s" : ""} pending review
                </p>
                {selectedRow && (
                  <p className="text-sky-300 text-xs font-medium">
                    Flight #{selectedRow} selected
                  </p>
                )}
              </div>
            )}
          </div>

          {/* ── Quick Links ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Flight Details", icon: Plane, path: `/${window.btoa("flights")}`, desc: "View & manage all flights" },
              { label: "Reports", icon: BarChart3, path: `/${window.btoa("managerDashboard")}`, desc: "Analytics & summaries" },
              { label: "Seat Types", icon: ShieldCheck, path: `/${window.btoa("seatTypes")}`, desc: "Manage seat configurations" },
            ].map(({ label, icon: Icon, path, desc }) => (
              <Link key={label} to={path}>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 hover:border-white/30 transition-all duration-200 hover:-translate-y-1 group cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-white/15 group-hover:bg-white/25 flex items-center justify-center transition-colors">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{label}</p>
                    <p className="text-sky-200/70 text-xs">{desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white/70 ml-auto transition-colors" />
                </div>
              </Link>
            ))}
          </div>

        </div>{/* /px-8 */}
      </main>
    </div>
  );
}
