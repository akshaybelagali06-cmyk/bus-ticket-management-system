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
  MapPin, 
  DollarSign, 
  Bus, 
  User,
  Route,
  TrendingUp,
  Award,
  Sparkles,
  Hash,
  Navigation,
  Flag
} from 'lucide-react';

export default function RoutesPage() {
  const [routes, setRoutes] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const { register, handleSubmit, reset, setValue } = useForm();

  const debounceRef = useRef(null);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [search]);

  // Fetch drivers once on mount
  useEffect(() => {
    api.get('/drivers')
      .then(res => setDrivers(res.data))
      .catch(() => {});
  }, []);

  // Initial load with spinner
  useEffect(() => {
    setLoading(true);
    api.get('/routes', { params: { search: '' } })
      .then(res => setRoutes(res.data))
      .catch(() => toast.error('Failed to load routes'))
      .finally(() => setLoading(false));
  }, []);

  // Search — no spinner, no remount
  useEffect(() => {
    if (debouncedSearch === '') return;
    api.get('/routes', { params: { search: debouncedSearch } })
      .then(res => setRoutes(res.data))
      .catch(() => toast.error('Failed to load routes'));
  }, [debouncedSearch]);

  const fetchRoutes = useCallback(() => {
    api.get('/routes', { params: { search: '' } })
      .then(res => setRoutes(res.data))
      .catch(() => toast.error('Failed to load routes'));
  }, []);

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
      setModalOpen(false);
      setEditing(null);
      reset();
      fetchRoutes();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = useCallback(async (id) => {
    if (!confirm('Delete this route?')) return;
    try {
      await api.delete(`/routes/${id}`);
      toast.success('Route deleted');
      fetchRoutes();
    } catch {
      toast.error('Delete failed');
    }
  }, [fetchRoutes]);

  const openEdit = useCallback((route) => {
    setEditing(route);
    setValue('source', route.source);
    setValue('destination', route.destination);
    setValue('fare', route.fare);
    setValue('driver_id', route.driver_id || '');
    setValue('bus_no', route.bus_no || '');
    setModalOpen(true);
  }, [setValue]);

  const openAdd = useCallback(() => {
    setEditing(null);
    reset();
    setModalOpen(true);
  }, [reset]);

  const inputClass = "w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all duration-200";
  const selectClass = "w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all duration-200 [&>option:first-child]:text-gray-400";

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
      accessor: 'route_id',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Hash className="w-3.5 h-3.5 text-gray-400" />
          <span className="font-mono text-sm font-semibold text-gray-700">{row.route_id}</span>
        </div>
      )
    },
    { 
      header: 'Route', 
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getRandomGradient(row.source)} flex items-center justify-center text-white text-sm font-bold shadow-md`}>
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-800">{row.source}</span>
              <span className="text-gray-400">→</span>
              <span className="font-bold text-gray-800">{row.destination}</span>
            </div>
            <p className="text-xs text-gray-400">Route Path</p>
          </div>
        </div>
      )
    },
    { 
      header: 'Fare', 
      cell: (row) => (
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-gray-400" />
          <span className="font-bold text-gray-800 text-lg">₹{row.fare}</span>
        </div>
      )
    },
    { 
      header: 'Driver', 
      cell: (row) => (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-400" />
          <span className="text-gray-700 font-medium">{row.driver_name || 'Unassigned'}</span>
        </div>
      )
    },
    { 
      header: 'Bus Number', 
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Bus className="w-4 h-4 text-gray-400" />
          {row.bus_no ? (
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-mono font-semibold">
              {row.bus_no}
            </span>
          ) : (
            <span className="text-gray-400">—</span>
          )}
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
            title="Edit Route"
          >
            <Edit2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </button>
          <button
            onClick={() => handleDelete(row.route_id)}
            className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200 group"
            title="Delete Route"
          >
            <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      ),
    },
  ], [openEdit, handleDelete]);

  // Calculate statistics
  const totalRoutes = routes.length;
  const totalDriversAssigned = routes.filter(r => r.driver_name).length;
  const totalFareSum = routes.reduce((sum, r) => sum + parseFloat(r.fare || 0), 0);
  const avgFare = totalRoutes > 0 ? (totalFareSum / totalRoutes).toFixed(2) : 0;

  return (
    <div className="space-y-6">
      {/* Modern Gradient Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-6 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Route className="w-5 h-5 text-yellow-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-300">Route Management</span>
              </div>
              <h1 className="text-3xl font-bold mb-2">Bus Routes</h1>
              <p className="text-gray-300 text-sm">Manage and organize all bus routes and fares</p>
            </div>
            <button
              onClick={openAdd}
              className="flex items-center gap-2 px-6 py-3 bg-white text-gray-900 text-sm font-bold rounded-xl hover:bg-gray-100 shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="w-4 h-4" /> Add New Route
            </button>
          </div>
        </div>
      </div>
      
      {/* Premium Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="group relative overflow-hidden bg-white rounded-2xl p-5 shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gray-50 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Total Routes</p>
              <p className="text-3xl font-black text-gray-800">{totalRoutes}</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-3 h-3 text-green-500" />
                <span className="text-xs text-green-600 font-medium">Active Routes</span>
              </div>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform">
              <MapPin className="w-7 h-7 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-white rounded-2xl p-5 shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gray-50 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Assigned Drivers</p>
              <p className="text-3xl font-black text-gray-800">{totalDriversAssigned}</p>
              <p className="text-xs text-gray-400 mt-2">Out of {totalRoutes} routes</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform">
              <User className="w-7 h-7 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-white rounded-2xl p-5 shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gray-50 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Average Fare</p>
              <p className="text-3xl font-black text-gray-800">₹{avgFare}</p>
              <p className="text-xs text-gray-400 mt-2">Per route</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform">
              <DollarSign className="w-7 h-7 text-gray-600" />
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
            <p className="text-2xl font-bold text-white">₹{totalFareSum}</p>
            <p className="text-xs text-gray-400 mt-2">From all routes</p>
          </div>
        </div>
      </div>

      {/* Search & Table Section */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-800">Route Records</h2>
              <p className="text-sm text-gray-400 mt-1">Manage and track all bus route information</p>
            </div>
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search routes by source, destination or bus number..."
                className="w-full md:w-80 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 outline-none focus:bg-white focus:border-gray-300 transition-all"
              />
            </div>
          </div>
        </div>
        
        <DataTable
          columns={columns}
          data={routes}
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
              {editing ? <Edit2 className="w-5 h-5 text-gray-600" /> : <Route className="w-5 h-5 text-gray-600" />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{editing ? 'Edit Route' : 'Add New Route'}</h2>
              <p className="text-xs text-gray-400 mt-0.5">{editing ? 'Update route information' : 'Enter route details below'}</p>
            </div>
          </div>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Source</label>
            <input {...register('source', { required: true })} className={inputClass} placeholder="e.g. City Center" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Destination</label>
            <input {...register('destination', { required: true })} className={inputClass} placeholder="e.g. University Campus" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Fare (₹)</label>
            <input type="number" step="0.01" {...register('fare', { required: true })} className={inputClass} placeholder="Enter fare amount" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Bus Number</label>
            <input {...register('bus_no')} className={inputClass} placeholder="e.g. KA-01-F-1234" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Assign Driver</label>
            <select {...register('driver_id')} className={selectClass}>
              <option value="">No Driver Assigned</option>
              {drivers.map(d => (
                <option key={d.driver_id} value={d.driver_id}>{d.name} - {d.bus_no}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all duration-200 shadow-md"
            >
              {editing ? 'Update Route' : 'Add Route'}
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