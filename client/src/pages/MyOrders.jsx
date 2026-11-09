import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/orders/my-orders').then(({ data }) => setOrders(data)).catch(() => {});
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold">My Orders</h1>
      {orders.length === 0 ? <p className="text-gray-500 mt-4">You have no orders yet.</p> : (
        <div className="mt-6 space-y-4">
          {orders.map((o) => (
            <div key={o._id} className="card p-5">
              <div className="flex flex-wrap justify-between gap-2">
                <div>
                  <p className="font-mono text-sm">{o.orderNumber}</p>
                  <p className="text-xs text-gray-500">{new Date(o.createdAt).toLocaleString()}</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-bold capitalize">{o.orderStatus}</span>
              </div>
              <ul className="mt-3 text-sm space-y-1">
                {o.items.map((it, idx) => <li key={idx}>{it.quantity} × {it.name}</li>)}
              </ul>
              <div className="mt-3 flex justify-between items-center">
                <p className="font-extrabold text-brand">Rs. {o.totalAmount}</p>
                <Link to={`/track/${o.orderNumber}`} className="text-sm font-bold underline">Track Order</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}