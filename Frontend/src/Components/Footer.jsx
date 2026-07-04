import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plane, Menu, X, Bell, LayoutDashboard, Users, Ticket, MapPin, Settings, TrendingUp, Activity, ChevronRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-slate-900 to-blue-950 text-white py-10 px-6 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
              <Plane size={18} className="text-white -rotate-45" />
            </div>
            <span className="font-bold text-lg">Persistent Airways</span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            Your premium airline booking experience. Safe, reliable, and comfortable flights to destinations worldwide.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-sm uppercase tracking-wider text-slate-400 mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            {['About Us', 'Contact', 'Privacy Policy', 'Terms of Service', 'FAQ'].map(link => (
              <li key={link}>
                <a href="#" className="hover:text-sky-400 transition-colors flex items-center gap-1 group">
                  <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold text-sm uppercase tracking-wider text-slate-400 mb-4">Contact</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>📧 support@persistentairways.com</li>
            <li>📞 1800-123-4567</li>
            <li>🌐 www.persistentairways.com</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto border-t border-slate-800 mt-8 pt-6 text-center text-xs text-slate-500">
        © 2025 Persistent Airways. All rights reserved. Built with ✈️ and React.
      </div>
    </footer>
  );
}
