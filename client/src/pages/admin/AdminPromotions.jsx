import { useEffect, useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const empty = { code: '', description: '', type: 'percent', value: '', minOrder: '', maxDiscount: '' };

export default function AdminPromotions() {
  const [promos, setPromos] = useState([]);
  const [form, setForm] = useState(empty);

  const load = () => api.get('/admin/promotions').then(({ data }) => setPromos(data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/promotions', {
        ...form,
        code: form.code.toUpperCase(),
        value: Number(form.value || 0),
        minOrder: Number(form.minOrder || 0),
        maxDiscount: Number(form.maxDiscount || 0)
      });
      toast.success('Promotion created');
      setForm(empty); load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const remove = async (id) => {
    await api.delete(`/admin/promotions/${id}`);
    toast.success('Deleted'); load();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-extrabold">Promotions</h1>
      <form onSubmit={submit} className="card p-6 mt-6 grid md:grid-cols-3 gap-3">
        <input className="input" placeholder="Code (e.g. WELCOME10)" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required />
        <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
          <option value="percent">Percent</option>
          <option value="fixed">Fixed amount</option>
          <option value="free_delivery">Free delivery</option>
        </select>
        <input className="input" type="number" placeholder="Value" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
        <input className="input" type="number" placeholder="Min order" value={form.minOrder} onChange={(e) => setForm({ ...form, minOrder: e.target.value })} />
        <input className="input" type="number" placeholder="Max discount" value={form.maxDiscount} onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })} />
        <input className="input" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <button className="btn-primary md:col-span-3">Create Promotion</button>
      </form>

      <div className="card mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr><th className="p-3">Code</th><th className="p-3">Type</th><th className="p-3">Value</th><th className="p-3">Min Order</th><th className="p-3">Action</th></tr>
          </thead>
          <tbody>
            {promos.map((p) => (
              <tr key={p._id} className="border-t">
                <td className="p-3 font-mono font-bold">{p.code}</td>
                <td className="p-3 capitalize">{p.type.replace('_', ' ')}</td>
                <td className="p-3">{p.value}</td>
                <td className="p-3">{p.minOrder}</td>
                <td className="p-3"><button onClick={() => remove(p._id)} className="text-red-600 font-semibold">Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}