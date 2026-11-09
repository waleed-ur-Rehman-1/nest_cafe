import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const dashboardPath = user?.role === 'admin' ? '/admin'
    : user?.role === 'kitchen' ? '/kitchen'
    : user?.role === 'delivery' ? '/delivery'
    : user?.role === 'pickup' ? '/pickup'
    : null;

  return (
    <header className="sticky top-0 z-40 bg-brand text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 font-extrabold text-xl tracking-tight">
          <span className="bg-white text-brand rounded-full w-9 h-9 grid place-items-center">NC</span>
          NUST Café
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold">
          <NavLink to="/" className={({ isActive }) => isActive ? 'text-gold' : 'hover:text-gold'}>Home</NavLink>
          <NavLink to="/menu" className={({ isActive }) => isActive ? 'text-gold' : 'hover:text-gold'}>Menu</NavLink>
          <NavLink to="/deals" className={({ isActive }) => isActive ? 'text-gold' : 'hover:text-gold'}>Deals</NavLink>
          {user && <NavLink to="/account/orders" className="hover:text-gold">My Orders</NavLink>}
          {dashboardPath && <NavLink to={dashboardPath} className="hover:text-gold">Dashboard</NavLink>}
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/cart" className="relative bg-white/15 hover:bg-white/25 px-3 py-2 rounded-full text-sm font-semibold">
            Cart
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-gold text-charcoal text-xs font-bold rounded-full w-5 h-5 grid place-items-center">
                {count}
              </span>
            )}
          </Link>
          {user ? (
            <div className="relative">
              <button onClick={() => setOpen(!open)} className="bg-white text-brand px-3 py-2 rounded-full text-sm font-bold">
                {user.name.split(' ')[0]}
              </button>
              {open && (
                <div className="absolute right-0 mt-2 bg-white text-charcoal rounded-lg shadow-lg w-44 py-1 text-sm z-50">
                  <Link to="/account" onClick={() => setOpen(false)} className="block px-4 py-2 hover:bg-gray-100">My Account</Link>
                  {dashboardPath && <Link to={dashboardPath} onClick={() => setOpen(false)} className="block px-4 py-2 hover:bg-gray-100">Dashboard</Link>}
                  <button onClick={() => { logout(); setOpen(false); navigate('/'); }} className="w-full text-left px-4 py-2 hover:bg-gray-100 text-brand font-semibold">
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="bg-gold text-charcoal px-4 py-2 rounded-full text-sm font-bold hover:brightness-95">Login</Link>
          )}
        </div>
      </div>
    </header>
  );
}