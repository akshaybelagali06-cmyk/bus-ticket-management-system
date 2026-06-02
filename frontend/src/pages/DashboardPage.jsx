import { useState, useEffect } from 'react';
import api from '../services/api';
import StatsCard from '../components/StatsCard';
import { motion } from 'framer-motion';
import {
  Users, 
  MapPin, 
  CreditCard, 
  Truck,
  Calendar,
  Clock,
  Award,
  Sparkles,
  Bell,
  UserCheck,
  Activity
} from 'lucide-react';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
    
    // Set current time
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

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
          <div className="w-12 h-12 border-3 border-gray-800 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-400 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = data?.stats || {};

  const recentActivities = [
    { id: 1, action: 'New student registered', time: '5 minutes ago', icon: UserCheck, color: 'text-gray-500', bg: 'bg-gray-50' },
    { id: 2, action: 'Route KA-01 updated', time: '1 hour ago', icon: MapPin, color: 'text-gray-500', bg: 'bg-gray-50' },
    { id: 3, action: 'Bus pass renewed', time: '3 hours ago', icon: CreditCard, color: 'text-gray-500', bg: 'bg-gray-50' },
    { id: 4, action: 'New driver assigned', time: '5 hours ago', icon: Truck, color: 'text-gray-500', bg: 'bg-gray-50' },
    { id: 5, action: 'Route schedule updated', time: '8 hours ago', icon: Calendar, color: 'text-gray-500', bg: 'bg-gray-50' },
    { id: 6, action: 'Monthly report generated', time: '12 hours ago', icon: Activity, color: 'text-gray-500', bg: 'bg-gray-50' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-6 text-white shadow-xl"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gray-700/20 rounded-full blur-2xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-300">{greeting}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome to BusPass Pro</h1>
            <p className="text-gray-300 text-sm">Here's what's happening with your bus management system today.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-gray-400">Current Time</p>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <p className="text-xl font-semibold">{currentTime}</p>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center border-2 border-gray-600 shadow-lg">
              <span className="text-lg font-bold">👤</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards Grid - No growth rates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard 
          title="Total Students" 
          value={stats.totalStudents || 0} 
          icon={Users} 
          color="gray" 
          delay={0} 
        />
        <StatsCard 
          title="Active Passes" 
          value={stats.activePasses || 0} 
          icon={CreditCard} 
          color="gray" 
          delay={0.05}
        />
        <StatsCard 
          title="Total Routes" 
          value={stats.totalRoutes || 0} 
          icon={MapPin} 
          color="gray" 
          delay={0.1}
        />
        <StatsCard 
          title="Total Drivers" 
          value={stats.totalDrivers || 0} 
          icon={Truck} 
          color="gray" 
          delay={0.15}
        />
      </div>

      {/* Recent Activities Section - Full Width */}
      <div className="grid grid-cols-1 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="p-6 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center shadow-sm">
                <Bell className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Recent Activities</h2>
                <p className="text-sm text-gray-500 mt-0.5">Latest system updates and events</p>
              </div>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {recentActivities.map((activity, idx) => (
              <motion.div 
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * idx }}
                className="p-5 hover:bg-gray-50 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${activity.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <activity.icon className={`w-5 h-5 ${activity.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <p className="text-base font-semibold text-gray-800">{activity.action}</p>
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">{activity.time}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">System event • Auto-generated</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* System Health & Quick Actions Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-800 to-gray-900 p-6 shadow-xl"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gray-600/10 rounded-full blur-2xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gray-700 backdrop-blur-sm flex items-center justify-center">
              <Award className="w-7 h-7 text-yellow-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">System Health: Excellent</h3>
              <p className="text-sm text-gray-300">All systems operational. 99.9% uptime this month.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-gray-400">Next Backup</p>
              <p className="text-sm font-semibold text-white">In 2 hours</p>
            </div>
            <div className="w-px h-8 bg-gray-600"></div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Last Updated</p>
              <p className="text-sm font-semibold text-white">Just now</p>
            </div>
            <button className="ml-4 px-5 py-2 bg-gray-700 text-white text-sm font-bold rounded-lg hover:bg-gray-600 transition-all shadow-md">
              View Details
            </button>
          </div>
        </div>
      </motion.div>

      {/* Welcome Message Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl shadow-md border border-gray-100 p-6"
      >
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center shadow-sm">
            <Sparkles className="w-7 h-7 text-gray-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-800 mb-2">BusPass Management Pro</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Manage your bus pass system efficiently with our comprehensive dashboard. 
              View students, routes, drivers, and passes all in one place. Track performance 
              metrics, monitor system health, and make data-driven decisions.
            </p>
            <div className="flex flex-wrap gap-3 mt-5">
              <button className="px-5 py-2.5 bg-gray-800 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 transition-all shadow-md">
                View Full Report
              </button>
              <button className="px-5 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-200 transition-all">
                Export Data
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}