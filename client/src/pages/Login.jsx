import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}`);
      const dest = { admin: '/admin', kitchen: '/kitchen', delivery: '/delivery', pickup: '/pickup' }[user.role] || '/menu';
      navigate(dest);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="card p-8">
        <h1 className="text-2xl font-extrabold">Login</h1>
        <p className="text-gray-500 text-sm mt-1">Access your NUST Café account.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <input className="input" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input className="input" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <button className="btn-primary w-full" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
        </form>
        <p className="text-sm text-center mt-4 text-gray-500">
          No account? <Link to="/register" className="text-brand font-bold">Register</Link>
        </p>
        <div className="mt-6 text-xs bg-gray-50 p-3 rounded-lg text-gray-600 space-y-0.5">
          <p className="font-bold mb-1">Demo accounts</p>
          <p>admin@nustcafe.pk / admin123</p>
          <p>kitchen@nustcafe.pk / kitchen123</p>
          <p>delivery@nustcafe.pk / delivery123</p>
          <p>pickup@nustcafe.pk / pickup123</p>
          <p>customer@nustcafe.pk / customer123</p>
        </div>
      </div>
    </div>
  );
}