import { useState, useEffect } from 'react';
import api from '../services/api';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import { toast } from 'sonner';

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
          <div className="w-12 h-12 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-[#94a3b8]">Loading reports...</p>
        </div>
      </div>
    );
  }

  const routeColumns = [
    { header: 'Route ID', accessor: 'route_id' },
    { header: 'Route Path', accessor: 'route' },
    { header: 'Fare (₹)', cell: (row) => <span className="text-emerald-400">₹{row.fare}</span> },
    { header: 'Total Passes Issued', accessor: 'total_passes' },
    { header: 'Active Passes', cell: (row) => <span className="text-emerald-400 font-semibold">{row.active_passes}</span> },
  ];

  const expiredColumns = [
    { header: 'Pass ID', accessor: 'pass_id' },
    { header: 'Student Name', accessor: 'student_name' },
    { header: 'Department', accessor: 'department' },
    { header: 'Route', accessor: 'route' },
    { header: 'Expiry Date', cell: (row) => new Date(row.expiry_date).toLocaleDateString() },
  ];

  return (
    <div className="space-y-8">
      <PageHeader 
        title="System Reports" 
        subtitle="Detailed statistics of routes performance and status" 
      />

      <div className="bg-[#1e293b] rounded-2xl border border-[#334155] p-6 max-w-sm">
        <h3 className="text-sm font-semibold text-[#94a3b8] uppercase tracking-wider">Unique Active Passengers</h3>
        <p className="text-4xl font-bold text-white mt-2">{data?.activeUsers || 0}</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Route Statistics</h2>
        <DataTable 
          columns={routeColumns} 
          data={data?.routeStats || []} 
          loading={false}
          searchPlaceholder="Search routes..."
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Recently Expired Passes</h2>
        <DataTable 
          columns={expiredColumns} 
          data={data?.expiredPasses || []} 
          loading={false}
          searchPlaceholder="Search expired..."
        />
      </div>
    </div>
  );
}
