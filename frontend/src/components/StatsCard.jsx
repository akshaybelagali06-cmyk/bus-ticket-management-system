import { motion } from 'framer-motion';

export default function StatsCard({ title, value, icon: Icon, color, trend, delay = 0 }) {
  const colorMap = {
    cyan: { bg: 'from-cyan-500/20 to-cyan-500/5', border: 'border-cyan-500/20', icon: 'text-cyan-400', shadow: 'shadow-cyan-500/10' },
    green: { bg: 'from-emerald-500/20 to-emerald-500/5', border: 'border-emerald-500/20', icon: 'text-emerald-400', shadow: 'shadow-emerald-500/10' },
    red: { bg: 'from-red-500/20 to-red-500/5', border: 'border-red-500/20', icon: 'text-red-400', shadow: 'shadow-red-500/10' },
    purple: { bg: 'from-purple-500/20 to-purple-500/5', border: 'border-purple-500/20', icon: 'text-purple-400', shadow: 'shadow-purple-500/10' },
    amber: { bg: 'from-amber-500/20 to-amber-500/5', border: 'border-amber-500/20', icon: 'text-amber-400', shadow: 'shadow-amber-500/10' },
    blue: { bg: 'from-blue-500/20 to-blue-500/5', border: 'border-blue-500/20', icon: 'text-blue-400', shadow: 'shadow-blue-500/10' },
  };
  const c = colorMap[color] || colorMap.cyan;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`
        bg-gradient-to-br ${c.bg} backdrop-blur-sm rounded-2xl p-6
        border ${c.border} ${c.shadow} shadow-lg
        hover:shadow-xl transition-shadow cursor-default
      `}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[#94a3b8] mb-1">{title}</p>
          <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
          {trend && (
            <p className={`text-xs font-medium mt-2 ${trend > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-[#0f172a]/50 ${c.icon}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );
}
