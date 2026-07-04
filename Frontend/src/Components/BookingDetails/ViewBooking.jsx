import React, { useState, useEffect } from "react";
import apiCalls from "../../Service/apiCalls";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Plane,
  Download,
  Pencil,
  Trash2,
  ArrowLeft,
  ClipboardList,
  SearchX,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Tag,
} from "lucide-react";

/* ─── helpers ─────────────────────────────────────────────── */
const statusMeta = (status) => {
  const s = (status || "confirmed").toLowerCase();
  if (s === "confirmed")
    return {
      label: "Confirmed",
      bg: "bg-emerald-500/20",
      text: "text-emerald-300",
      ring: "ring-emerald-500/40",
    };
  if (s === "pending")
    return {
      label: "Pending",
      bg: "bg-amber-500/20",
      text: "text-amber-300",
      ring: "ring-amber-500/40",
    };
  return {
    label: "Cancelled",
    bg: "bg-red-500/20",
    text: "text-red-300",
    ring: "ring-red-500/40",
  };
};

const exportCSV = (data) => {
  if (!data.length) return;
  const headers = [
    "Booking ID",
    "Customer Name",
    "Seat Class",
    "Origin",
    "Destination",
    "Date",
    "Passengers",
    "Total Price",
  ];
  const rows = data.map((b) => [
    b.bookingId,
    b.customerName,
    b.seatType,
    b.origin,
    b.destination,
    b.date,
    b.nop,
    b.totalPrice,
  ]);
  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "bookings.csv";
  a.click();
  URL.revokeObjectURL(url);
};

/* ─── sub-components ──────────────────────────────────────── */
const StatusChip = ({ status }) => {
  const meta = statusMeta(status);
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ring-1 ${meta.bg} ${meta.text} ${meta.ring}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {meta.label}
    </span>
  );
};

const ColHeader = ({ icon: Icon, label }) => (
  <th className="px-4 py-4 text-left">
    <div className="flex items-center gap-1.5 text-sky-300 text-xs font-bold uppercase tracking-widest whitespace-nowrap">
      {Icon && <Icon size={13} />}
      {label}
    </div>
  </th>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-24 gap-4">
    <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
      <SearchX size={36} className="text-white/30" />
    </div>
    <p className="text-white/40 text-lg font-medium">No reservations found</p>
    <p className="text-white/25 text-sm">
      Bookings will appear here once created
    </p>
  </div>
);

