import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { const raw = localStorage.getItem('nc_cart'); return raw ? JSON.parse(raw) : []; }
    catch { return []; }
  });

  useEffect(() => { localStorage.setItem('nc_cart', JSON.stringify(items)); }, [items]);

  const addItem = (product, quantity = 1, selectedOptions = [], specialInstructions = '') => {
    const key = product._id + JSON.stringify(selectedOptions) + specialInstructions;
    const base = product.discountPrice > 0 ? product.discountPrice : product.price;
    const unitPrice = base + selectedOptions.reduce((s, o) => s + (Number(o.price) || 0), 0);
    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) return prev.map((i) => i.key === key ? { ...i, quantity: i.quantity + quantity } : i);
      return [...prev, {
        key, product: product._id, name: product.name, image: product.image,
        unitPrice, quantity, selectedOptions, specialInstructions
      }];
    });
  };

  const updateQty = (key, quantity) =>
    setItems((prev) => prev.map((i) => i.key === key ? { ...i, quantity: Math.max(1, quantity) } : i));

  const removeItem = (key) => setItems((prev) => prev.filter((i) => i.key !== key));
  const clearCart = () => setItems([]);

  const subtotal = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, updateQty, removeItem, clearCart, subtotal, count }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);