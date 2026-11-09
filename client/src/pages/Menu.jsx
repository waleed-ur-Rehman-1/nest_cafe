import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

export default function Menu() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [params, setParams] = useSearchParams();
  const activeCategory = params.get('category') || '';

  useEffect(() => {
    api.get('/products').then(({ data }) => setProducts(data)).catch(() => {});
    api.get('/categories').then(({ data }) => setCategories(data)).catch(() => {});
  }, []);

  const filtered = useMemo(() => products.filter((p) => {
    const catId = p.category?._id || p.category;
    const matchesCat = !activeCategory || catId === activeCategory;
    const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  }), [products, activeCategory, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-extrabold">Our Menu</h1>
      <p className="text-gray-500 mt-2">Freshly prepared, made to order.</p>

      <div className="mt-6 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setParams({})}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold ${!activeCategory ? 'bg-brand text-white' : 'bg-white border text-charcoal'}`}
          >All</button>
          {categories.map((c) => (
            <button
              key={c._id}
              onClick={() => setParams({ category: c._id })}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold ${activeCategory === c._id ? 'bg-brand text-white' : 'bg-white border text-charcoal'}`}
            >{c.name}</button>
          ))}
        </div>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search food..." className="input md:w-72" />
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-gray-500">No products found.</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </div>
  );
}