/* ─── main component ──────────────────────────────────────── */
export default function ViewBooking() {
  const profileId = JSON.parse(localStorage.getItem("profileId"));
  const roleId = JSON.parse(localStorage.getItem("roleId"));
  const navigate = useNavigate();

  const [booking, setbooking] = useState([]);
  const [specbook, setspecbook] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const isAdmin = roleId == 1;
  const displayData = isAdmin ? booking : specbook;

  const handleRadioChange = (rowId) => setSelectedRow(rowId);

  const deletebooking = (id) => {
    if (!id) return;
    setDeletingId(id);
    setbooking((prev) => prev.filter((i) => i.bookingId !== id));
    setspecbook((prev) => prev.filter((i) => i.bookingId !== id));
    toast.error(
      "Please Wait !!! Cancelling your Reservation. Check your Email for Confirmation.",
      { position: "top-center" }
    );
    apiCalls
      .deleteBooking(id)
      .then(() => {
        setDeletingId(null);
        navigate(`/${window.btoa("viewBooking")}`);
      })
      .catch((err) => {
        console.log(err);
        setDeletingId(null);
      });
  };

  /* ── fetch all bookings (admin) ── */
  useEffect(() => {
    apiCalls
      .getAllBookings()
      .then((res) => setbooking(res.data))
      .catch((err) => console.log(err));
  }, []);

  /* ── fetch user bookings ── */
  useEffect(() => {
    apiCalls
      .getBookingsByUserId(profileId)
      .then((res) => setspecbook(res.data))
      .catch((err) => console.log(err));
  }, [profileId]);

  if (roleId != 1 && roleId != 3) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-600 via-blue-700 to-indigo-800 p-4 md:p-8">
      {/* ── floating particles (decorative) ── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/5"
            style={{
              width: `${80 + i * 40}px`,
              height: `${80 + i * 40}px`,
              top: `${10 + i * 15}%`,
              left: `${5 + i * 16}%`,
              animation: `float ${6 + i}s ease-in-out infinite alternate`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes float {
          from { transform: translateY(0px) rotate(0deg); }
          to   { transform: translateY(-20px) rotate(5deg); }
        }
      `}</style>

      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        {/* ── page header ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
              <ClipboardList size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                Reservations
              </h1>
              <p className="text-white/60 text-sm mt-0.5">
                {isAdmin ? "All bookings across the system" : "Your personal bookings"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => exportCSV(displayData)}
              disabled={!displayData.length}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed backdrop-blur-md"
            >
              <Download size={15} />
              Export CSV
            </button>
            <Link to={`/${window.btoa("flights")}`}>
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-blue-700 hover:bg-white/90 text-sm font-bold shadow-lg transition-all duration-200 hover:-translate-y-0.5">
                <ArrowLeft size={15} />
                Book Tickets
              </button>
            </Link>
          </div>
        </div>

        {/* ── main card ── */}
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
          {/* card header bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <Plane size={16} className="text-sky-300" />
              <span className="font-semibold">
                {displayData.length} Booking{displayData.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* action buttons (shown when a row is selected) */}
            <div
              className={`flex items-center gap-2 transition-all duration-300 ${
                selectedRow ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1 pointer-events-none"
              }`}
            >
              <Link
                to={`/${window.btoa("updateBooking")}`}
                state={{ bookingid: { selectedRow } }}
              >
                <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5">
                  <Pencil size={13} />
                  Update
                </button>
              </Link>
              <button
                onClick={() => deletebooking(selectedRow)}
                disabled={deletingId === selectedRow}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50"
              >
                <Trash2 size={13} />
                {deletingId === selectedRow ? "Cancelling…" : "Cancel"}
              </button>
            </div>
          </div>

          {/* table */}
          <div className="overflow-x-auto">
            {displayData.length === 0 ? (
              <EmptyState />
            ) : (
              <table className="w-full">
                <thead className="sticky top-0 bg-blue-900/60 backdrop-blur-md border-b border-white/10">
                  <tr>
                    <ColHeader label="Select" />
                    <ColHeader icon={Tag} label="Booking ID" />
                    <ColHeader icon={Users} label="Customer" />
                    <ColHeader icon={Plane} label="Seat Class" />
                    <ColHeader icon={MapPin} label="Origin" />
                    <ColHeader icon={MapPin} label="Destination" />
                    <ColHeader icon={Calendar} label="Date" />
                    <ColHeader icon={Users} label="Passengers" />
                    <ColHeader icon={DollarSign} label="Total Price" />
                    <ColHeader label="Status" />
                    <ColHeader label="Actions" />
                  </tr>
                </thead>
                <tbody>
                  {displayData.map((book, idx) => {
                    const isSelected = selectedRow === book.bookingId;
                    return (
                      <tr
                        key={book.bookingId}
                        onClick={() => handleRadioChange(book.bookingId)}
                        className={`border-b border-white/5 cursor-pointer transition-all duration-200 group ${
                          isSelected
                            ? "bg-sky-500/15 border-l-2 border-l-sky-400"
                            : idx % 2 === 0
                            ? "bg-white/3 hover:bg-white/8"
                            : "bg-transparent hover:bg-white/8"
                        }`}
                      >
                        {/* radio */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center justify-center">
                            <div
                              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                                isSelected
                                  ? "border-sky-400 bg-sky-400"
                                  : "border-white/30 group-hover:border-white/60"
                              }`}
                            >
                              {isSelected && (
                                <div className="w-1.5 h-1.5 rounded-full bg-white" />
                              )}
                            </div>
                          </div>
                        </td>

                        {/* booking id */}
                        <td className="px-4 py-3.5">
                          <span className="text-sky-300 font-mono text-xs font-bold">
                            #{book.bookingId}
                          </span>
                        </td>

                        {/* customer */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                              {(book.customerName || "?")[0].toUpperCase()}
                            </div>
                            <span className="text-white/90 text-sm font-medium whitespace-nowrap">
                              {book.customerName}
                            </span>
                          </div>
                        </td>

                        {/* seat type */}
                        <td className="px-4 py-3.5">
                          <span className="text-white/75 text-sm">
                            {book.seatType}
                          </span>
                        </td>

                        {/* origin */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1 text-white/80 text-sm">
                            <MapPin size={12} className="text-sky-400" />
                            {book.origin}
                          </div>
                        </td>

                        {/* destination */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1 text-white/80 text-sm">
                            <MapPin size={12} className="text-indigo-400" />
                            {book.destination}
                          </div>
                        </td>

                        {/* date */}
                        <td className="px-4 py-3.5">
                          <span className="text-white/70 text-sm">
                            {book.date}
                          </span>
                        </td>

                        {/* nop */}
                        <td className="px-4 py-3.5 text-center">
                          <span className="text-white/80 text-sm font-medium">
                            {book.nop}
                          </span>
                        </td>

                        {/* price */}
                        <td className="px-4 py-3.5">
                          <span className="text-emerald-300 font-bold text-sm">
                            ₹{book.totalPrice?.toLocaleString() ?? book.totalPrice}
                          </span>
                        </td>

                        {/* status */}
                        <td className="px-4 py-3.5">
                          <StatusChip status={book.status} />
                        </td>

                        {/* per-row actions */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/${window.btoa("updateBooking")}`}
                              state={{ bookingid: { selectedRow: book.bookingId } }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button className="p-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 transition-all duration-200">
                                <Pencil size={13} />
                              </button>
                            </Link>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deletebooking(book.bookingId);
                              }}
                              disabled={deletingId === book.bookingId}
                              className="p-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/30 border border-red-500/30 text-red-300 transition-all duration-200 disabled:opacity-50"
                            >
                              <Trash2 size={13} />
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
        </div>

        {/* footer note */}
        <p className="text-center text-white/30 text-xs pb-4">
          {isAdmin ? "Admin view — all system bookings" : "Showing your personal reservations only"}
        </p>
      </div>
    </div>
  );
}
