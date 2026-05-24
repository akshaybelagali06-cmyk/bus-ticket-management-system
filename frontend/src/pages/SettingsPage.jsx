import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Settings" 
        subtitle="View and manage administrative settings" 
      />

      <div className="bg-[#1e293b] rounded-2xl border border-[#334155] p-6 max-w-2xl">
        <h3 className="text-lg font-bold text-white mb-4">Administrator Profile</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 py-3 border-b border-[#334155]/50">
            <span className="text-[#64748b] text-sm">Full Name</span>
            <span className="text-white text-sm font-semibold col-span-2">{user?.full_name || 'System Administrator'}</span>
          </div>
          <div className="grid grid-cols-3 gap-4 py-3 border-b border-[#334155]/50">
            <span className="text-[#64748b] text-sm">Username</span>
            <span className="text-white text-sm font-semibold col-span-2">{user?.username || 'admin'}</span>
          </div>
          <div className="grid grid-cols-3 gap-4 py-3">
            <span className="text-[#64748b] text-sm">Email Address</span>
            <span className="text-white text-sm font-semibold col-span-2">{user?.email || 'admin@buspass.com'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
