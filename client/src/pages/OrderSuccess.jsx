import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/axios';

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/${id}`).then(({ data }) => setOrder(data)).catch(() => {});
  }, [id]);

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full grid place-items-center mx-auto text-3xl">✓</div>
      <h1 className="text-3xl font-extrabold mt-4">Order Confirmed!</h1>
      {order && (
        <>
          <p className="text-gray-500 mt-2">Order number</p>
          <p className="text-xl font-mono font-bold">{order.orderNumber}</p>
          <p className="mt-4 text-lg">Total: <span className="text-brand font-extrabold">Rs. {order.totalAmount}</span></p>
          <p className="text-sm text-gray-500 capitalize">Payment: {order.paymentMethod.replace('_', ' ')} · {order.paymentStatus}</p>
        </>
      )}
      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        {order && <Link to={`/track/${order.orderNumber}`} className="btn-outline">Track Order</Link>}
        <Link to="/menu" className="btn-primary">Order More</Link>
      </div>
    </div>
  );
}