import { useState, useEffect } from 'react';
import api from '../services/api';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewStudent, setViewStudent] = useState(null);
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  const fetchStudents = () => {
    setLoading(true);
    api.get('/students', { params: { search } })
      .then(res => setStudents(res.data))
      .catch(() => toast.error('Failed to load students'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchStudents(); }, [search]);

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
      fetchStudents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this student?')) return;
    try {
      await api.delete(`/students/${id}`);
      toast.success('Student deleted');
      fetchStudents();
    } catch {
      toast.error('Delete failed');
    }
  };

  const openEdit = (student) => {
    setEditing(student);
    setValue('name', student.name);
    setValue('department', student.department);
    setValue('year', student.year);
    setValue('phone', student.phone);
    setModalOpen(true);
  };

  const openAdd = () => {
    setEditing(null);
    reset();
    setModalOpen(true);
  };

  const inputClass = "w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-xl text-white text-sm placeholder-[#64748b] focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all";

  const columns = [
    { header: 'ID', accessor: 'student_id' },
    { header: 'Name', cell: (row) => <span className="font-medium text-white">{row.name}</span> },
    { header: 'Department', accessor: 'department' },
    { header: 'Year', accessor: 'year' },
    { header: 'Phone', accessor: 'phone' },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => setViewStudent(row)} className="p-2 rounded-lg text-cyan-400 hover:bg-cyan-500/10 transition-all" title="View"><Eye className="w-4 h-4" /></button>
          <button onClick={() => openEdit(row)} className="p-2 rounded-lg text-amber-400 hover:bg-amber-500/10 transition-all" title="Edit"><Edit2 className="w-4 h-4" /></button>
          <button onClick={() => handleDelete(row.student_id)} className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-all" title="Delete"><Trash2 className="w-4 h-4" /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Students"
        subtitle="Manage all student records"
        action={
          <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-700 shadow-lg shadow-cyan-500/20 transition-all" id="add-student-btn">
            <Plus className="w-4 h-4" /> Add Student
          </button>
        }
      />
      <DataTable
        columns={columns}
        data={students}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search students..."
        loading={loading}
      />

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); reset(); }} title={editing ? 'Edit Student' : 'Add Student'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#94a3b8] mb-2">Full Name</label>
            <input {...register('name', { required: true })} className={inputClass} placeholder="Enter full name" />
            {errors.name && <span className="text-red-400 text-xs mt-1">Name is required</span>}
          </div>
          <div>
            <label className="block text-sm font-medium text-[#94a3b8] mb-2">Department</label>
            <select {...register('department', { required: true })} className={inputClass}>
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
            <label className="block text-sm font-medium text-[#94a3b8] mb-2">Year</label>
            <select {...register('year', { required: true })} className={inputClass}>
              <option value="">Select Year</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#94a3b8] mb-2">Phone</label>
            <input {...register('phone', { required: true })} className={inputClass} placeholder="Enter phone number" />
          </div>
          <div className="flex gap-3 pt-4">
            <button type="submit" className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg shadow-cyan-500/20">
              {editing ? 'Update' : 'Add'} Student
            </button>
            <button type="button" onClick={() => { setModalOpen(false); reset(); }} className="px-6 py-3 bg-[#0f172a] text-[#94a3b8] rounded-xl hover:text-white transition-all border border-[#334155]">
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={!!viewStudent} onClose={() => setViewStudent(null)} title="Student Details">
        {viewStudent && (
          <div className="space-y-4">
            {[
              ['Student ID', viewStudent.student_id],
              ['Name', viewStudent.name],
              ['Department', viewStudent.department],
              ['Year', `${viewStudent.year}${['st','nd','rd','th'][viewStudent.year-1] || 'th'} Year`],
              ['Phone', viewStudent.phone],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between items-center py-3 border-b border-[#334155]/50">
                <span className="text-sm text-[#64748b]">{label}</span>
                <span className="text-sm font-medium text-white">{value}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
