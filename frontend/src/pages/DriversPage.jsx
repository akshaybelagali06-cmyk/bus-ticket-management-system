import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import api from '../services/api';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Truck, 
  Phone, 
  Bus,
  TrendingUp,
  Award,
  Sparkles,
  Hash,
  User,
  Users
} from 'lucide-react';

export default function DriversPage() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  const debounceRef = useRef(null);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [search]);

  // Initial load
  useEffect(() => {
    setLoading(true);
    api.get('/drivers', { params: { search: '' } })
      .then(res => setDrivers(res.data || []))
      .catch(() => toast.error('Failed to load drivers'))
      .finally(() => setLoading(false));
  }, []);

  // Search — no loading spinner, no remount
  useEffect(() => {
    if (debouncedSearch === '') return;
    api.get('/drivers', { params: { search: debouncedSearch } })
      .then(res => setDrivers(res.data || []))
      .catch(() => toast.error('Failed to load drivers'));
  }, [debouncedSearch]);

  const fetchDrivers = useCallback(() => {
    api.get('/drivers', { params: { search: '' } })
      .then(res => setDrivers(res.data || []))
      .catch(() => toast.error('Failed to load drivers'));
  }, []);

  const onSubmit = async (data) => {
    try {
      if (editing) {
        await api.put(`/drivers/${editing.driver_id}`, data);
        toast.success('Driver updated');
      } else {
        await api.post('/drivers', data);
        toast.success('Driver added');
      }
      setModalOpen(false);
      setEditing(null);
      reset();
      fetchDrivers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = useCallback(async (id) => {
    if (!confirm('Delete this driver?')) return;
    try {
      await api.delete(`/drivers/${id}`);
      toast.success('Driver deleted');
      fetchDrivers();
    } catch {
      toast.error('Delete failed');
    }
  }, [fetchDrivers]);

  const openEdit = useCallback((driver) => {
    setEditing(driver);
    setValue('name', driver.name);
    setValue('phone', driver.phone);
    setValue('bus_no', driver.bus_no);
    setModalOpen(true);
  }, [setValue]);

  const openAdd = useCallback(() => {
    setEditing(null);
    reset();
    setModalOpen(true);
  }, [reset]);

  const inputClass = "w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all duration-200";

  const getRandomGradient = (name) => {
    const gradients = [
      'from-gray-700 to-gray-900',
      'from-gray-600 to-gray-800',
      'from-gray-800 to-gray-900',
      'from-stone-700 to-stone-900',
      'from-neutral-700 to-neutral-900',
    ];
    const index = name ? name.charCodeAt(0) % gradients.length : 0;
    return gradients[index];
  };

  const columns = useMemo(() => [
    { 
      header: 'ID', 
      accessor: 'driver_id',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Hash className="w-3.5 h-3.5 text-gray-400" />
          <span className="font-mono text-sm font-semibold text-gray-700">#{row.driver_id}</span>
        </div>
      )
    },
    { 
      header: 'Driver', 
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getRandomGradient(row.name)} flex items-center justify-center text-white text-sm font-bold shadow-md`}>
            {row.name?.charAt(0).toUpperCase() || '?'}
          </div>
          <div>
            <p className="font-bold text-gray-800">{row.name}</p>
            <p className="text-xs text-gray-400">Driver</p>
          </div>
        </div>
      )
    },
    { 
      header: 'Phone', 
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600 font-mono text-sm">{row.phone}</span>
        </div>
      )
    },
    { 
      header: 'Bus Number', 
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Bus className="w-4 h-4 text-gray-400" />
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-mono font-semibold">
            {row.bus_no}
          </span>
        </div>
      )
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openEdit(row)}
            className="p-2.5 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-100 transition-all duration-200 group"
            title="Edit Driver"
          >
            <Edit2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </button>
          <button
            onClick={() => handleDelete(row.driver_id)}
            className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200 group"
            title="Delete Driver"
          >
            <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      ),
    },
  ], [openEdit, handleDelete]);

  // Calculate statistics
  const totalDrivers = drivers.length;
  const totalBuses = [...new Set(drivers.map(d => d.bus_no))].length;
  const activeDrivers = drivers.length; // All drivers considered active

  return (
    <div className="space-y-6">
      {/* Modern Gradient Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-6 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Truck className="w-5 h-5 text-yellow-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-300">Driver Management</span>
              </div>
              <h1 className="text-3xl font-bold mb-2">Drivers</h1>
              <p className="text-gray-300 text-sm">Manage and track all driver records</p>
            </div>
            <button
              onClick={openAdd}
              className="flex items-center gap-2 px-6 py-3 bg-white text-gray-900 text-sm font-bold rounded-xl hover:bg-gray-100 shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="w-4 h-4" /> Add New Driver
            </button>
          </div>
        </div>
      </div>
      
      {/* Premium Stats Cards - 3 cards only */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="group relative overflow-hidden bg-white rounded-2xl p-5 shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gray-50 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Total Drivers</p>
              <p className="text-3xl font-black text-gray-800">{totalDrivers}</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-3 h-3 text-green-500" />
                <span className="text-xs text-green-600 font-medium">Active Fleet</span>
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
              <p className="text-gray-400 text-sm font-medium mb-1">Active Drivers</p>
              <p className="text-3xl font-black text-emerald-600">{activeDrivers}</p>
              <p className="text-xs text-gray-400 mt-2">Currently Working</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center group-hover:scale-110 transition-transform">
              <User className="w-7 h-7 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-white rounded-2xl p-5 shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gray-50 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Total Buses</p>
              <p className="text-3xl font-black text-gray-800">{totalBuses}</p>
              <p className="text-xs text-gray-400 mt-2">Assigned Vehicles</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Bus className="w-7 h-7 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search & Table Section */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-800">Driver Records</h2>
              <p className="text-sm text-gray-400 mt-1">Manage and track all driver information</p>
            </div>
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search drivers by name, phone or bus number..."
                className="w-full md:w-80 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 outline-none focus:bg-white focus:border-gray-300 transition-all"
              />
            </div>
          </div>
        </div>
        
        <DataTable
          columns={columns}
          data={drivers}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder=""
          loading={loading}
        />
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); reset(); }}
        title={
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
              {editing ? <Edit2 className="w-5 h-5 text-gray-600" /> : <Truck className="w-5 h-5 text-gray-600" />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{editing ? 'Edit Driver' : 'Add New Driver'}</h2>
              <p className="text-xs text-gray-400 mt-0.5">{editing ? 'Update driver information' : 'Enter driver details below'}</p>
            </div>
          </div>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
            <input {...register('name', { required: true })} className={inputClass} placeholder="Enter driver's full name" />
            {errors.name && <span className="text-red-500 text-xs mt-1">Name is required</span>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
            <input {...register('phone', { required: true })} className={inputClass} placeholder="Enter phone number" />
            {errors.phone && <span className="text-red-500 text-xs mt-1">Phone is required</span>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Bus Number</label>
            <input {...register('bus_no', { required: true })} className={inputClass} placeholder="Enter bus number (e.g., KA-01-EF-0099)" />
            {errors.bus_no && <span className="text-red-500 text-xs mt-1">Bus number is required</span>}
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all duration-200 shadow-md"
            >
              {editing ? 'Update Driver' : 'Add Driver'}
            </button>
            <button
              type="button"
              onClick={() => { setModalOpen(false); reset(); }}
              className="px-6 py-3 bg-gray-100 text-gray-600 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}