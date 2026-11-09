import { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Pickup() {
  const [orders, setOrders] = useState([]);

  const load = () => api.get('/admin/orders')
    .then(({ data }) => setOrders(data.filter((o) => o.orderType === 'pickup' && ['accepted', 'preparing', 'ready'].includes(o.orderStatus))))
    .catch(() => {});

  useEffect(() => {
    load();
    const t = setInterval(load, 15000);
    return () => clearInterval(t);
  }, []);

  const collect = async (id) => {
    try {
      await api.patch(`/admin/orders/${id}/status`, { status: 'collected' });
      toast.success('Order collected');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-extrabold">Pickup Dashboard</h1>
      <div className="mt-6 space-y-4">
        {orders.length === 0 && <p className="text-gray-500">No pickup orders.</p>}
        {orders.map((o) => (
          <div key={o._id} className="card p-5 flex justify-between items-center gap-4">
            <div>
              <p className="font-mono text-sm">{o.orderNumber}</p>
              <p className="font-semibold">{o.customerName} · {o.customerPhone}</p>
              <p className="text-xs text-gray-500">Pickup time: {o.pickupTime || 'ASAP'}</p>
              <span className="text-xs font-bold uppercase bg-brand/10 text-brand px-2 py-1 rounded-full">{o.orderStatus}</span>
            </div>
            {o.orderStatus === 'ready' && <button onClick={() => collect(o._id)} className="btn-primary">Mark Collected</button>}
          </div>
        ))}
      </div>
    </div>
  );
}