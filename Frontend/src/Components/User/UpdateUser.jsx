import React, { useState, useEffect } from "react";
import apiCalls from "../../Service/apiCalls";
import { toast } from "react-toastify";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  UserCog,
  Mail,
  Lock,
  Phone,
  Save,
  X,
  ArrowLeft,
  User,
  Eye,
  EyeOff,
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

export default function UpdateUser() {
  const roleId = JSON.parse(localStorage.getItem("roleId"));
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [updatedUser, setupdatedUser] = useState({
    userId: location.state.userid.selectedRow,
    username: "",
    userEmail: "",
    userPhno: "",
    password: "",
  });

  const handleChange = (e) => {
    const value = e.target.value;
    setupdatedUser({ ...updatedUser, [e.target.name]: value });
    console.log(updatedUser);
  };

  const updatingUser = (e) => {
    e.preventDefault();
    setIsSaving(true);
    apiCalls
      .updateUser(updatedUser)
      .then((response) => {
        console.log(updatedUser);
        toast.success("Successfully Updated User Detail", {
          position: "top-center",
        });
        setIsSaving(false);
        if (roleId == 3) {
          navigate("/");
        } else if (roleId == 1) {
          navigate(`/${window.btoa("viewAllUsers")}`);
        }
      })
      .catch((err) => {
        console.log(err);
        setIsSaving(false);
      });
  };

  useEffect(() => {
    apiCalls
      .getUserByUserId(location.state.userid.selectedRow)
      .then((res) => {
        setUser(res.data);
        // Pre-fill fields with existing data
        setupdatedUser((prev) => ({
          ...prev,
          username: res.data.username || "",
          userEmail: res.data.userEmail || "",
          userPhno: res.data.userPhno || "",
        }));
      })
      .catch((err) => console.log(err));
  }, []);

  const cancelPath =
    roleId == 1 ? `/${window.btoa("viewAllUsers")}` : "/";

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-600 via-blue-700 to-indigo-800 flex items-center justify-center p-6">
      {/* Ambient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg">
        {/* Back link */}
        <Link
          to={cancelPath}
          className="inline-flex items-center gap-2 text-sky-200 hover:text-white mb-6 transition-colors duration-200 text-sm font-medium group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          Back to Users
        </Link>

        {/* Glass card */}
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
          {/* Header gradient strip */}
          <div className="h-2 bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600" />

          <div className="p-8">
            {/* Avatar + Title */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl border-4 border-white/20">
                  {getInitials(updatedUser.username || user.username)}
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white/20 shadow-md">
                  <UserCog className="w-4 h-4 text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Edit Profile
              </h2>
              <p className="text-sky-200/70 text-sm mt-1">
                Update user #{location.state.userid.selectedRow}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={updatingUser} className="space-y-5">
              {/* Username */}
              <div className="space-y-1.5">
                <label className="text-sky-200 text-sm font-semibold flex items-center gap-2">
                  <User className="w-4 h-4" /> Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="username"
                    placeholder={user.username || "Enter username"}
                    value={updatedUser.username}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-sky-300/50 focus:outline-none focus:ring-2 focus:ring-sky-400/60 focus:border-transparent transition-all duration-200 hover:bg-white/15"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-sky-200 text-sm font-semibold flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Email Address
                </label>
                <input
                  type="email"
                  name="userEmail"
                  placeholder={user.userEmail || "Enter email"}
                  value={updatedUser.userEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-sky-300/50 focus:outline-none focus:ring-2 focus:ring-sky-400/60 focus:border-transparent transition-all duration-200 hover:bg-white/15"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="text-sky-200 text-sm font-semibold flex items-center gap-2">
                  <Phone className="w-4 h-4" /> Phone Number
                </label>
                <input
                  type="text"
                  name="userPhno"
                  placeholder={user.userPhno || "Enter phone number"}
                  value={updatedUser.userPhno}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-sky-300/50 focus:outline-none focus:ring-2 focus:ring-sky-400/60 focus:border-transparent transition-all duration-200 hover:bg-white/15"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-sky-200 text-sm font-semibold flex items-center gap-2">
                  <Lock className="w-4 h-4" /> New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter new password"
                    value={updatedUser.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-sky-300/50 focus:outline-none focus:ring-2 focus:ring-sky-400/60 focus:border-transparent transition-all duration-200 hover:bg-white/15"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sky-300/60 hover:text-sky-200 transition-colors duration-200"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-white/15 pt-2" />

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isSaving}
                  autoFocus
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
                >
                  {isSaving ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {isSaving ? "Saving…" : "Save Changes"}
                </button>

                <Link to={cancelPath} className="flex-1">
                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-2 py-3 bg-white/10 hover:bg-white/20 border border-white/25 text-white font-semibold rounded-xl transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
