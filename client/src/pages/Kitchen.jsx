import { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Kitchen() {
  const [orders, setOrders] = useState([]);

  const load = () => api.get('/admin/orders')
    .then(({ data }) => setOrders(data.filter((o) => ['accepted', 'preparing', 'ready'].includes(o.orderStatus))))
    .catch(() => {});

  useEffect(() => {
    load();
    const t = setInterval(load, 15000);
    return () => clearInterval(t);
  }, []);

  const advance = async (o) => {
    const next = o.orderStatus === 'accepted' ? 'preparing' : o.orderStatus === 'preparing' ? 'ready' : null;
    if (!next) return;
    try {
      await api.patch(`/admin/orders/${o._id}/status`, { status: next });
      toast.success(`Marked ${next}`);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-extrabold">Kitchen Dashboard</h1>
      <div className="mt-6 grid md:grid-cols-2 gap-4">
        {orders.length === 0 && <p className="text-gray-500">No active orders.</p>}
        {orders.map((o) => (
          <div key={o._id} className="card p-5">
            <div className="flex justify-between items-center">
              <span className="font-mono text-sm">{o.orderNumber}</span>
              <span className="text-xs font-bold uppercase bg-brand/10 text-brand px-2 py-1 rounded-full">{o.orderStatus}</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">{o.customerName} · <span className="capitalize">{o.orderType}</span></p>
            <ul className="mt-3 text-sm space-y-1">
              {o.items.map((it, idx) => (
                <li key={idx}>
                  <b>{it.quantity}×</b> {it.name}
                  {it.selectedOptions?.length > 0 && <span className="text-gray-500"> ({it.selectedOptions.map((s) => s.label).join(', ')})</span>}
                  {it.specialInstructions && <span className="block text-xs text-orange-600">“{it.specialInstructions}”</span>}
                </li>
              ))}
            </ul>
            {o.orderStatus !== 'ready' && (
              <button onClick={() => advance(o)} className="btn-primary w-full mt-4">
                {o.orderStatus === 'accepted' ? 'Start Preparing' : 'Mark Ready'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}