import { motion } from 'framer-motion';

export default function StatsCard({ title, value, icon: Icon, color, trend, delay = 0 }) {
  const colorMap = {
    cyan: { bg: 'from-cyan-50/40 to-white', border: 'border-black', icon: 'text-cyan-800', iconBg: 'bg-cyan-50', shadow: 'shadow-cyan-500/5' },
    green: { bg: 'from-emerald-50/40 to-white', border: 'border-black', icon: 'text-emerald-600', iconBg: 'bg-emerald-50', shadow: 'shadow-emerald-500/5' },
    red: { bg: 'from-red-50/40 to-white', border: 'border-black', icon: 'text-red-600', iconBg: 'bg-red-50', shadow: 'shadow-red-500/5' },
    purple: { bg: 'from-purple-50/40 to-white', border: 'border-black', icon: 'text-purple-600', iconBg: 'bg-purple-50', shadow: 'shadow-purple-500/5' },
    amber: { bg: 'from-amber-50/40 to-white', border: 'border-black', icon: 'text-amber-600', iconBg: 'bg-amber-50', shadow: 'shadow-amber-500/5' },
    blue: { bg: 'from-blue-50/40 to-white', border: 'border-black', icon: 'text-blue-600', iconBg: 'bg-blue-50', shadow: 'shadow-blue-500/5' },
  };
  const c = colorMap[color] || colorMap.cyan;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4, transition: { duration: 0.1 } }}
      className={`
        bg-gradient-to-br ${c.bg} rounded-2xl p-6
        border ${c.border} ${c.shadow} shadow-md
        hover:shadow-lg transition-shadow cursor-default
      `}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-slate-800 tracking-tight">{value}</p>
          {trend && (
            <p className={`text-xs font-medium mt-2 ${trend > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${c.iconBg} ${c.icon}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );
}