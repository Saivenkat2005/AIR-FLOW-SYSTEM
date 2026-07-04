import React, { useState, useEffect } from "react";
import apiCalls from "../../Service/apiCalls";
import { toast } from "react-toastify";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Ticket,
  PlusCircle,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Armchair,
  Star,
  Briefcase,
  Users,
  DollarSign,
  Info,
} from "lucide-react";

// ─── Seat class config ────────────────────────────────────────────────────────
const CLASS_CONFIG = {
  "First Class": {
    color: "from-amber-400 to-yellow-500",
    bg: "bg-amber-400",
    badge: "bg-amber-400/20 text-amber-300 border-amber-400/40",
    glow: "shadow-amber-400/30",
    icon: Star,
    label: "First Class",
  },
  "Business Class": {
    color: "from-violet-400 to-purple-500",
    bg: "bg-violet-400",
    badge: "bg-violet-400/20 text-violet-300 border-violet-400/40",
    glow: "shadow-violet-400/30",
    icon: Briefcase,
    label: "Business",
  },
  "Economy Class": {
    color: "from-sky-400 to-blue-500",
    bg: "bg-sky-400",
    badge: "bg-sky-400/20 text-sky-300 border-sky-400/40",
    glow: "shadow-sky-400/30",
    icon: Users,
    label: "Economy",
  },
};

const getClassConfig = (seatType) =>
  CLASS_CONFIG[seatType] ||
  CLASS_CONFIG["Economy Class"];

