import { useEffect, useState } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

export default function Deals() {
  const [promos, setPromos] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get('/promotions').then(({ data }) => setPromos(data)).catch(() => {});
    api.get('/products').then(({ data }) => setProducts(data.filter((p) => p.discountPrice > 0 || p.isFeatured))).catch(() => {});
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-extrabold">Deals & Offers</h1>
      <p className="text-gray-500 mt-2">Save more with these exclusive offers.</p>

      <div className="mt-8 grid md:grid-cols-3 gap-4">
        {promos.map((p) => (
          <div key={p.code} className="rounded-2xl bg-gradient-to-br from-brand to-brandDark text-white p-6">
            <p className="text-xs uppercase font-bold text-gold">Coupon</p>
            <p className="text-2xl font-black tracking-wider mt-1">{p.code}</p>
            <p className="text-sm mt-2 text-white/85">{p.description || `${p.value}${p.type === 'percent' ? '%' : ' Rs.'} off`}</p>
            {p.minOrder > 0 && <p className="text-xs mt-2 text-white/70">Min order Rs. {p.minOrder}</p>}
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-extrabold mt-12 mb-6">Featured Items</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((p) => <ProductCard key={p._id} product={p} />)}
      </div>
    </div>
  );
}