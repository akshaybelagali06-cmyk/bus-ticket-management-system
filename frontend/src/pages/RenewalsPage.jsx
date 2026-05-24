import { useState, useEffect } from 'react';
import api from '../services/api';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import { toast } from 'sonner';

export default function RenewalsPage() {
  const [renewals, setRenewals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRenewals = () => {
    setLoading(true);
    api.get('/renewals')
      .then(res => setRenewals(res.data))
      .catch(() => toast.error('Failed to load renewals'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRenewals();
  }, []);

  const columns = [
    { header: 'Renewal ID', accessor: 'renewal_id' },
    { header: 'Pass ID', accessor: 'pass_id' },
    { header: 'Student Name', cell: (row) => <span className="font-medium text-white">{row.student_name}</span> },
    { header: 'Route', cell: (row) => <span>{row.source} → {row.destination}</span> },
    { header: 'Pass Type', cell: (row) => (
      <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded text-xs font-semibold border border-purple-500/20">{row.pass_type}</span>
    )},
    { header: 'Renewal Date', cell: (row) => new Date(row.renewal_date).toLocaleDateString() },
    { header: 'Amount Paid', cell: (row) => <span className="text-emerald-400 font-semibold">₹{row.amount}</span> },
  ];

  return (
    <div>
      <PageHeader 
        title="Pass Renewals" 
        subtitle="View all transaction history of bus pass renewals" 
      />
      <DataTable 
        columns={columns} 
        data={renewals} 
        loading={loading}
        searchPlaceholder="Renewals list..."
      />
    </div>
  );
}
