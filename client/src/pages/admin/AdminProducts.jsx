import { useEffect, useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const STATUSES = ['pending', 'accepted', 'preparing', 'ready', 'dispatched', 'delivered', 'collected', 'rejected', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('');

  const load = () => {
    api.get(`/admin/orders${filter ? `?status=${filter}` : ''}`)
      .then(({ data }) => setOrders(data)).catch(() => {});
  };
  useEffect(load, [filter]);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/admin/orders/${id}/status`, { status });
      toast.success(`Order marked ${status}`);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-extrabold">Orders</h1>
        <select className="input w-56" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="card mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-3">Order #</th><th className="p-3">Customer</th><th className="p-3">Type</th>
              <th className="p-3">Total</th><th className="p-3">Payment</th><th className="p-3">Status</th><th className="p-3">Update</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-t align-top">
                <td className="p-3 font-mono text-xs">{o.orderNumber}</td>
                <td className="p-3">{o.customerName}<br /><span className="text-xs text-gray-500">{o.customerPhone}</span></td>
                <td className="p-3 capitalize">{o.orderType}</td>
                <td className="p-3">Rs. {o.totalAmount}</td>
                <td className="p-3 capitalize">{o.paymentMethod.replace('_', ' ')}<br /><span className="text-xs text-gray-500">{o.paymentStatus}</span></td>
                <td className="p-3"><span className="px-2 py-1 rounded-full bg-brand/10 text-brand text-xs font-bold">{o.orderStatus}</span></td>
                <td className="p-3">
                  <select className="border rounded px-2 py-1 text-xs" value={o.orderStatus} onChange={(e) => updateStatus(o._id, e.target.value)}>
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}