// ─── Aircraft Seat Layout Visual ─────────────────────────────────────────────
function SeatLayoutVisual({ seatTypes, selectedRow, onSelect }) {
  const cols = ["A", "B", "C", "", "D", "E", "F"];

  return (
    <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 mt-6">
      {/* Nose */}
      <div className="flex justify-center mb-4">
        <div className="w-16 h-8 bg-gradient-to-t from-white/10 to-transparent rounded-t-full border border-white/20 flex items-center justify-center">
          <span className="text-white/40 text-[10px] font-semibold tracking-widest">NOSE</span>
        </div>
      </div>

      {/* Column headers */}
      <div className="flex justify-center gap-1 mb-3">
        {cols.map((c, i) => (
          <div
            key={i}
            className={`w-8 text-center text-[11px] font-bold ${
              c === "" ? "opacity-0 w-6" : "text-white/40"
            }`}
          >
            {c}
          </div>
        ))}
      </div>

      {/* Rows per seat type */}
      {seatTypes.map((type) => {
        const cfg = getClassConfig(type.seatType);
        const total = type.availableSeats;
        const rowCount = Math.ceil(total / 6);
        const isSelected = selectedRow === type.seatId;

        return (
          <div key={type.seatId} className="mb-4">
            {/* Class label */}
            <div className="flex items-center gap-2 mb-2">
              <div className={`h-px flex-1 bg-gradient-to-r ${cfg.color} opacity-40`} />
              <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${cfg.badge}`}>
                {cfg.label}
              </span>
              <div className={`h-px flex-1 bg-gradient-to-l ${cfg.color} opacity-40`} />
            </div>

            {/* Seat grid rows */}
            {Array.from({ length: Math.min(rowCount, 4) }).map((_, rowIdx) => (
              <div key={rowIdx} className="flex justify-center gap-1 mb-1">
                {cols.map((col, colIdx) => {
                  if (col === "") {
                    return <div key={colIdx} className="w-6" />;
                  }
                  const seatNum = rowIdx * 6 + colIdx;
                  const exists = seatNum < total;
                  return (
                    <button
                      key={colIdx}
                      onClick={() => exists && onSelect && onSelect(type.seatId)}
                      disabled={!exists}
                      className={`w-8 h-6 rounded-t-lg rounded-b-sm text-[9px] font-bold transition-all duration-200 border
                        ${
                          !exists
                            ? "bg-white/5 border-white/10 cursor-not-allowed opacity-30"
                            : isSelected
                            ? `${cfg.bg} border-white/60 text-white shadow-lg ${cfg.glow} scale-110`
                            : `${cfg.bg} opacity-60 border-white/20 text-white/80 hover:opacity-90 hover:scale-105 cursor-pointer`
                        }`}
                    >
                      {exists ? col : ""}
                    </button>
                  );
                })}
              </div>
            ))}
            {rowCount > 4 && (
              <p className="text-center text-white/30 text-[10px] mt-1">
                +{rowCount - 4} more rows
              </p>
            )}
          </div>
        );
      })}

      {/* Tail */}
      <div className="flex justify-center mt-4">
        <div className="w-24 h-4 bg-gradient-to-b from-white/10 to-transparent rounded-b-full border border-white/10" />
      </div>
    </div>
  );
}

// ─── Seat Type Card ───────────────────────────────────────────────────────────
function SeatCard({ type, isSelected, onSelect }) {
  const cfg = getClassConfig(type.seatType);
  const Icon = cfg.icon;

  return (
    <button
      onClick={() => onSelect(type.seatId)}
      className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 group
        ${
          isSelected
            ? `bg-gradient-to-br ${cfg.color} bg-opacity-20 border-white/40 shadow-lg ${cfg.glow}`
            : "backdrop-blur-md bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 hover:-translate-y-0.5"
        }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {/* Radio indicator */}
          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200
              ${isSelected ? "border-white bg-white/30" : "border-white/30 bg-transparent"}`}
          >
            {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
          </div>
          {/* Icon */}
          <div className={`p-2 rounded-xl bg-gradient-to-br ${cfg.color} shadow-lg ${cfg.glow}`}>
            <Icon size={16} className="text-white" />
          </div>
          {/* Name */}
          <div>
            <p className="text-white font-semibold text-sm">{type.seatType}</p>
            <p className="text-white/50 text-xs">Seat ID: #{type.seatId}</p>
          </div>
        </div>
        {isSelected && (
          <CheckCircle size={18} className="text-white/80 flex-shrink-0" />
        )}
      </div>

      <div className="flex items-center gap-4 mt-4 pl-8">
        <div className="flex items-center gap-1.5">
          <Armchair size={14} className="text-white/50" />
          <span className="text-white/70 text-xs">{type.availableSeats} seats</span>
        </div>
        <div className="flex items-center gap-1.5">
          <DollarSign size={14} className="text-white/50" />
          <span className="text-white font-bold text-sm">
            ₹{Number(type.price).toLocaleString("en-IN")}
          </span>
        </div>
      </div>
    </button>
  );
}

// ─── Legend ───────────────────────────────────────────────────────────────────
function SeatLegend() {
  const items = [
    { color: "bg-sky-400", label: "Available (Economy)" },
    { color: "bg-violet-400", label: "Available (Business)" },
    { color: "bg-amber-400", label: "Available (First Class)" },
    { color: "bg-white/10 border border-white/20", label: "Unavailable" },
  ];
  return (
    <div className="flex flex-wrap items-center gap-4 justify-center mt-6">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <div className={`w-5 h-4 rounded-t-lg rounded-b-sm ${item.color}`} />
          <span className="text-white/50 text-xs">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────
function StatsBar({ seatTypes }) {
  const total = seatTypes.reduce((a, b) => a + Number(b.availableSeats), 0);
  const minPrice = seatTypes.length ? Math.min(...seatTypes.map((s) => Number(s.price))) : 0;
  const maxPrice = seatTypes.length ? Math.max(...seatTypes.map((s) => Number(s.price))) : 0;

  return (
    <div className="grid grid-cols-3 gap-3 mt-6">
      {[
        { label: "Total Seats", value: total, icon: Armchair },
        { label: "Min Price", value: `₹${minPrice.toLocaleString("en-IN")}`, icon: DollarSign },
        { label: "Classes", value: seatTypes.length, icon: Info },
      ].map(({ label, value, icon: Icon }) => (
        <div
          key={label}
          className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-3 text-center"
        >
          <Icon size={16} className="text-white/40 mx-auto mb-1" />
          <p className="text-white font-bold text-lg leading-none">{value}</p>
          <p className="text-white/40 text-[11px] mt-1">{label}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SeatTypes() {
  const roleId = JSON.parse(localStorage.getItem("roleId"));
  const navigate = useNavigate();
  const location = useLocation();
  const flightid = location.state.id.selectedRow;

  const [seatTypes, setSeatTypes] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const handleRadioChange = (rowId) => setSelectedRow(rowId);

  // ── API: fetch seats ──────────────────────────────────────────────────────
  useEffect(() => {
    async function getData() {
      apiCalls
        .getSeatByFlightId(flightid)
        .then((res) => {
          setSeatTypes(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
    getData();
  }, []);

  // ── API: delete (admin/roleId==1) ─────────────────────────────────────────
  const deleteseatType = (id) => {
    setSeatTypes((prev) => prev.filter((i) => i.seatId !== id));
    setDeleteConfirm(false);
    toast.error(`SEAT REMOVED`, { position: "top-center" });
    apiCalls
      .deleteSeatType(id)
      .then(() => {
        console.log("SEAT REMOVED");
        navigate(`/${window.btoa("flights")}`);
      })
      .catch((err) => console.log(err));
  };

  // ── API: delete (roleId==2 disapprove) ────────────────────────────────────
  const deleteseat = (id) => {
    setSeatTypes((prev) => prev.filter((i) => i.seatId !== id));
    toast.error(`SEAT REMOVED`, { position: "top-center" });
    apiCalls
      .deleteSeatType(id)
      .then(() => {
        console.log("SEAT REMOVED");
        navigate(`/${window.btoa("managerDashboard")}`);
      })
      .catch((err) => console.log(err));
  };

  // ── API: approve (roleId==2) ──────────────────────────────────────────────
  const success = (id) => {
    setSeatTypes((prev) => prev.filter((i) => i.seatId !== id));
    toast.success(`SEAT TYPE SAVED SUCCESSFULLY`, { position: "top-center" });
    navigate("/managerDashboard");
  };

  const selectedSeat = seatTypes.find((s) => s.seatId === selectedRow);

  // ─── Loading state ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-600 via-blue-700 to-indigo-800 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4" />
          <p className="text-white/70 font-medium">Loading seat configuration…</p>
        </div>
      </div>
    );
  }

  // ─── Shared page wrapper ─────────────────────────────────────────────────
  const PageWrapper = ({ children }) => (
    <div className="min-h-screen bg-gradient-to-br from-sky-600 via-blue-700 to-indigo-800">
      {/* Ambient blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );

  // ─── Page header ─────────────────────────────────────────────────────────
  const Header = ({ title, subtitle, backTo, backLabel }) => (
    <div className="mb-8">
      <Link to={`/${window.btoa(backTo)}`}>
        <button className="flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-200 group mb-6">
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform duration-200"
          />
          <span className="text-sm font-medium">{backLabel}</span>
        </button>
      </Link>

      {/* Glass header card */}
      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/10 rounded-2xl border border-white/20">
            <Armchair size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{title}</h1>
            <p className="text-white/50 text-sm mt-0.5">{subtitle}</p>
          </div>
        </div>
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════════════════════════
  // ROLE 1 — Admin view
  // ══════════════════════════════════════════════════════════════════════════
  if (roleId == 1) {
    return (
      <PageWrapper>
        <Header
          title="Seat Management"
          subtitle={`Managing seats for Flight #${flightid}`}
          backTo="flights"
          backLabel="Back to Flights"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: seat cards */}
          <div className="lg:col-span-2 space-y-3">
            {/* Action bar */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {/* Book Tickets */}
              <Link
                to={`/${window.btoa("AddBooking")}`}
                state={{ seatid: { selectedRow } }}
              >
                <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 transition-all duration-300 hover:-translate-y-0.5 text-sm">
                  <Ticket size={16} />
                  Book Tickets
                </button>
              </Link>

              {/* Add Seat */}
              <Link
                to={`/${window.btoa("addSeatTypes")}`}
                state={{ flightid: { flightid } }}
              >
                <button className="flex items-center gap-2 px-4 py-2.5 backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/20 text-white font-semibold rounded-xl transition-all duration-300 hover:-translate-y-0.5 text-sm">
                  <PlusCircle size={16} />
                  Add Seat Type
                </button>
              </Link>

              {/* Update */}
              <Link
                to={`/${window.btoa("updateSeatTypes")}`}
                state={{ seatTypesObj: { selectedRow } }}
              >
                <button
                  disabled={selectedRow === null}
                  className="flex items-center gap-2 px-4 py-2.5 backdrop-blur-md bg-emerald-500/20 border border-emerald-400/30 hover:bg-emerald-500/30 text-emerald-300 font-semibold rounded-xl transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 text-sm"
                >
                  <Edit2 size={16} />
                  Update
                </button>
              </Link>

              {/* Delete */}
              {!deleteConfirm ? (
                <button
                  disabled={selectedRow === null}
                  onClick={() => setDeleteConfirm(true)}
                  className="flex items-center gap-2 px-4 py-2.5 backdrop-blur-md bg-red-500/20 border border-red-400/30 hover:bg-red-500/30 text-red-300 font-semibold rounded-xl transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 text-sm"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              ) : (
                <div className="flex items-center gap-2 px-4 py-2.5 backdrop-blur-md bg-red-500/10 border border-red-400/30 rounded-xl">
                  <span className="text-red-300 text-sm font-medium">Confirm?</span>
                  <button
                    onClick={() => deleteseatType(selectedRow)}
                    className="px-3 py-1 bg-red-500 hover:bg-red-400 text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(false)}
                    className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    No
                  </button>
                </div>
              )}
            </div>

            {seatTypes.length === 0 ? (
              <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                <Armchair size={40} className="text-white/20 mx-auto mb-3" />
                <p className="text-white/40 font-medium">No seat types configured</p>
                <p className="text-white/25 text-sm mt-1">Add seat types to get started</p>
              </div>
            ) : (
              seatTypes.map((type) => (
                <SeatCard
                  key={type.seatId}
                  type={type}
                  isSelected={selectedRow === type.seatId}
                  onSelect={handleRadioChange}
                />
              ))
            )}

            <StatsBar seatTypes={seatTypes} />
          </div>

          {/* Right: Aircraft visual */}
          <div className="lg:col-span-1">
            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-5 sticky top-8">
              <h3 className="text-white font-semibold text-sm mb-1 flex items-center gap-2">
                <Armchair size={16} className="text-white/60" />
                Aircraft Layout
              </h3>
              {selectedSeat && (
                <div
                  className={`mt-2 px-3 py-2 rounded-xl border ${
                    getClassConfig(selectedSeat.seatType).badge
                  } text-xs font-semibold flex items-center gap-1.5`}
                >
                  <CheckCircle size={12} />
                  Selected: {selectedSeat.seatType}
                </div>
              )}
              <SeatLayoutVisual
                seatTypes={seatTypes}
                selectedRow={selectedRow}
                onSelect={handleRadioChange}
              />
              <SeatLegend />
            </div>
          </div>
        </div>
      </PageWrapper>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // ROLE 3 — Passenger view
  // ══════════════════════════════════════════════════════════════════════════
  if (roleId == 3) {
    return (
      <PageWrapper>
        <Header
          title="Choose Your Seat"
          subtitle="Select a seat class to proceed with booking"
          backTo="flights"
          backLabel="Back to Flights"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: seat selection */}
          <div className="lg:col-span-2">
            <div className="space-y-3">
              {seatTypes.length === 0 ? (
                <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                  <Armchair size={40} className="text-white/20 mx-auto mb-3" />
                  <p className="text-white/40 font-medium">No seats available</p>
                </div>
              ) : (
                seatTypes.map((type) => (
                  <SeatCard
                    key={type.seatId}
                    type={type}
                    isSelected={selectedRow === type.seatId}
                    onSelect={handleRadioChange}
                  />
                ))
              )}
            </div>

            <StatsBar seatTypes={seatTypes} />

            {/* Book button */}
            <div className="mt-6">
              <Link
                to={`/${window.btoa("AddBooking")}`}
                state={{ seatid: { selectedRow } }}
              >
                <button
                  disabled={selectedRow === null}
                  className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-base rounded-2xl shadow-xl shadow-blue-500/30 transition-all duration-300 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  <Ticket size={20} />
                  {selectedRow
                    ? `Book ${selectedSeat?.seatType} — ₹${Number(
                        selectedSeat?.price
                      ).toLocaleString("en-IN")}`
                    : "Select a Seat to Continue"}
                </button>
              </Link>
            </div>
          </div>

          {/* Right: layout */}
          <div className="lg:col-span-1">
            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-5 sticky top-8">
              <h3 className="text-white font-semibold text-sm mb-1 flex items-center gap-2">
                <Armchair size={16} className="text-white/60" />
                Cabin Layout
              </h3>
              {selectedSeat && (
                <div
                  className={`mt-2 px-3 py-2 rounded-xl border ${
                    getClassConfig(selectedSeat.seatType).badge
                  } text-xs font-semibold flex items-center gap-1.5`}
                >
                  <CheckCircle size={12} />
                  {selectedSeat.seatType} · ₹{Number(selectedSeat.price).toLocaleString("en-IN")}
                </div>
              )}
              <SeatLayoutVisual
                seatTypes={seatTypes}
                selectedRow={selectedRow}
                onSelect={handleRadioChange}
              />
              <SeatLegend />
            </div>
          </div>
        </div>
      </PageWrapper>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // ROLE 2 — Manager approval view
  // ══════════════════════════════════════════════════════════════════════════
  if (roleId == 2) {
    return (
      <PageWrapper>
        <Header
          title="Seat Approval"
          subtitle="Review and approve or disapprove seat configurations"
          backTo="managerDashboard"
          backLabel="Back to Dashboard"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {/* Approval actions */}
            <div className="flex items-center gap-3 mb-4">
              <button
                disabled={selectedRow === null}
                onClick={() => success(selectedRow)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 text-sm"
              >
                <CheckCircle size={16} />
                Approve
              </button>
              <button
                disabled={selectedRow === null}
                onClick={() => deleteseat(selectedRow)}
                className="flex items-center gap-2 px-5 py-2.5 backdrop-blur-md bg-red-500/20 border border-red-400/30 hover:bg-red-500/30 text-red-300 font-semibold rounded-xl transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 text-sm"
              >
                <XCircle size={16} />
                Disapprove
              </button>
            </div>

            {seatTypes.length === 0 ? (
              <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                <Armchair size={40} className="text-white/20 mx-auto mb-3" />
                <p className="text-white/40 font-medium">No seat types pending review</p>
              </div>
            ) : (
              seatTypes.map((type) => (
                <SeatCard
                  key={type.seatId}
                  type={type}
                  isSelected={selectedRow === type.seatId}
                  onSelect={handleRadioChange}
                />
              ))
            )}

            <StatsBar seatTypes={seatTypes} />
          </div>

          {/* Right: layout */}
          <div className="lg:col-span-1">
            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-5 sticky top-8">
              <h3 className="text-white font-semibold text-sm mb-1 flex items-center gap-2">
                <Armchair size={16} className="text-white/60" />
                Cabin Preview
              </h3>
              {selectedSeat && (
                <div
                  className={`mt-2 px-3 py-2 rounded-xl border ${
                    getClassConfig(selectedSeat.seatType).badge
                  } text-xs font-semibold flex items-center gap-1.5`}
                >
                  <Info size={12} />
                  Reviewing: {selectedSeat.seatType}
                </div>
              )}
              <SeatLayoutVisual
                seatTypes={seatTypes}
                selectedRow={selectedRow}
                onSelect={handleRadioChange}
              />
              <SeatLegend />
            </div>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return null;
}
