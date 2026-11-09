import { useEffect, useRef, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const SHOP = { lat: 33.6436, lng: 73.0176 };

export default function Delivery() {
  const [orders, setOrders] = useState([]);
  const [simulating, setSimulating] = useState({});
  const watchRef = useRef(null);

  const load = () => api.get('/admin/orders')
    .then(({ data }) => setOrders(data.filter((o) => o.orderType === 'delivery' && ['ready', 'dispatched'].includes(o.orderStatus))))
    .catch(() => {});

  useEffect(() => {
    load();
    const t = setInterval(load, 15000);
    return () => { clearInterval(t); if (watchRef.current) navigator.geolocation.clearWatch(watchRef.current); };
  }, []);

  const update = async (id, status) => {
    try {
      await api.patch(`/admin/orders/${id}/status`, { status });
      toast.success(`Marked ${status}`);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const startRealTracking = (orderId) => {
    if (!navigator.geolocation) return toast.error('Geolocation not supported');
    if (watchRef.current) navigator.geolocation.clearWatch(watchRef.current);
    watchRef.current = navigator.geolocation.watchPosition(
      async (pos) => {
        try {
          await api.patch(`/admin/orders/${orderId}/location`, {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
        } catch { /* ignore */ }
      },
      () => toast.error('Location error'),
      { enableHighAccuracy: true }
    );
    toast.success('Live location sharing started');
  };

  const simulateRide = async (order) => {
    if (simulating[order._id]) return;
    const start = SHOP;
    const end = order.customerLocation?.lat
      ? { lat: order.customerLocation.lat, lng: order.customerLocation.lng }
      : { lat: 33.6500, lng: 73.0300 };

    setSimulating((p) => ({ ...p, [order._id]: true }));
    try {
      const steps = 25;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const lat = start.lat + (end.lat - start.lat) * t;
        const lng = start.lng + (end.lng - start.lng) * t;
        await api.patch(`/admin/orders/${order._id}/location`, { lat, lng });
        await new Promise((r) => setTimeout(r, 1200));
      }
      toast.success('Simulated ride complete');
    } catch {
      toast.error('Simulation failed');
    } finally {
      setSimulating((p) => ({ ...p, [order._id]: false }));
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-extrabold">Delivery Dashboard</h1>
      <p className="text-sm text-gray-500 mt-1">Open the customer's Track page in another tab to see the rider move live.</p>

      <div className="mt-6 space-y-4">
        {orders.length === 0 && <p className="text-gray-500">No delivery orders ready.</p>}
        {orders.map((o) => (
          <div key={o._id} className="card p-5">
            <div className="flex justify-between">
              <span className="font-mono text-sm">{o.orderNumber}</span>
              <span className="text-xs font-bold uppercase bg-brand/10 text-brand px-2 py-1 rounded-full">{o.orderStatus}</span>
            </div>
            <p className="mt-2 font-semibold">{o.customerName} · {o.customerPhone}</p>
            <p className="text-sm text-gray-500">
              {o.deliveryAddress?.line}, {o.deliveryAddress?.area}, {o.deliveryAddress?.city}
            </p>
            {o.deliveryAddress?.instructions && (
              <p className="text-xs text-orange-600 mt-1">"{o.deliveryAddress.instructions}"</p>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              {o.orderStatus === 'ready' && (
                <button onClick={() => update(o._id, 'dispatched')} className="btn-primary">Picked Up</button>
              )}
              {o.orderStatus === 'dispatched' && (
                <>
                  <button onClick={() => update(o._id, 'delivered')} className="btn-primary">Mark Delivered</button>
                  <button onClick={() => startRealTracking(o._id)} className="btn-outline">Share My GPS</button>
                  <button
                    onClick={() => simulateRide(o)}
                    disabled={simulating[o._id]}
                    className="btn-outline"
                  >
                    {simulating[o._id] ? 'Riding…' : 'Simulate Ride'}
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}