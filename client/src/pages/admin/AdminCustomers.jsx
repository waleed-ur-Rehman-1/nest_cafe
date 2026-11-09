import { useEffect, useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const load = () => api.get('/admin/customers').then(({ data }) => setCustomers(data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const toggle = async (id) => {
    try { await api.patch(`/admin/customers/${id}/toggle`); toast.success('Updated'); load(); }
    catch { toast.error('Failed'); }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-extrabold">Customers</h1>
      <div className="card mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Phone</th><th className="p-3">Status</th><th className="p-3">Action</th></tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c._id} className="border-t">
                <td className="p-3 font-semibold">{c.name}</td>
                <td className="p-3">{c.email}</td>
                <td className="p-3">{c.phone}</td>
                <td className="p-3">
                  {c.isActive ? <span className="text-green-600 font-bold">Active</span> : <span className="text-red-600 font-bold">Blocked</span>}
                </td>
                <td className="p-3">
                  <button onClick={() => toggle(c._id)} className="text-blue-600 font-semibold">{c.isActive ? 'Block' : 'Unblock'}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}