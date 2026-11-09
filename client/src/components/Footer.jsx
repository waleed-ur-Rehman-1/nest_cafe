import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-extrabold text-xl">NUST Café</h3>
          <p className="text-white/60 text-sm mt-2">Fresh fast food, delivered fast. Order online for delivery or pickup.</p>
        </div>
        <div>
          <h4 className="font-bold mb-3">Quick Links</h4>
          <ul className="text-sm space-y-2 text-white/70">
            <li><Link to="/menu" className="hover:text-gold">Menu</Link></li>
            <li><Link to="/deals" className="hover:text-gold">Deals</Link></li>
            <li><Link to="/track" className="hover:text-gold">Track Order</Link></li>
            <li><Link to="/account" className="hover:text-gold">My Account</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-3">Contact</h4>
          <p className="text-sm text-white/70">NUST Campus, Islamabad</p>
          <p className="text-sm text-white/70 mt-1">+92 300 0000000</p>
          <p className="text-sm text-white/70 mt-1">hello@nustcafe.pk</p>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} NUST Café. All rights reserved.
      </div>
    </footer>
  );
}