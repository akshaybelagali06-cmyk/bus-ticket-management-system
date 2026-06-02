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
  Eye,
  Ticket, 
  User, 
  Route, 
  Calendar,
  TrendingUp,
  Award,
  Sparkles,
  Hash,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

export default function PassesPage() {
  const [passes, setPasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewPass, setViewPass] = useState(null);
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

  // Fetch students and routes for dropdowns
  useEffect(() => {
    Promise.all([
      api.get('/students'),
      api.get('/routes')
    ]).then(([studentsRes, routesRes]) => {
      setStudents(studentsRes.data || []);
      setRoutes(routesRes.data || []);
    }).catch(() => {
      setStudents([]);
      setRoutes([]);
    });
  }, []);

  // Initial load
  useEffect(() => {
    setLoading(true);
    api.get('/passes', { params: { search: '' } })
      .then(res => setPasses(res.data || []))
      .catch(() => toast.error('Failed to load passes'))
      .finally(() => setLoading(false));
  }, []);

  // Search
  useEffect(() => {
    if (debouncedSearch === '') return;
    api.get('/passes', { params: { search: debouncedSearch } })
      .then(res => setPasses(res.data || []))
      .catch(() => toast.error('Failed to load passes'));
  }, [debouncedSearch]);

  const fetchPasses = useCallback(() => {
    api.get('/passes', { params: { search: '' } })
      .then(res => setPasses(res.data || []))
      .catch(() => toast.error('Failed to load passes'));
  }, []);

  const onSubmit = async (data) => {
    try {
      if (editing) {
        await api.put(`/passes/${editing.pass_id}`, data);
        toast.success('Bus pass updated');
      } else {
        await api.post('/passes', data);
        toast.success('Bus pass added');
      }
      setModalOpen(false);
      setEditing(null);
      reset();
      fetchPasses();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = useCallback(async (id) => {
    if (!confirm('Delete this bus pass?')) return;
    try {
      await api.delete(`/passes/${id}`);
      toast.success('Bus pass deleted');
      fetchPasses();
    } catch {
      toast.error('Delete failed');
    }
  }, [fetchPasses]);

  const openEdit = useCallback((pass) => {
    setEditing(pass);
    setValue('student_id', pass.student_id);
    setValue('route_id', pass.route_id);
    setValue('valid_from', pass.valid_from?.split('T')[0]);
    setValue('valid_until', pass.valid_until?.split('T')[0]);
    setModalOpen(true);
  }, [setValue]);

  const openAdd = useCallback(() => {
    setEditing(null);
    reset();
    setModalOpen(true);
  }, [reset]);

  const inputClass = "w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all duration-200";
  const selectClass = "w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all duration-200";

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
      accessor: 'pass_id',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Hash className="w-3.5 h-3.5 text-gray-400" />
          <span className="font-mono text-sm font-semibold text-gray-700">#{row.pass_id}</span>
        </div>
      )
    },
    { 
      header: 'Student', 
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getRandomGradient(row.student_name)} flex items-center justify-center text-white text-sm font-bold shadow-md`}>
            {row.student_name?.charAt(0).toUpperCase() || '?'}
          </div>
          <div>
            <p className="font-bold text-gray-800">{row.student_name}</p>
            <p className="text-xs text-gray-400">Student</p>
          </div>
        </div>
      )
    },
    { 
      header: 'Route', 
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Route className="w-4 h-4 text-gray-400" />
          <span className="text-gray-700 font-medium">{row.source} → {row.destination}</span>
        </div>
      )
    },
    { 
      header: 'Valid From', 
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600 text-sm">{new Date(row.valid_from).toLocaleDateString()}</span>
        </div>
      )
    },
    { 
      header: 'Valid Until', 
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600 text-sm">{new Date(row.valid_until).toLocaleDateString()}</span>
        </div>
      )
    },
    {
      header: 'Status',
      cell: (row) => {
        const today = new Date();
        const validUntil = new Date(row.valid_until);
        const isValid = validUntil >= today;
        return (
          <div className="flex items-center gap-2">
            {isValid ? (
              <CheckCircle className="w-4 h-4 text-emerald-500" />
            ) : (
              <XCircle className="w-4 h-4 text-red-500" />
            )}
            <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${isValid ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
              {isValid ? 'Active' : 'Expired'}
            </span>
          </div>
        );
      }
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewPass(row)}
            className="p-2.5 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-200 group"
            title="View Details"
          >
            <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </button>
          <button
            onClick={() => openEdit(row)}
            className="p-2.5 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-100 transition-all duration-200 group"
            title="Edit Pass"
          >
            <Edit2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </button>
          <button
            onClick={() => handleDelete(row.pass_id)}
            className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200 group"
            title="Delete Pass"
          >
            <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      ),
    },
  ], [openEdit, handleDelete]);

  // Calculate statistics
  const totalPasses = passes.length;
  const activePasses = passes.filter(p => new Date(p.valid_until) >= new Date()).length;
  const expiredPasses = totalPasses - activePasses;
  const renewalRate = totalPasses > 0 ? ((activePasses / totalPasses) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      {/* Modern Gradient Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-6 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Ticket className="w-5 h-5 text-yellow-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-300">Pass Management</span>
              </div>
              <h1 className="text-3xl font-bold mb-2">Bus Passes</h1>
              <p className="text-gray-300 text-sm">Manage and track all student bus passes</p>
            </div>
            <button
              onClick={openAdd}
              className="flex items-center gap-2 px-6 py-3 bg-white text-gray-900 text-sm font-bold rounded-xl hover:bg-gray-100 shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="w-4 h-4" /> Add New Pass
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
              <p className="text-gray-400 text-sm font-medium mb-1">Total Passes</p>
              <p className="text-3xl font-black text-gray-800">{totalPasses}</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-3 h-3 text-green-500" />
                <span className="text-xs text-green-600 font-medium">All Time</span>
              </div>
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
              <p className="text-gray-400 text-sm font-medium mb-1">Active Passes</p>
              <p className="text-3xl font-black text-emerald-600">{activePasses}</p>
              <p className="text-xs text-gray-400 mt-2">Currently Valid</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle className="w-7 h-7 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-white rounded-2xl p-5 shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gray-50 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Expired Passes</p>
              <p className="text-3xl font-black text-red-600">{expiredPasses}</p>
              <p className="text-xs text-gray-400 mt-2">Need Renewal</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center group-hover:scale-110 transition-transform">
              <XCircle className="w-7 h-7 text-red-600" />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-300">
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <Award className="w-8 h-8 text-yellow-400" />
              <Sparkles className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-gray-300 text-xs font-medium mb-1">Renewal Rate</p>
            <p className="text-2xl font-bold text-white">{renewalRate}%</p>
            <p className="text-xs text-gray-400 mt-2">Active vs Total</p>
          </div>
        </div>
      </div>

      {/* Search & Table Section */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-800">Pass Records</h2>
              <p className="text-sm text-gray-400 mt-1">Manage and track all bus pass information</p>
            </div>
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search passes by student or route..."
                className="w-full md:w-80 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 outline-none focus:bg-white focus:border-gray-300 transition-all"
              />
            </div>
          </div>
        </div>
        
        <DataTable
          columns={columns}
          data={passes}
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
              {editing ? <Edit2 className="w-5 h-5 text-gray-600" /> : <Ticket className="w-5 h-5 text-gray-600" />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{editing ? 'Edit Bus Pass' : 'Add New Bus Pass'}</h2>
              <p className="text-xs text-gray-400 mt-0.5">{editing ? 'Update pass information' : 'Enter pass details below'}</p>
            </div>
          </div>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Student</label>
            <select {...register('student_id', { required: true })} className={selectClass}>
              <option value="">Select Student</option>
              {students.map(s => (
                <option key={s.student_id} value={s.student_id}>{s.name} - {s.department}</option>
              ))}
            </select>
            {errors.student_id && <span className="text-red-500 text-xs mt-1">Student is required</span>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Route</label>
            <select {...register('route_id', { required: true })} className={selectClass}>
              <option value="">Select Route</option>
              {routes.map(r => (
                <option key={r.route_id} value={r.route_id}>{r.source} → {r.destination} (₹{r.fare})</option>
              ))}
            </select>
            {errors.route_id && <span className="text-red-500 text-xs mt-1">Route is required</span>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Valid From</label>
            <input type="date" {...register('valid_from', { required: true })} className={inputClass} />
            {errors.valid_from && <span className="text-red-500 text-xs mt-1">Valid from date is required</span>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Valid Until</label>
            <input type="date" {...register('valid_until', { required: true })} className={inputClass} />
            {errors.valid_until && <span className="text-red-500 text-xs mt-1">Valid until date is required</span>}
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all duration-200 shadow-md"
            >
              {editing ? 'Update Pass' : 'Add Pass'}
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

      {/* View Modal */}
      <Modal isOpen={!!viewPass} onClose={() => setViewPass(null)} title="Bus Pass Details">
        {viewPass && (
          <div className="space-y-5">
            {/* Pass Header */}
            <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                <Ticket className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Bus Pass #{viewPass.pass_id}</h3>
                <p className="text-gray-500 text-sm">Student Transportation Pass</p>
              </div>
            </div>
            
            {/* Details */}
            {[
              ['Student', viewPass.student_name],
              ['Route', `${viewPass.source} → ${viewPass.destination}`],
              ['Fare', `₹${viewPass.fare}`],
              ['Valid From', new Date(viewPass.valid_from).toLocaleDateString()],
              ['Valid Until', new Date(viewPass.valid_until).toLocaleDateString()],
              ['Status', new Date(viewPass.valid_until) >= new Date() ? 'Active' : 'Expired'],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-500">{label}</span>
                <span className="text-sm font-semibold text-gray-800">{value}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}