import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, updateQty, removeItem, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="text-gray-500 mt-2">Add some delicious items to get started.</p>
        <Link to="/menu" className="btn-primary inline-block mt-6">Browse Menu</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold">Your Cart</h1>
      <div className="mt-6 space-y-4">
        {items.map((i) => (
          <div key={i.key} className="card p-4 flex gap-4 items-center">
            <img
              src={i.image}
              alt={i.name}
              className="w-20 h-20 rounded-lg object-cover bg-gray-100"
              onError={(e) => { e.target.src = 'https://placehold.co/200x200/C62828/FFFFFF?text=NC'; }}
            />
            <div className="flex-1">
              <h3 className="font-bold">{i.name}</h3>
              {i.selectedOptions.length > 0 && (
                <p className="text-xs text-gray-500">{i.selectedOptions.map((o) => o.label).join(', ')}</p>
              )}
              {i.specialInstructions && <p className="text-xs text-orange-600">“{i.specialInstructions}”</p>}
              <p className="text-brand font-bold mt-1">Rs. {i.unitPrice}</p>
            </div>
            <div className="flex items-center border rounded-full">
              <button onClick={() => updateQty(i.key, i.quantity - 1)} className="px-3 py-1 font-bold">−</button>
              <span className="px-2 font-bold">{i.quantity}</span>
              <button onClick={() => updateQty(i.key, i.quantity + 1)} className="px-3 py-1 font-bold">+</button>
            </div>
            <button onClick={() => removeItem(i.key)} className="text-red-500 text-sm font-semibold">Remove</button>
          </div>
        ))}
      </div>
      <div className="card mt-6 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500">Subtotal</p>
          <p className="text-2xl font-extrabold text-brand">Rs. {subtotal}</p>
        </div>
        <Link to="/checkout" className="btn-primary">Proceed to Checkout</Link>
      </div>
    </div>
  );
}