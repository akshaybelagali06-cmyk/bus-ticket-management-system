import { useState, useEffect } from 'react';
import api from '../services/api';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function DriversPage() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  const fetchDrivers = () => {
    setLoading(true);
    api.get('/drivers', { params: { search } })
      .then(res => setDrivers(res.data))
      .catch(() => toast.error('Failed to load drivers'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchDrivers(); }, [search]);

  const onSubmit = async (data) => {
    try {
      if (editing) {
        await api.put(`/drivers/${editing.driver_id}`, data);
        toast.success('Driver updated');
      } else {
        await api.post('/drivers', data);
        toast.success('Driver added');
      }
      setModalOpen(false); setEditing(null); reset(); fetchDrivers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this driver?')) return;
    try { await api.delete(`/drivers/${id}`); toast.success('Driver deleted'); fetchDrivers(); }
    catch { toast.error('Delete failed'); }
  };

  const openEdit = (driver) => {
    setEditing(driver);
    setValue('name', driver.name);
    setValue('phone', driver.phone);
    setValue('bus_no', driver.bus_no);
    setModalOpen(true);
  };

const inputClass =
  "w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-black text-sm placeholder-black focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all";

  const columns = [
    { header: 'ID', accessor: 'driver_id' },
    { header: 'Name', cell: (row) => <span className="font-medium text-white">{row.name}</span> },
    { header: 'Phone', accessor: 'phone' },
    { header: 'Bus No', cell: (row) => (
      <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-lg text-xs font-semibold border border-cyan-500/20">{row.bus_no}</span>
    )},
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEdit(row)} className="p-2 rounded-lg text-amber-400 hover:bg-amber-500/10 transition-all"><Edit2 className="w-4 h-4" /></button>
          <button onClick={() => handleDelete(row.driver_id)} className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"><Trash2 className="w-4 h-4" /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Drivers" subtitle="Manage all driver records"
        action={<button onClick={() => { setEditing(null); reset(); setModalOpen(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-700 shadow-lg shadow-cyan-500/20 transition-all"><Plus className="w-4 h-4" /> Add Driver</button>}
      />
      <DataTable columns={columns} data={drivers} searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search drivers..." loading={loading} />

      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); reset(); }} title={editing ? 'Edit Driver' : 'Add Driver'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#94a3b8] mb-2">Full Name</label>
            <input {...register('name', { required: true })} className={inputClass} placeholder="Enter driver name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#94a3b8] mb-2">Phone</label>
            <input {...register('phone', { required: true })} className={inputClass} placeholder="Enter phone number" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#94a3b8] mb-2">Bus Number</label>
            <input {...register('bus_no', { required: true })} className={inputClass} placeholder="Enter bus number" />
          </div>
          <div className="flex gap-3 pt-4">
            <button type="submit" className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg shadow-cyan-500/20">{editing ? 'Update' : 'Add'} Driver</button>
            <button type="button" onClick={() => { setModalOpen(false); reset(); }} className="px-6 py-3 bg-[#0f172a] text-[#94a3b8] rounded-xl hover:text-white transition-all border border-[#334155]">Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
