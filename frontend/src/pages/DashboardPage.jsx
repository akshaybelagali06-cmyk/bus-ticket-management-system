import { useState, useEffect } from 'react';
import api from '../services/api';
import StatsCard from '../components/StatsCard';
import { motion } from 'framer-motion';
import {
  Users, MapPin, CreditCard, RefreshCw, Truck
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

const COLORS = ['#06b6d4', '#22c55e', '#ef4444', '#f59e0b', '#8b5cf6'];

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/stats')
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-[#94a3b8]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = data?.stats || {};
  const charts = data?.charts || {};

  const tooltipStyle = {
    contentStyle: { background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#f8fafc', fontSize: '13px' },
    cursor: { fill: 'rgba(6, 182, 212, 0.05)' },
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-sm text-[#64748b] mt-1">Welcome back! Here's what's happening today.</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        <StatsCard title="Total Students" value={stats.totalStudents} icon={Users} color="cyan" delay={0} />
        <StatsCard title="Active Passes" value={stats.activePasses} icon={CreditCard} color="green" delay={0.05} />
        <StatsCard title="Total Routes" value={stats.totalRoutes} icon={MapPin} color="purple" delay={0.1} />
        <StatsCard title="Total Drivers" value={stats.totalDrivers} icon={Truck} color="blue" delay={0.15} />
        <StatsCard title="Total Renewals" value={stats.totalRenewals} icon={RefreshCw} color="amber" delay={0.2} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Renewals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-[#1e293b] rounded-2xl border border-[#334155] p-6 shadow-lg"
        >
          <h3 className="text-base font-semibold text-white mb-6">Monthly Renewals</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={charts.monthlyRenewals || []}>
              <defs>
                <linearGradient id="colorRenewals" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip {...tooltipStyle} />
              <Area type="monotone" dataKey="count" stroke="#06b6d4" fill="url(#colorRenewals)" strokeWidth={2} name="Renewals" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Route Usage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="bg-[#1e293b] rounded-2xl border border-[#334155] p-6 shadow-lg"
        >
          <h3 className="text-base font-semibold text-white mb-6">Most Used Routes</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={charts.routeUsage || []} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis type="number" stroke="#64748b" fontSize={12} />
              <YAxis dataKey="route" type="category" stroke="#64748b" fontSize={11} width={120} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="count" fill="#06b6d4" radius={[0, 6, 6, 0]} name="Passes" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Pass Status Pie */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="bg-[#1e293b] rounded-2xl border border-[#334155] p-6 shadow-lg max-w-md"
      >
        <h3 className="text-base font-semibold text-white mb-6">Pass Status Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={charts.passStatus || []}
              dataKey="count"
              nameKey="status"
              cx="50%" cy="50%"
              outerRadius={90}
              innerRadius={55}
              strokeWidth={0}
              label={({ status, count }) => `${status}: ${count}`}
            >
              {(charts.passStatus || []).map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip {...tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
