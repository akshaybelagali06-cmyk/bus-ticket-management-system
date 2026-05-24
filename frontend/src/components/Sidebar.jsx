import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, MapPin, Truck, CreditCard,
  Settings, Bus, X
} from 'lucide-react';

const menuItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/students', label: 'Students', icon: Users },
  { path: '/routes', label: 'Routes', icon: MapPin },
  { path: '/drivers', label: 'Drivers', icon: Truck },
  { path: '/passes', label: 'Bus Passes', icon: CreditCard },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ isOpen, onToggle }) {
  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ width: isOpen ? 260 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`
          fixed lg:relative z-50 h-full bg-[#111827] border-r border-[#1e293b]
          flex flex-col overflow-hidden
          ${isOpen ? 'shadow-2xl lg:shadow-none' : ''}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-5 border-b border-[#1e293b] min-w-[260px]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Bus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">BusPass</h1>
              <p className="text-xs text-[#64748b] font-medium">Management Pro</p>
            </div>
          </div>
          <button onClick={onToggle} className="lg:hidden text-[#64748b] hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto min-w-[260px]">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-400 shadow-lg shadow-cyan-500/5 border border-cyan-500/20'
                    : 'text-[#94a3b8] hover:bg-[#1e293b] hover:text-white'
                }`
              }
            >
              <item.icon className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[#1e293b] min-w-[260px]">
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl p-4 border border-cyan-500/10">
            <p className="text-xs font-semibold text-cyan-400 mb-1">BusPass Pro v1.0</p>
            <p className="text-xs text-[#64748b]">Admin Dashboard</p>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
