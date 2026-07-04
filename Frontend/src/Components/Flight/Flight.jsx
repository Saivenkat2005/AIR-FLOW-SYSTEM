import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import apiCalls from "../../Service/apiCalls";
import {
  Plane,
  PlusCircle,
  Pencil,
  Trash2,
  LayoutList,
  MapPin,
  Clock,
  ChevronRight,
  Search,
  SlidersHorizontal,
  CheckCircle2,
  XCircle,
  Armchair,
  CircleDot,
} from "lucide-react";

// ─── Shared helpers ───────────────────────────────────────────────────────────

function StatusChip({ status }) {
  const active =
    !status || status?.toString().toLowerCase() === "active" || status === true;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${
        active
          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
          : "bg-red-500/20 text-red-300 border border-red-500/30"
      }`}
    >
      {active ? (
        <CheckCircle2 className="w-3 h-3" />
      ) : (
        <XCircle className="w-3 h-3" />
      )}
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function EmptyState({ message = "No flights found." }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
        <Plane className="w-10 h-10 text-sky-300 opacity-60" />
      </div>
      <p className="text-white/50 text-lg font-medium">{message}</p>
    </div>
  );
}

// ─── Admin View ───────────────────────────────────────────────────────────────

function AdminView({ flights, selectedRow, handleRadioChange, deleteflight }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-sky-950 to-indigo-950 px-6 py-10">
      {/* Page header */}
      <div className="max-w-7xl mx-auto mb-8 flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/30">
          <Plane className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
            Manage Flights
          </h1>
          <p className="text-white/40 text-sm mt-0.5">
            {flights.length} flight{flights.length !== 1 ? "s" : ""} in the
            system
          </p>
        </div>
      </div>

      {/* Action bar */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-wrap gap-3 items-center">
          {/* Add Flight */}
          <Link to={`/${window.btoa("addFlight")}`}>
            <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/20">
              <PlusCircle className="w-4 h-4" />
              Add Flight
            </button>
          </Link>

          {/* Update */}
          <Link
            to={`/${window.btoa("updateFlight")}`}
            state={{ id: { selectedRow } }}
          >
            <button
              disabled={selectedRow === null}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 text-blue-300 font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/20 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              <Pencil className="w-4 h-4" />
              Update
            </button>
          </Link>

          {/* Delete */}
          <button
            disabled={selectedRow === null}
            onClick={() => deleteflight(selectedRow)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-500/20 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>

          {/* View Seat Types */}
          <Link
            to={`/${window.btoa("seatTypes")}`}
            state={{ id: { selectedRow } }}
          >
            <button
              disabled={selectedRow === null}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/20 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              <LayoutList className="w-4 h-4" />
              View Seat Types
            </button>
          </Link>

          {selectedRow !== null && (
            <span className="ml-auto text-white/30 text-xs">
              Selected ID:{" "}
              <span className="text-sky-400 font-mono">{selectedRow}</span>
            </span>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="max-w-7xl mx-auto">
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          {flights.length === 0 ? (
            <EmptyState message="No flights found. Add a flight to get started." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-white/10 border-b border-white/10">
                    <th className="px-5 py-4 text-left text-white/60 font-semibold uppercase tracking-widest text-xs">
                      Select
                    </th>
                    <th className="px-5 py-4 text-left text-white/60 font-semibold uppercase tracking-widest text-xs">
                      Flight Name
                    </th>
                    <th className="px-5 py-4 text-left text-white/60 font-semibold uppercase tracking-widest text-xs">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> Departure
                      </div>
                    </th>
                    <th className="px-5 py-4 text-left text-white/60 font-semibold uppercase tracking-widest text-xs">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" /> Origin
                      </div>
                    </th>
                    <th className="px-5 py-4 text-left text-white/60 font-semibold uppercase tracking-widest text-xs">
                      Destination
                    </th>
                    <th className="px-5 py-4 text-left text-white/60 font-semibold uppercase tracking-widest text-xs">
                      Status
                    </th>
                    <th className="px-5 py-4 text-left text-white/60 font-semibold uppercase tracking-widest text-xs">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {flights.map((flight, idx) => {
                    const isSelected = selectedRow === flight.flightId;
                    return (
                      <tr
                        key={flight.flightId}
                        onClick={() => handleRadioChange(flight.flightId)}
                        className={`border-b border-white/5 cursor-pointer transition-all duration-200 group ${
                          isSelected
                            ? "bg-sky-500/15 border-sky-500/30"
                            : idx % 2 === 0
                            ? "bg-white/[0.02] hover:bg-white/[0.06]"
                            : "bg-white/[0.04] hover:bg-white/[0.08]"
                        }`}
                      >
                        {/* Radio */}
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-center">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                                isSelected
                                  ? "border-sky-400 bg-sky-400"
                                  : "border-white/30 group-hover:border-sky-400/60"
                              }`}
                            >
                              {isSelected && (
                                <div className="w-2 h-2 rounded-full bg-white" />
                              )}
                            </div>
                            <input
                              type="radio"
                              name="selectedRow"
                              className="sr-only"
                              checked={isSelected}
                              onChange={() =>
                                handleRadioChange(flight.flightId)
                              }
                            />
                          </div>
                        </td>

                        {/* Flight Name */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500/30 to-indigo-600/30 border border-white/10 flex items-center justify-center flex-shrink-0">
                              <Plane className="w-4 h-4 text-sky-300" />
                            </div>
                            <span className="text-white font-semibold">
                              {flight.flightName || "—"}
                            </span>
                          </div>
                        </td>

                        {/* Departure */}
                        <td className="px-5 py-4 text-white/70 font-mono text-xs">
                          {flight.takeOffTime || "—"}
                        </td>

                        {/* Origin */}
                        <td className="px-5 py-4 text-white/70">
                          {flight.origin || "—"}
                        </td>

                        {/* Destination */}
                        <td className="px-5 py-4 text-white/70">
                          {flight.destination || "—"}
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <StatusChip status={flight.status} />
                        </td>

                        {/* Quick Actions */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Link
                              to={`/${window.btoa("updateFlight")}`}
                              state={{ id: { selectedRow: flight.flightId } }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button className="p-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/40 border border-blue-500/30 text-blue-300 transition-all duration-150">
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                            </Link>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteflight(flight.flightId);
                              }}
                              className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 text-red-300 transition-all duration-150"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── User View ────────────────────────────────────────────────────────────────

function UserView({ flights, selectedRow, handleRadioChange }) {
  const [search, setSearch] = useState("");

  const filtered = flights.filter(
    (f) =>
      !search ||
      (f.flightName || "").toLowerCase().includes(search.toLowerCase()) ||
      (f.origin || "").toLowerCase().includes(search.toLowerCase()) ||
      (f.destination || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-sky-950 to-indigo-950 px-6 py-10">
      {/* Hero header */}
      <div className="max-w-6xl mx-auto mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-300 text-xs font-semibold uppercase tracking-widest mb-4">
          <Plane className="w-3.5 h-3.5" />
          Ready to Fly
        </div>
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-sky-300 via-blue-200 to-indigo-300 bg-clip-text text-transparent mb-2">
          Available Flights
        </h1>
        <p className="text-white/40 text-base">
          Choose your perfect flight and book with ease
        </p>
      </div>

      {/* Search / filter bar */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center gap-3">
          <div className="flex-1 flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
            <Search className="w-4 h-4 text-white/40 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search by name, origin or destination…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-white placeholder-white/30 text-sm outline-none w-full"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 text-sm font-medium transition-all duration-200">
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
          <span className="text-white/30 text-xs pr-2">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Flight cards grid */}
      {filtered.length === 0 ? (
        <div className="max-w-6xl mx-auto">
          <EmptyState message="No flights match your search." />
        </div>
      ) : (
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((flight) => {
            const isSelected = selectedRow === flight.flightId;
            return (
              <div
                key={flight.flightId}
                onClick={() => handleRadioChange(flight.flightId)}
                className={`group relative backdrop-blur-md border rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                  isSelected
                    ? "bg-sky-500/20 border-sky-400/50 shadow-xl shadow-sky-500/20"
                    : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 hover:shadow-sky-500/10"
                }`}
              >
                {/* Selected indicator */}
                {isSelected && (
                  <div className="absolute top-3 right-3">
                    <CircleDot className="w-5 h-5 text-sky-400" />
                  </div>
                )}

                {/* Airline logo + flight name */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/30 flex-shrink-0">
                    <Plane className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-base leading-tight">
                      {flight.flightName || "Flight"}
                    </p>
                    <p className="text-white/40 text-xs font-mono">
                      #{flight.flightId}
                    </p>
                  </div>
                </div>

                {/* Route: Origin → Destination */}
                <div className="flex items-center gap-2 mb-5">
                  <div className="flex flex-col items-center">
                    <MapPin className="w-4 h-4 text-sky-400" />
                    <span className="text-white font-semibold text-sm mt-1 max-w-[70px] truncate text-center">
                      {flight.origin || "Origin"}
                    </span>
                  </div>

                  {/* Animated dotted route line */}
                  <div className="flex-1 flex flex-col items-center gap-1 px-2">
                    <div className="relative w-full flex items-center justify-center">
                      {/* dashes */}
                      <div className="w-full border-t-2 border-dashed border-white/20" />
                      {/* plane in the middle */}
                      <div className="absolute bg-gradient-to-br from-slate-900 via-sky-950 to-indigo-950 px-1">
                        <Plane className="w-4 h-4 text-sky-400 group-hover:translate-x-1 transition-transform duration-500" />
                      </div>
                    </div>
                    <span className="text-white/25 text-[10px] font-medium">
                      Direct
                    </span>
                  </div>

                  <div className="flex flex-col items-center">
                    <MapPin className="w-4 h-4 text-indigo-400" />
                    <span className="text-white font-semibold text-sm mt-1 max-w-[70px] truncate text-center">
                      {flight.destination || "Destination"}
                    </span>
                  </div>
                </div>

                {/* Meta row */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-1.5 text-white/50 text-xs">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="font-mono">
                      {flight.takeOffTime || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <StatusChip status={flight.status} />
                  </div>
                </div>

                {/* Seat availability badge */}
                <div className="flex items-center gap-2 mb-5 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
                  <Armchair className="w-4 h-4 text-sky-300" />
                  <span className="text-white/60 text-xs">
                    {flight.availableSeats != null
                      ? `${flight.availableSeats} seats available`
                      : "Seats available — select to view"}
                  </span>
                </div>

                {/* CTA button */}
                <Link
                  to={`/${window.btoa("seatTypes")}`}
                  state={{ id: { selectedRow: flight.flightId } }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-2">
                    View Seats &amp; Book
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Flight() {
  const roleId = JSON.parse(localStorage.getItem("roleId"));

  const navigate = useNavigate();

  const [flights, setflights] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleRadioChange = (rowId) => {
    setSelectedRow(rowId);
  };

  const deleteflight = (id) => {
    setflights((prevflights) =>
      prevflights.filter((i) => i.flightId !== id)
    );

    toast.error(`FLIGHT REMOVED`, {
      position: "top-center",
    });

    apiCalls
      .deleteFlightById(id)
      .then((res) => {
        console.log("FLIGHT REMOVED");
        navigate(`/${window.btoa("flights")}`);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    async function getData() {
      apiCalls
        .getAllFlights()
        .then((res) => {
          setflights(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    getData();
  }, []);

  if (roleId == 1) {
    return (
      <AdminView
        flights={flights}
        selectedRow={selectedRow}
        handleRadioChange={handleRadioChange}
        deleteflight={deleteflight}
      />
    );
  } else if (roleId == 3) {
    return (
      <UserView
        flights={flights}
        selectedRow={selectedRow}
        handleRadioChange={handleRadioChange}
      />
    );
  }

  return null;
}
