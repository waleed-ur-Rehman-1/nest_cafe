import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Account() {
  const { user, setUser, logout } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [saving, setSaving] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put('/auth/profile', form);
      setUser(data);
      toast.success('Profile updated');
    } catch {
      toast.error('Could not update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold">My Account</h1>
      <div className="card mt-6 p-6">
        <p className="text-sm text-gray-500">Email</p>
        <p className="font-semibold">{user?.email}</p>
        <p className="text-sm text-gray-500 mt-3">Role</p>
        <p className="font-semibold capitalize">{user?.role}</p>
        <form onSubmit={save} className="mt-6 space-y-3">
          <input className="input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="input" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <button className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
        </form>
        <div className="mt-6 flex gap-4 text-sm font-bold">
          <Link to="/account/orders" className="text-brand">View My Orders</Link>
          <button onClick={logout} className="text-red-600">Logout</button>
        </div>
      </div>
    </div>
  );
}