import { Link } from 'react-router-dom';

const FALLBACK = 'https://placehold.co/600x400/C62828/FFFFFF?text=NUST+Cafe';

export default function ProductCard({ product }) {
  const price = product.discountPrice > 0 ? product.discountPrice : product.price;
  return (
    <Link to={`/product/${product._id}`} className="card group hover:shadow-lg transition">
      <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
        <img
          src={product.image || FALLBACK}
          alt={product.name}
          loading="lazy"
          onError={(e) => { e.target.src = FALLBACK; }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-charcoal truncate">{product.name}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 h-10">{product.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-extrabold text-brand">Rs. {price}</span>
          <span className="text-xs font-bold bg-gold/30 text-brand px-2 py-1 rounded-full">View</span>
        </div>
      </div>
    </Link>
  );
}