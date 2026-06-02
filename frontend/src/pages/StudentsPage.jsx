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
  Users, 
  Building2, 
  Phone, 
  GraduationCap,
  Calendar,
  Sparkles,
  TrendingUp,
  UserPlus,
  Award,
  Hash
} from 'lucide-react';

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
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

  const fetchStudents = useCallback((isInitial = false) => {
    if (isInitial) setLoading(true);
    api.get('/students', { params: { search: debouncedSearch } })
      .then(res => setStudents(res.data))
      .catch(() => toast.error('Failed to load students'))
      .finally(() => { if (isInitial) setLoading(false); });
  }, [debouncedSearch]);

  useEffect(() => {
    const isInitial = debouncedSearch === '' && students.length === 0;
    fetchStudents(isInitial);
  }, [debouncedSearch, fetchStudents, students.length]);

  useEffect(() => {
    setLoading(true);
    api.get('/students', { params: { search: '' } })
      .then(res => setStudents(res.data))
      .catch(() => toast.error('Failed to load students'))
      .finally(() => setLoading(false));
  }, []);

  const onSubmit = async (data) => {
    try {
      if (editing) {
        await api.put(`/students/${editing.student_id}`, data);
        toast.success('Student updated successfully');
      } else {
        await api.post('/students', data);
        toast.success('Student added successfully');
      }
      setModalOpen(false);
      setEditing(null);
      reset();
      fetchStudents(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = useCallback(async (id) => {
    if (!confirm('Are you sure you want to delete this student?')) return;
    try {
      await api.delete(`/students/${id}`);
      toast.success('Student deleted');
      fetchStudents(false);
    } catch {
      toast.error('Delete failed');
    }
  }, [fetchStudents]);

  const openEdit = useCallback((student) => {
    setEditing(student);
    setValue('name', student.name);
    setValue('department', student.department);
    setValue('year', student.year);
    setValue('phone', student.phone);
    setModalOpen(true);
  }, [setValue]);

  const openAdd = useCallback(() => {
    setEditing(null);
    reset();
    setModalOpen(true);
  }, [reset]);

  const inputClass = "w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all duration-200";
  const selectClass = "w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all duration-200 [&>option:first-child]:text-gray-400";

  const getYearSuffix = (year) => {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const v = year % 100;
    return year + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
  };

  const getDepartmentColor = (dept) => {
    const colors = {
      'Computer Science': 'bg-gray-100 text-gray-700',
      'Electronics': 'bg-gray-100 text-gray-700',
      'Mechanical': 'bg-gray-100 text-gray-700',
      'Civil': 'bg-gray-100 text-gray-700',
      'Electrical': 'bg-gray-100 text-gray-700',
      'Information Science': 'bg-gray-100 text-gray-700',
    };
    return colors[dept] || 'bg-gray-100 text-gray-700';
  };

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
      accessor: 'student_id',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Hash className="w-3.5 h-3.5 text-gray-400" />
          <span className="font-mono text-sm font-semibold text-gray-700">{row.student_id}</span>
        </div>
      )
    },
    { 
      header: 'Student', 
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getRandomGradient(row.name)} flex items-center justify-center text-white text-sm font-bold shadow-md`}>
            {row.name?.charAt(0).toUpperCase() || '?'}
          </div>
          <div>
            <p className="font-bold text-gray-800">{row.name}</p>
            <p className="text-xs text-gray-400">Student</p>
          </div>
        </div>
      ) 
    },
    { 
      header: 'Department', 
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-gray-400" />
          <span className={`px-3 py-1 rounded-lg text-xs font-medium ${getDepartmentColor(row.department)}`}>
            {row.department}
          </span>
        </div>
      )
    },
    { 
      header: 'Year', 
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-gray-700 font-semibold">{getYearSuffix(parseInt(row.year))}</span>
        </div>
      )
    },
    { 
      header: 'Contact', 
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600 font-mono text-sm">{row.phone}</span>
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
            title="Edit Student"
          >
            <Edit2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </button>
          <button
            onClick={() => handleDelete(row.student_id)}
            className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200 group"
            title="Delete Student"
          >
            <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      ),
    },
  ], [openEdit, handleDelete]);

  const totalStudents = students.length;
  const totalDepartments = [...new Set(students.map(s => s.department))].length;
  const totalYears = [...new Set(students.map(s => s.year))].length;

  return (
    <div className="space-y-6">
      {/* Modern Gradient Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-6 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-300">Student Management</span>
              </div>
              <h1 className="text-3xl font-bold mb-2">Student Directory</h1>
              <p className="text-gray-300 text-sm">Manage and organize all student records efficiently</p>
            </div>
            <button
              onClick={openAdd}
              className="flex items-center gap-2 px-6 py-3 bg-white text-gray-900 text-sm font-bold rounded-xl hover:bg-gray-100 shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              <UserPlus className="w-4 h-4" /> Add New Student
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
              <p className="text-gray-400 text-sm font-medium mb-1">Total Students</p>
              <p className="text-3xl font-black text-gray-800">{totalStudents}</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-3 h-3 text-green-500" />
                <span className="text-xs text-green-600 font-medium">Active</span>
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
              <p className="text-gray-400 text-sm font-medium mb-1">Departments</p>
              <p className="text-3xl font-black text-gray-800">{totalDepartments}</p>
              <p className="text-xs text-gray-400 mt-2">Across all programs</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Building2 className="w-7 h-7 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-white rounded-2xl p-5 shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gray-50 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Academic Years</p>
              <p className="text-3xl font-black text-gray-800">{totalYears}</p>
              <p className="text-xs text-gray-400 mt-2">1st - 4th Year</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform">
              <GraduationCap className="w-7 h-7 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-300">
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <Award className="w-8 h-8 text-yellow-400" />
              <Sparkles className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-gray-300 text-xs font-medium mb-1">Active Records</p>
            <p className="text-2xl font-bold text-white">{totalStudents}</p>
            <p className="text-xs text-gray-400 mt-2">All students active</p>
          </div>
        </div>
      </div>

      {/* Search & Table Section */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-800">Student Records</h2>
              <p className="text-sm text-gray-400 mt-1">Manage and track all student information</p>
            </div>
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search students by name, department or phone..."
                className="w-full md:w-80 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 outline-none focus:bg-white focus:border-gray-300 transition-all"
              />
            </div>
          </div>
        </div>
        
        <DataTable
          columns={columns}
          data={students}
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
              {editing ? <Edit2 className="w-5 h-5 text-gray-600" /> : <UserPlus className="w-5 h-5 text-gray-600" />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{editing ? 'Edit Student' : 'Add New Student'}</h2>
              <p className="text-xs text-gray-400 mt-0.5">{editing ? 'Update student information' : 'Enter student details below'}</p>
            </div>
          </div>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
            <input {...register('name', { required: true })} className={inputClass} placeholder="Enter student's full name" />
            {errors.name && <span className="text-red-500 text-xs mt-1">Name is required</span>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
            <select {...register('department', { required: true })} className={selectClass}>
              <option value="">Select Department</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Electronics">Electronics</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Civil">Civil</option>
              <option value="Electrical">Electrical</option>
              <option value="Information Science">Information Science</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Year</label>
            <select {...register('year', { required: true })} className={selectClass}>
              <option value="">Select Year</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
            <input {...register('phone', { required: true })} className={inputClass} placeholder="Enter phone number" />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all duration-200 shadow-md"
            >
              {editing ? 'Update Student' : 'Add Student'}
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