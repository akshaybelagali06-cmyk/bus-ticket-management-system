import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, Bell, Menu, LogOut, User, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ onMenuToggle }) {
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="h-16 bg-[#111827]/80 backdrop-blur-xl border-b border-[#1e293b] flex items-center justify-between px-6 shrink-0">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-lg text-[#94a3b8] hover:text-white hover:bg-[#1e293b] transition-all"
          id="menu-toggle"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden sm:flex items-center gap-2 bg-[#1e293b] rounded-xl px-4 py-2 border border-[#334155] focus-within:border-cyan-500/50 transition-all w-72">
          <Search className="w-4 h-4 text-[#64748b]" />
          <input
            type="text"
            placeholder="Search anything..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-sm text-white placeholder-[#64748b] outline-none w-full"
            id="global-search"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-lg text-[#94a3b8] hover:text-white hover:bg-[#1e293b] transition-all" id="notifications-btn">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
        </button>

        {/* Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#1e293b] transition-all"
            id="profile-btn"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-cyan-500/20">
              {user?.full_name?.charAt(0) || 'A'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-white">{user?.full_name || 'Admin'}</p>
              <p className="text-xs text-[#64748b]">Administrator</p>
            </div>
            <ChevronDown className="w-4 h-4 text-[#64748b] hidden md:block" />
          </button>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-56 bg-[#1e293b] border border-[#334155] rounded-xl shadow-2xl shadow-black/40 overflow-hidden z-50"
              >
                <div className="p-4 border-b border-[#334155]">
                  <p className="font-semibold text-white text-sm">{user?.full_name || 'Admin'}</p>
                  <p className="text-xs text-[#64748b] mt-0.5">{user?.email || 'admin@buspass.com'}</p>
                </div>
                <div className="p-2">
                  <button className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-[#94a3b8] hover:text-white hover:bg-[#0f172a] rounded-lg transition-all">
                    <User className="w-4 h-4" />
                    Profile
                  </button>
                  <button
                    onClick={logout}
                    className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
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
