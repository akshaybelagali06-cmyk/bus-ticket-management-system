import { useState, useEffect } from 'react';
import api from '../services/api';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function RoutesPage() {
  const [routes, setRoutes] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const { register, handleSubmit, reset, setValue } = useForm();

  const fetchRoutes = () => {
    setLoading(true);
    api.get('/routes', { params: { search } })
      .then(res => setRoutes(res.data))
      .catch(() => toast.error('Failed to load routes'))
      .finally(() => setLoading(false));
  };

  const fetchDrivers = () => {
    api.get('/drivers').then(res => setDrivers(res.data)).catch(() => {});
  };

  useEffect(() => { fetchRoutes(); fetchDrivers(); }, [search]);

  const onSubmit = async (data) => {
    try {
      const payload = { ...data, driver_id: data.driver_id || null };
      if (editing) {
        await api.put(`/routes/${editing.route_id}`, payload);
        toast.success('Route updated');
      } else {
        await api.post('/routes', payload);
        toast.success('Route added');
      }
      setModalOpen(false); setEditing(null); reset(); fetchRoutes();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this route?')) return;
    try { await api.delete(`/routes/${id}`); toast.success('Route deleted'); fetchRoutes(); }
    catch { toast.error('Delete failed'); }
  };

  const openEdit = (route) => {
    setEditing(route);
    setValue('source', route.source);
    setValue('destination', route.destination);
    setValue('fare', route.fare);
    setValue('driver_id', route.driver_id || '');
    setValue('bus_no', route.bus_no || '');
    setModalOpen(true);
  };

  const inputClass =
  "w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-black text-sm placeholder-black focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all";

  const columns = [
    { header: 'ID', accessor: 'route_id' },
    { header: 'Route', cell: (row) => (
      <div>
        <span className="font-medium text-white">{row.source}</span>
        <span className="text-cyan-400 mx-2">→</span>
        <span className="font-medium text-white">{row.destination}</span>
      </div>
    )},
    { header: 'Fare', cell: (row) => <span className="text-emerald-400 font-semibold">₹{row.fare}</span> },
    { header: 'Driver', cell: (row) => row.driver_name || <span className="text-[#64748b]">Unassigned</span> },
    { header: 'Bus No', cell: (row) => row.bus_no ? (
      <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-lg text-xs font-semibold border border-cyan-500/20">{row.bus_no}</span>
    ) : <span className="text-[#64748b]">—</span> },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEdit(row)} className="p-2 rounded-lg text-amber-400 hover:bg-amber-500/10 transition-all"><Edit2 className="w-4 h-4" /></button>
          <button onClick={() => handleDelete(row.route_id)} className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"><Trash2 className="w-4 h-4" /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Routes" subtitle="Manage bus routes and fares"
        action={<button onClick={() => { setEditing(null); reset(); setModalOpen(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-700 shadow-lg shadow-cyan-500/20 transition-all"><Plus className="w-4 h-4" /> Add Route</button>}
      />
      <DataTable columns={columns} data={routes} searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search routes..." loading={loading} />

      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); reset(); }} title={editing ? 'Edit Route' : 'Add Route'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#94a3b8] mb-2">Source</label>
            <input {...register('source', { required: true })} className={inputClass} placeholder="e.g. City Center" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#94a3b8] mb-2">Destination</label>
            <input {...register('destination', { required: true })} className={inputClass} placeholder="e.g. University Campus" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#94a3b8] mb-2">Fare (₹)</label>
            <input type="number" step="0.01" {...register('fare', { required: true })} className={inputClass} placeholder="Enter fare amount" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#94a3b8] mb-2">Bus Number</label>
            <input {...register('bus_no')} className={inputClass} placeholder="e.g. KA-01-F-1234" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#94a3b8] mb-2">Assign Driver</label>
            <select {...register('driver_id')} className={inputClass}>
              <option value="">No Driver Assigned</option>
              {drivers.map(d => <option key={d.driver_id} value={d.driver_id}>{d.name} - {d.bus_no}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="submit" className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg shadow-cyan-500/20">{editing ? 'Update' : 'Add'} Route</button>
            <button type="button" onClick={() => { setModalOpen(false); reset(); }} className="px-6 py-3 bg-[#0f172a] text-[#94a3b8] rounded-xl hover:text-white transition-all border border-[#334155]">Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
