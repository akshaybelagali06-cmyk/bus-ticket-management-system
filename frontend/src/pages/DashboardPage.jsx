import { useState, useEffect } from 'react';
import api from '../services/api';
import StatsCard from '../components/StatsCard';
import { motion } from 'framer-motion';
import {
  Users, MapPin, CreditCard, Truck
} from 'lucide-react';

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

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-4xl font-bold text-black">Dashboard Overview</h1>
        <p className="text-sm text-[#03080e] mt-1">Welcome back! Here's what's happening today.</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Total Students" value={stats.totalStudents} icon={Users} color="cyan" delay={0} />
        <StatsCard title="Active Passes" value={stats.activePasses} icon={CreditCard} color="green" delay={0.05} />
        <StatsCard title="Total Routes" value={stats.totalRoutes} icon={MapPin} color="purple" delay={0.1} />
        <StatsCard title="Total Drivers" value={stats.totalDrivers} icon={Truck} color="blue" delay={0.15} />
      </div>

      {/* Welcome Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl border border-slate-700 p-8"
      >
        <h2 className="text-lg font-semibold text-white mb-2">Welcome to BusPass Management Pro</h2>
        <p className="text-[#94a3b8]">Manage your bus pass system efficiently with our comprehensive dashboard. View students, routes, drivers, and passes all in one place.</p>
      </motion.div>
    </div>
  );
}

