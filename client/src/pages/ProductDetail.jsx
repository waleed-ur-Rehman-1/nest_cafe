import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState('');
  const [picked, setPicked] = useState({});

  useEffect(() => {
    api.get(`/products/${id}`).then(({ data }) => {
      setProduct(data);
      const init = {};
      (data.customizations || []).forEach((g) => {
        init[g.name] = g.type === 'single' && g.required && g.options?.length ? [g.options[0].label] : [];
      });
      setPicked(init);
    }).catch(() => toast.error('Product not found'));
  }, [id]);

  if (!product) return <div className="p-16 text-center">Loading...</div>;

  const base = product.discountPrice > 0 ? product.discountPrice : product.price;

  const selectedOptions = [];
  (product.customizations || []).forEach((g) => {
    (picked[g.name] || []).forEach((label) => {
      const opt = g.options.find((o) => o.label === label);
      if (opt) selectedOptions.push({ name: g.name, label: opt.label, price: opt.price || 0 });
    });
  });

  const unitPrice = base + selectedOptions.reduce((s, o) => s + o.price, 0);

  const toggle = (group, option) => {
    setPicked((prev) => {
      const current = prev[group.name] || [];
      if (group.type === 'single') return { ...prev, [group.name]: [option.label] };
      return {
        ...prev,
        [group.name]: current.includes(option.label)
          ? current.filter((l) => l !== option.label)
          : [...current, option.label]
      };
    });
  };

  const handleAdd = () => {
    addItem(product, qty, selectedOptions, notes);
    toast.success('Added to cart');
    navigate('/cart');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-10">
      <img
        src={product.image}
        alt={product.name}
        onError={(e) => { e.target.src = 'https://placehold.co/600x400/C62828/FFFFFF?text=NUST+Cafe'; }}
        className="w-full rounded-2xl object-cover aspect-[4/3]"
      />
      <div>
        <h1 className="text-3xl font-extrabold">{product.name}</h1>
        <p className="text-gray-600 mt-2">{product.description}</p>
        <p className="mt-4 text-2xl font-extrabold text-brand">Rs. {unitPrice}</p>

        {(product.customizations || []).map((group) => (
          <div key={group.name} className="mt-6">
            <h3 className="font-bold">
              {group.name} {group.required && <span className="text-brand text-xs">(required)</span>}
            </h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {group.options.map((opt) => {
                const active = (picked[group.name] || []).includes(opt.label);
                return (
                  <button
                    key={opt.label}
                    onClick={() => toggle(group, opt)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold border ${active ? 'bg-brand text-white border-brand' : 'bg-white text-charcoal border-gray-300'}`}
                  >
                    {opt.label}{opt.price > 0 ? ` + Rs. ${opt.price}` : ''}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <div className="mt-6">
          <h3 className="font-bold">Special Instructions</h3>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows="2"
            className="input mt-2" placeholder="e.g. no onions, extra spicy" />
        </div>

        <div className="mt-6 flex items-center gap-4">
          <div className="flex items-center border rounded-full">
            <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-2 text-xl font-bold">−</button>
            <span className="px-2 font-bold">{qty}</span>
            <button onClick={() => setQty(qty + 1)} className="px-4 py-2 text-xl font-bold">+</button>
          </div>
          <button onClick={handleAdd} className="btn-primary flex-1">Add to Cart · Rs. {unitPrice * qty}</button>
        </div>
      </div>
    </div>
  );
}