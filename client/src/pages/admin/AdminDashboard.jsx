import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/dashboard').then(({ data }) => setStats(data)).catch(() => {});
  }, []);

  if (!stats) return <div className="p-16 text-center">Loading dashboard...</div>;

  const cards = [
    { label: 'Total Orders', value: stats.totalOrders, color: 'bg-blue-50 text-blue-700' },
    { label: "Today's Orders", value: stats.todaysOrders, color: 'bg-green-50 text-green-700' },
    { label: 'Total Revenue', value: `Rs. ${stats.totalRevenue}`, color: 'bg-red-50 text-red-700' },
    { label: "Today's Revenue", value: `Rs. ${stats.todayRevenue}`, color: 'bg-yellow-50 text-yellow-700' },
    { label: 'Pending', value: stats.pending, color: 'bg-orange-50 text-orange-700' },
    { label: 'Preparing', value: stats.preparing, color: 'bg-purple-50 text-purple-700' },
    { label: 'Completed', value: stats.completed, color: 'bg-emerald-50 text-emerald-700' },
    { label: 'Customers', value: stats.customers, color: 'bg-slate-50 text-slate-700' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold">Admin Dashboard</h1>
      <div className="mt-6 flex flex-wrap gap-2">
        {[
          ['/admin/products', 'Products'], ['/admin/orders', 'Orders'], ['/admin/customers', 'Customers'],
          ['/admin/promotions', 'Promotions'], ['/kitchen', 'Kitchen'], ['/delivery', 'Delivery'], ['/pickup', 'Pickup']
        ].map(([to, label]) => (
          <Link key={to} to={to} className="px-4 py-2 rounded-full bg-white border font-semibold text-sm hover:bg-brand hover:text-white transition">
            {label}
          </Link>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className={`rounded-2xl p-5 ${c.color}`}>
            <p className="text-xs font-bold uppercase tracking-wide opacity-70">{c.label}</p>
            <p className="text-2xl font-black mt-1">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 card p-6">
        <h2 className="font-extrabold text-lg">Top Selling Products</h2>
        {stats.bestSellers.length === 0 ? <p className="text-gray-500 text-sm mt-2">No sales yet.</p> : (
          <ul className="mt-4 space-y-2">
            {stats.bestSellers.map((b) => (
              <li key={b.name} className="flex justify-between text-sm border-b last:border-0 pb-2">
                <span className="font-semibold">{b.name}</span>
                <span className="text-gray-500">{b.qty} sold</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}