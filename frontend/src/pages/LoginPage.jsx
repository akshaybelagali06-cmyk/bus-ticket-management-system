import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Bus, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      await login(username, password);

      toast.success('Welcome back!');

      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">

      {/* Background Decorations */}
      <div className="absolute inset-0">

        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-200/40 rounded-full blur-3xl animate-pulse" />

        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-slate-200/40 rounded-full blur-3xl" />

      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >

        {/* Logo */}
        <div className="text-center mb-8">

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto shadow-xl shadow-cyan-500/20 mb-4"
          >
            <Bus className="w-10 h-10 text-white" />
          </motion.div>

          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            BusPass Pro
          </h1>

          <p className="text-slate-500">
            Sign in to your admin dashboard
          </p>

        </div>

        {/* Login Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xl">

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-500 text-sm"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </motion.div>
            )}

            {/* Username */}
            <div>

              <label className="block text-sm font-medium text-slate-600 mb-2">
                Username
              </label>

              <div className="relative">

                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                  id="username-input"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-300 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:border-slate-500 focus:ring-0 outline-none transition-all"
                />

              </div>

            </div>

            {/* Password */}
            <div>

              <label className="block text-sm font-medium text-slate-600 mb-2">
                Password
              </label>

              <div className="relative">

                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  id="password-input"
                  className="w-full pl-11 pr-12 py-3 bg-slate-50 border-2 border-slate-300 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:border-slate-500 focus:ring-0 outline-none transition-all"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent border-none outline-none shadow-none text-slate-400 hover:text-slate-600 transition-all"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>

              </div>

            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              id="login-btn"
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20"
            >

              {loading ? (
                <span className="flex items-center justify-center gap-2">

                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />

                  Signing in...

                </span>
              ) : (
                'Sign In'
              )}

            </button>

          </form>

          {/* Footer */}
          <div className="mt-6 text-center">

            <p className="text-xs text-slate-400">
              Default: admin / admin123
            </p>

          </div>

        </div>

      </motion.div>

    </div>
  );
}