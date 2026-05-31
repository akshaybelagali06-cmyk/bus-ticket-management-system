import { useState, useEffect } from 'react';
import api from '../services/api';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Plus, XCircle, Eye } from 'lucide-react';

const statusColors = {
  Active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Expired: 'bg-red-500/10 text-red-400 border-red-500/20',
  Cancelled: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
};

export default function PassesPage() {
  const [passes, setPasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [viewPass, setViewPass] = useState(null);
  const { register, handleSubmit, reset } = useForm();

  const fetchPasses = () => {
    setLoading(true);
    api.get('/passes', { params: { search, status: statusFilter } })
      .then(res => setPasses(res.data))
      .catch(() => toast.error('Failed to load passes'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    api.get('/students').then(res => setStudents(res.data)).catch(() => {});
    api.get('/routes').then(res => setRoutes(res.data)).catch(() => {});
  }, []);

  useEffect(() => { fetchPasses(); }, [search, statusFilter]);

  const onSubmit = async (data) => {
    try {
      await api.post('/passes', data);
      toast.success('Pass issued successfully');
      setModalOpen(false); reset(); fetchPasses();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to issue pass');
    }
  };

  const handleCancel = async (id) => {
    if (!confirm('Cancel this pass?')) return;
    try {
      await api.put(`/passes/${id}`, { status: 'Cancelled' });
      toast.success('Pass cancelled');
      fetchPasses();
    } catch { toast.error('Failed to cancel pass'); }
  };
  const inputClass =
  "w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-black text-sm placeholder-black focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all";

  const columns = [
    { header: 'Pass ID', accessor: 'pass_id' },
    { header: 'Student', cell: (row) => <span className="font-medium text-black">{row.student_name}</span> },
    { header: 'Type', cell: (row) => (
      <span className="px-3 py-1 bg-purple-500/10 text-green-400 rounded-lg text-xs font-semibold border border-blue-500/20">{row.pass_type}</span>
    )},
    { header: 'Route', cell: (row) => <span className="text-sm">{row.source} → {row.destination}</span> },
    { header: 'Expiry', cell: (row) => new Date(row.expiry_date).toLocaleDateString() },
    { header: 'Status', cell: (row) => (
      <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${statusColors[row.status]}`}>{row.status}</span>
    )},
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => setViewPass(row)} className="p-2 rounded-lg text-cyan-400 hover:bg-cyan-500/10 transition-all"><Eye className="w-4 h-4" /></button>
          {row.status === 'Active' && (
            <button onClick={() => handleCancel(row.pass_id)} className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-all" title="Cancel"><XCircle className="w-4 h-4" /></button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Bus Passes" subtitle="Issue and manage bus passes"
        action={<button onClick={() => { reset(); setModalOpen(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-700 shadow-lg shadow-cyan-500/20 transition-all"><Plus className="w-4 h-4" /> Issue Pass</button>}
      />
      <DataTable
        columns={columns} data={passes} searchValue={search} onSearchChange={setSearch}
        searchPlaceholder="Search by student or pass ID..." loading={loading}
        filters={
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-[#0f172a] border border-[#334155] rounded-xl text-sm text-white outline-none focus:border-cyan-500/50">
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Expired">Expired</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        }
      />

      {/* Issue Pass Modal */}
      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); reset(); }} title="Issue New Pass" size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#94a3b8] mb-2">Student</label>
              <select {...register('student_id', { required: true })} className={inputClass}>
                <option value="">Select Student</option>
                {students.map(s => <option key={s.student_id} value={s.student_id}>{s.name} - {s.department}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#94a3b8] mb-2">Route</label>
              <select {...register('route_id', { required: true })} className={inputClass}>
                <option value="">Select Route</option>
                {routes.map(r => <option key={r.route_id} value={r.route_id}>{r.source} → {r.destination} (₹{r.fare})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#94a3b8] mb-2">Pass Type</label>
              <select {...register('pass_type', { required: true })} className={inputClass}>
                <option value="">Select Type</option>
                <option value="Daily">Daily</option>
                <option value="Monthly">Monthly</option>
                <option value="Semester">Semester</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#94a3b8] mb-2">Issue Date</label>
              <input type="date" {...register('issue_date', { required: true })} className={inputClass} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#94a3b8] mb-2">Expiry Date</label>
              <input type="date" {...register('expiry_date', { required: true })} className={inputClass} />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="submit" className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg shadow-cyan-500/20">Issue Pass</button>
            <button type="button" onClick={() => setModalOpen(false)} className="px-6 py-3 bg-[#0f172a] text-[#94a3b8] rounded-xl hover:text-white transition-all border border-[#334155]">Cancel</button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={!!viewPass} onClose={() => setViewPass(null)} title="Pass Details">
        {viewPass && (
          <div className="space-y-3">
            {[
              ['Pass ID', viewPass.pass_id],
              ['Student', viewPass.student_name],
              ['Department', viewPass.department],
              ['Type', viewPass.pass_type],
              ['Route', `${viewPass.source} → ${viewPass.destination}`],
              ['Fare', `₹${viewPass.fare}`],
              ['Issue Date', new Date(viewPass.issue_date).toLocaleDateString()],
              ['Expiry Date', new Date(viewPass.expiry_date).toLocaleDateString()],
              ['Status', viewPass.status],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between items-center py-3 border-b border-[#334155]/50">
                <span className="text-sm text-[#64748b]">{label}</span>
                <span className={`text-sm font-medium ${label === 'Status' ? (statusColors[value]?.includes('emerald') ? 'text-emerald-400' : statusColors[value]?.includes('red') ? 'text-red-400' : 'text-gray-400') : 'text-white'}`}>{value}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}

