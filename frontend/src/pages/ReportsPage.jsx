import { useState, useEffect } from 'react';
import api from '../services/api';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import { toast } from 'sonner';
import { 
  TrendingUp, 
  Users, 
  Route, 
  Ticket, 
  Calendar, 
  Award, 
  Sparkles,
  DollarSign,
  Activity,
  PieChart,
  BarChart3
} from 'lucide-react';

export default function ReportsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/reports')
      .then(res => setData(res.data))
      .catch(() => toast.error('Failed to load reports'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-gray-800 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-400 font-medium">Loading reports...</p>
        </div>
      </div>
    );
  }

  const routeColumns = [
    { 
      header: 'Route ID', 
      accessor: 'route_id',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold text-gray-600">#{row.route_id}</span>
        </div>
      )
    },
    { 
      header: 'Route Path', 
      accessor: 'route',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Route className="w-4 h-4 text-gray-400" />
          <span className="font-medium text-gray-700">{row.route}</span>
        </div>
      )
    },
    { 
      header: 'Fare (₹)', 
      cell: (row) => (
        <div className="flex items-center gap-1">
          <DollarSign className="w-3.5 h-3.5 text-green-600" />
          <span className="font-bold text-green-600">₹{row.fare}</span>
        </div>
      )
    },
    { 
      header: 'Total Passes', 
      accessor: 'total_passes',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Ticket className="w-4 h-4 text-gray-400" />
          <span className="font-semibold text-gray-700">{row.total_passes}</span>
        </div>
      )
    },
    { 
      header: 'Active Passes', 
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-500" />
          <span className="font-bold text-emerald-600">{row.active_passes}</span>
        </div>
      )
    },
  ];

  const expiredColumns = [
    { 
      header: 'Pass ID', 
      accessor: 'pass_id',
      cell: (row) => (
        <span className="font-mono text-xs font-semibold text-gray-500">#{row.pass_id}</span>
      )
    },
    { 
      header: 'Student Name', 
      accessor: 'student_name',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="font-medium text-gray-700">{row.student_name}</span>
        </div>
      )
    },
    { 
      header: 'Department', 
      accessor: 'department',
      cell: (row) => (
        <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">
          {row.department}
        </span>
      )
    },
    { 
      header: 'Route', 
      accessor: 'route',
      cell: (row) => (
        <div className="flex items-center gap-1">
          <Route className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-sm text-gray-600">{row.route}</span>
        </div>
      )
    },
    { 
      header: 'Expiry Date', 
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-red-400" />
          <span className="text-red-600 font-medium">{new Date(row.expiry_date).toLocaleDateString()}</span>
        </div>
      )
    },
  ];

  // Calculate additional stats
  const totalRevenue = data?.routeStats?.reduce((sum, route) => sum + (route.fare * route.active_passes), 0) || 0;
  const totalPasses = data?.routeStats?.reduce((sum, route) => sum + route.total_passes, 0) || 0;
  const avgPassesPerRoute = data?.routeStats?.length ? (totalPasses / data.routeStats.length).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      {/* Modern Gradient Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-6 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <PieChart className="w-5 h-5 text-yellow-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-300">Analytics & Insights</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">System Reports</h1>
          <p className="text-gray-300 text-sm">Detailed statistics of routes performance and status</p>
        </div>
      </div>

      {/* Premium Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
        <div className="group relative overflow-hidden bg-white rounded-2xl p-5 shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gray-50 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Active Passengers</p>
              <p className="text-3xl font-black text-gray-800">{data?.activeUsers || 0}</p>
              <div className="flex items-center gap-1 mt-2">
                <Users className="w-3 h-3 text-green-500" />
                <span className="text-xs text-green-600 font-medium">Currently Active</span>
              </div>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-7 h-7 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-white rounded-2xl p-5 shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gray-50 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Total Routes</p>
              <p className="text-3xl font-black text-gray-800">{data?.routeStats?.length || 0}</p>
              <p className="text-xs text-gray-400 mt-2">Active Routes</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Route className="w-7 h-7 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-white rounded-2xl p-5 shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gray-50 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Total Passes</p>
              <p className="text-3xl font-black text-gray-800">{totalPasses}</p>
              <p className="text-xs text-gray-400 mt-2">All Time</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Ticket className="w-7 h-7 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-white rounded-2xl p-5 shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gray-50 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Avg Passes/Route</p>
              <p className="text-3xl font-black text-gray-800">{avgPassesPerRoute}</p>
              <p className="text-xs text-gray-400 mt-2">Per Route</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-7 h-7 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-300">
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <Award className="w-8 h-8 text-yellow-400" />
              <Sparkles className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-gray-300 text-xs font-medium mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-white">₹{totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-2">From all passes</p>
          </div>
        </div>
      </div>

      {/* Route Statistics Section */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Route Statistics</h2>
              <p className="text-sm text-gray-400 mt-0.5">Detailed performance metrics by route</p>
            </div>
          </div>
        </div>
        <DataTable 
          columns={routeColumns} 
          data={data?.routeStats || []} 
          loading={false}
          searchPlaceholder="Search routes..."
        />
      </div>

      {/* Recently Expired Passes Section */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Recently Expired Passes</h2>
              <p className="text-sm text-gray-400 mt-0.5">Passes that have expired in the last 30 days</p>
            </div>
          </div>
        </div>
        <DataTable 
          columns={expiredColumns} 
          data={data?.expiredPasses || []} 
          loading={false}
          searchPlaceholder="Search expired passes..."
        />
      </div>
    </div>
  );
}