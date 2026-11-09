import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Menu from './pages/Menu';
import Deals from './pages/Deals';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';
import MyOrders from './pages/MyOrders';
import OrderSuccess from './pages/OrderSuccess';
import TrackOrder from './pages/TrackOrder';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminPromotions from './pages/admin/AdminPromotions';

import Kitchen from './pages/Kitchen';
import Delivery from './pages/Delivery';
import Pickup from './pages/Pickup';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/order/success/:id" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
          <Route path="/track" element={<TrackOrder />} />
          <Route path="/track/:orderNumber" element={<TrackOrder />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
          <Route path="/account/orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />

          <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/products" element={<ProtectedRoute roles={['admin']}><AdminProducts /></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute roles={['admin']}><AdminOrders /></ProtectedRoute>} />
          <Route path="/admin/customers" element={<ProtectedRoute roles={['admin']}><AdminCustomers /></ProtectedRoute>} />
          <Route path="/admin/promotions" element={<ProtectedRoute roles={['admin']}><AdminPromotions /></ProtectedRoute>} />

          <Route path="/kitchen" element={<ProtectedRoute roles={['admin', 'kitchen']}><Kitchen /></ProtectedRoute>} />
          <Route path="/delivery" element={<ProtectedRoute roles={['admin', 'delivery']}><Delivery /></ProtectedRoute>} />
          <Route path="/pickup" element={<ProtectedRoute roles={['admin', 'pickup']}><Pickup /></ProtectedRoute>} />

          <Route path="*" element={<div className="p-16 text-center text-2xl font-bold">Page not found</div>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}