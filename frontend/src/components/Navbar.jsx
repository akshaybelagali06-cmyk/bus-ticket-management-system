import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, Bell, Menu, LogOut, User, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ onMenuToggle }) {
  const { user, logout } = useAuth();

  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">

      {/* Left */}
      <div className="flex items-center gap-4">

        <button
          onClick={onMenuToggle}
          className="p-2 rounded-lg text-slate-10 hover:text-slate-500 hover:bg-slate-100 transition-all"
          id="menu-toggle"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-2 border border-slate-200 focus-within:border-cyan-500 transition-all w-100 max-w-xs" id="global-search-container">

          <Search className="w-4 h-4 text-slate-400" />

          <input
            type="text"
            placeholder="Search anything..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none w-full"
            id="global-search"
          />

        </div>

      </div>

      {/* Right */}
      <div className="flex items-center gap-3">

        {/* Notifications */}
        <button
          className="p-2 rounded-lg text-white hover:text-yellow-400 hover:bg-slate-100 transition-all"
          id="notifications-btn"
        >
          <Bell className="w-5 h-5" />

          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-white rounded-full animate-pulse" />

        </button>

        {/* Profile */}
        <div className="relative">

          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 transition-all"
            id="profile-btn"
          >

            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-cyan-500/20">
              {user?.full_name?.charAt(0) || 'A'}
            </div>

            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-slate-800">
                {user?.full_name || 'Admin'}
              </p>

              <p className="text-xs text-slate-400">
                Administrator
              </p>
            </div>

            <ChevronDown className="w-4 h-4 text-slate-400 hidden md:block" />

          </button>

          <AnimatePresence>

            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50"
              >

                <div className="p-4 border-b border-slate-200">

                  <p className="font-semibold text-slate-800 text-sm">
                    {user?.full_name || 'Admin'}
                  </p>

                  <p className="text-xs text-slate-400 mt-0.5">
                    {user?.email || 'admin@buspass.com'}
                  </p>

                </div>

                <div className="p-2">

                  <button className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all">

                    <User className="w-4 h-4" />

                    Profile

                  </button>

                  <button
                    onClick={logout}
                    className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    id="logout-btn"
                  >

                    <LogOut className="w-4 h-4" />

                    Sign Out

                  </button>

                </div>

              </motion.div>
            )}

          </AnimatePresence>

        </div>

      </div>

    </header>
  );
}