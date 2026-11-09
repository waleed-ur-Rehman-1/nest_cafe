import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get('/products').then(({ data }) => setProducts(data)).catch(() => {});
    api.get('/categories').then(({ data }) => setCategories(data)).catch(() => {});
  }, []);

  const featured = products.filter((p) => p.isFeatured).slice(0, 8);
  const bestsellers = products.filter((p) => p.isBestseller).slice(0, 4);

  return (
    <div>
      <section className="bg-brand text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-block bg-gold text-charcoal font-bold text-xs px-3 py-1 rounded-full mb-4">
              FREE DELIVERY ON ORDERS ABOVE RS. 1500
            </span>
            <h1 className="text-4xl md:text-6xl font-black leading-tight">
              Craving something<br /><span className="text-gold">crispy?</span>
            </h1>
            <p className="mt-4 text-white/90 text-lg max-w-md">
              Hot, fresh and delivered fast from NUST Café. Order your favourites in a few taps.
            </p>
            <div className="mt-8 flex gap-3">
              <Link to="/menu" className="bg-gold text-charcoal font-bold px-7 py-3 rounded-full hover:brightness-95">Order Now</Link>
              <Link to="/deals" className="border-2 border-white/70 px-7 py-3 rounded-full font-bold hover:bg-white hover:text-brand transition">View Deals</Link>
            </div>
          </div>
          <div className="hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=70"
              alt="Burger"
              className="rounded-3xl shadow-2xl w-full object-cover"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-6">Browse Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((c) => (
            <Link key={c._id} to={`/menu?category=${c._id}`} className="card p-4 text-center hover:shadow-md transition">
              <div className="w-16 h-16 mx-auto rounded-full bg-brand/10 grid place-items-center text-brand font-black">
                {c.name.slice(0, 2).toUpperCase()}
              </div>
              <p className="mt-2 text-sm font-semibold">{c.name}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-extrabold">Featured Items</h2>
          <Link to="/menu" className="text-brand font-bold text-sm">View all →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-6">Best Sellers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestsellers.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      </section>

      <section className="bg-charcoal text-white">
        <div className="max-w-7xl mx-auto px-4 py-14 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-3xl font-extrabold">Hungry? We deliver.</h3>
            <p className="text-white/70 mt-2">Order online for delivery or pickup at NUST Café.</p>
          </div>
          <Link to="/menu" className="bg-brand px-8 py-3 rounded-full font-bold hover:bg-brandDark">Start Order</Link>
        </div>
      </section>
    </div>
  );
}