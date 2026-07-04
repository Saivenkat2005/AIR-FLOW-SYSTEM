import React, { useState, useEffect } from "react";
import apiCalls from "../../Service/apiCalls";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Users,
  Search,
  Trash2,
  Edit3,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  Shield,
  User as UserIcon,
  Briefcase,
  Mail,
  Phone,
  Hash,
} from "lucide-react";

const ROLE_CONFIG = {
  ROLE_ADMIN: {
    label: "Admin",
    icon: Shield,
    className: "bg-blue-500/20 text-blue-300 border border-blue-400/30",
  },
  ROLE_MANAGER: {
    label: "Manager",
    icon: Briefcase,
    className: "bg-purple-500/20 text-purple-300 border border-purple-400/30",
  },
  ROLE_USER: {
    label: "User",
    icon: UserIcon,
    className: "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30",
  },
};

function getRoleConfig(authority) {
  return ROLE_CONFIG[authority] || ROLE_CONFIG["ROLE_USER"];
}

function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const AVATAR_COLORS = [
  "from-sky-400 to-blue-600",
  "from-violet-400 to-purple-600",
  "from-emerald-400 to-teal-600",
  "from-rose-400 to-pink-600",
  "from-amber-400 to-orange-600",
  "from-cyan-400 to-sky-600",
];

function avatarColor(id) {
  return AVATAR_COLORS[(id || 0) % AVATAR_COLORS.length];
}

const PAGE_SIZE = 8;

export default function User() {
  const navigate = useNavigate();
  const roleId = JSON.parse(localStorage.getItem("roleId"));
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    apiCalls
      .getAllUsers()
      .then((res) => setUsers(res.data))
      .catch((err) => console.log(err));
  }, []);

  const deleteuser = (id) => {
    setDeletingId(id);
    setUsers((prev) => prev.filter((u) => u.userId !== id));
    toast.error("USER DELETED", { position: "top-center" });
    apiCalls
      .deleteUser(id)
      .then(() => {
        setDeletingId(null);
        if (roleId == 1) navigate(`/${window.btoa("viewAllUsers")}`);
        else if (roleId == 3) navigate("/");
      })
      .catch((err) => {
        console.log(err);
        setDeletingId(null);
      });
  };

  const filtered = users.filter(
    (u) =>
      u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.userEmail?.toLowerCase().includes(search.toLowerCase()) ||
      u.userPhno?.toString().includes(search)
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-600 via-blue-700 to-indigo-800 p-6">
      {/* Ambient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                User Management
              </h1>
              <p className="text-sky-200 text-sm mt-0.5">
                {users.length} registered member{users.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <Link to={`/${window.btoa("addUser")}`}>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/25 text-white rounded-xl font-semibold transition-all duration-300 hover:-translate-y-0.5 shadow-lg">
              <UserPlus className="w-4 h-4" />
              Add User
            </button>
          </Link>
        </div>

        {/* Search & Filter Bar */}
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-4 mb-6 shadow-lg">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sky-300" />
            <input
              type="text"
              placeholder="Search by name, email or phone…"
              value={search}
              onChange={handleSearchChange}
              className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-sky-300/60 focus:outline-none focus:ring-2 focus:ring-sky-400/50 transition-all duration-200"
            />
          </div>
        </div>

        {/* Table Card */}
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* Sticky Header */}
              <thead>
                <tr className="bg-white/10 backdrop-blur-md border-b border-white/15">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-sky-200 uppercase tracking-widest">
                    <div className="flex items-center gap-1.5">
                      <UserIcon className="w-3.5 h-3.5" /> Avatar
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-sky-200 uppercase tracking-widest">
                    <div className="flex items-center gap-1.5">
                      <Hash className="w-3.5 h-3.5" /> ID
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-sky-200 uppercase tracking-widest">
                    <div className="flex items-center gap-1.5">
                      <UserIcon className="w-3.5 h-3.5" /> Username
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-sky-200 uppercase tracking-widest">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" /> Email
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-sky-200 uppercase tracking-widest">
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" /> Phone
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-sky-200 uppercase tracking-widest">
                    <div className="flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" /> Role
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-sky-200 uppercase tracking-widest">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-3 text-sky-300/60">
                        <Users className="w-12 h-12" />
                        <p className="text-sm font-medium">No users found</p>
                        {search && (
                          <p className="text-xs">Try adjusting your search</p>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginated.map((user) => {
                    const authority =
                      user.authorities?.[0]?.authority || "ROLE_USER";
                    const role = getRoleConfig(authority);
                    const RoleIcon = role.icon;
                    return (
                      <tr
                        key={user.userId}
                        className="group hover:bg-white/5 transition-all duration-200"
                      >
                        {/* Avatar */}
                        <td className="px-6 py-4">
                          <div
                            className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarColor(
                              user.userId
                            )} flex items-center justify-center text-white font-bold text-sm shadow-md`}
                          >
                            {getInitials(user.username)}
                          </div>
                        </td>

                        {/* ID */}
                        <td className="px-6 py-4">
                          <span className="text-sky-300/70 text-sm font-mono">
                            #{user.userId}
                          </span>
                        </td>

                        {/* Username */}
                        <td className="px-6 py-4">
                          <span className="text-white font-medium text-sm">
                            {user.username}
                          </span>
                        </td>

                        {/* Email */}
                        <td className="px-6 py-4">
                          <span className="text-sky-200 text-sm">
                            {user.userEmail}
                          </span>
                        </td>

                        {/* Phone */}
                        <td className="px-6 py-4">
                          <span className="text-sky-200/80 text-sm">
                            {user.userPhno || "—"}
                          </span>
                        </td>

                        {/* Role Badge */}
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${role.className}`}
                          >
                            <RoleIcon className="w-3 h-3" />
                            {role.label}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <Link
                              to={`/${window.btoa("updateUser")}`}
                              state={{ userid: { selectedRow: user.userId } }}
                            >
                              <button className="p-2 rounded-lg bg-sky-500/20 hover:bg-sky-500/40 border border-sky-400/30 text-sky-300 hover:text-white transition-all duration-200 hover:scale-110">
                                <Edit3 className="w-4 h-4" />
                              </button>
                            </Link>
                            <button
                              onClick={() => deleteuser(user.userId)}
                              disabled={deletingId === user.userId}
                              className="p-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 border border-rose-400/30 text-rose-300 hover:text-white transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-white/15">
              <p className="text-sky-200/70 text-sm">
                Showing{" "}
                <span className="text-white font-medium">
                  {(currentPage - 1) * PAGE_SIZE + 1}–
                  {Math.min(currentPage * PAGE_SIZE, filtered.length)}
                </span>{" "}
                of{" "}
                <span className="text-white font-medium">{filtered.length}</span>{" "}
                users
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all duration-200 ${
                        page === currentPage
                          ? "bg-white text-blue-700 shadow-md"
                          : "bg-white/10 hover:bg-white/20 border border-white/20 text-white"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
