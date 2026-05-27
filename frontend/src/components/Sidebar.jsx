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
            className="fixed inset-0 bg-slate-900/30 z-40 lg:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ width: isOpen ? 260 : 0 }}
        transition={{ duration: 0.1, ease: [0.4, 0, 0.2, 1] }}
        className={`
          fixed lg:relative z-50 h-full bg-white border-r border-slate-200
          flex flex-col overflow-hidden
          ${isOpen ? 'shadow-xl lg:shadow-none' : ''}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 min-w-[260px]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-md shadow-cyan-500/10">
              <Bus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800 tracking-tight">BusPass</h1>
              <p className="text-xs text-slate-400 font-medium">Management Pro</p>
            </div>
          </div>
          <button onClick={onToggle} className="lg:hidden text-slate-400 hover:text-slate-600 transition-colors">
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
                    ? 'bg-cyan-50 text-cyan-600 border border-cyan-100 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <item.icon className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 min-w-[260px]">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <p className="text-xs font-semibold text-cyan-600 mb-1">BusPass Pro v1.0</p>
            <p className="text-xs text-slate-400">Admin Dashboard</p>
          </div>
        </div>
      </motion.aside>
    </>
  );
}