import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const DELIVERY_FEE = 150;

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [orderType, setOrderType] = useState('delivery');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState({ line: '', area: '', city: 'Islamabad', instructions: '' });
  const [pickupTime, setPickupTime] = useState('');
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedCode, setAppliedCode] = useState('');
  const [placing, setPlacing] = useState(false);
  const [pendingOrder, setPendingOrder] = useState(null);
  const [txn, setTxn] = useState(null);

  const deliveryFee = orderType === 'delivery' ? DELIVERY_FEE : 0;
  const total = Math.max(0, subtotal - discount + deliveryFee);

  if (items.length === 0 && !pendingOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <Link to="/menu" className="btn-primary inline-block mt-6">Browse Menu</Link>
      </div>
    );
  }

  const applyCoupon = async () => {
    try {
      const { data } = await api.post('/promotions/validate', { code: coupon, subtotal });
      setDiscount(data.discount);
      setAppliedCode(data.code);
      toast.success(`Coupon applied — Rs. ${data.discount} off`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon');
      setDiscount(0);
      setAppliedCode('');
    }
  };

  const placeOrder = async () => {
    if (!name || !phone) return toast.error('Name and phone are required');
    if (orderType === 'delivery' && (!address.line || !address.area)) return toast.error('Complete the delivery address');
    if (orderType === 'pickup' && !pickupTime) return toast.error('Select a pickup time');

    setPlacing(true);
    try {
      const payload = {
        items: items.map((i) => ({
          product: i.product,
          quantity: i.quantity,
          selectedOptions: i.selectedOptions,
          specialInstructions: i.specialInstructions
        })),
        orderType,
        deliveryAddress: orderType === 'delivery' ? address : undefined,
        pickupTime: orderType === 'pickup' ? pickupTime : undefined,
        paymentMethod,
        couponCode: appliedCode || undefined,
        customerName: name,
        customerPhone: phone
      };
      const { data: order } = await api.post('/orders', payload);
      clearCart();

      if (['easypaisa', 'jazzcash', 'card'].includes(paymentMethod)) {
        const { data: init } = await api.post('/payments/initialize', { orderId: order._id });
        setPendingOrder(order);
        setTxn(init);
      } else {
        navigate(`/order/success/${order._id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not place order');
    } finally {
      setPlacing(false);
    }
  };

  const completePayment = async (success) => {
    try {
      await api.post('/payments/verify', { orderId: pendingOrder._id, transactionId: txn.transactionId, success });
      if (success) {
        toast.success('Payment successful');
        navigate(`/order/success/${pendingOrder._id}`);
      } else {
        toast.error('Payment failed');
        navigate('/account/orders');
      }
    } catch {
      toast.error('Verification error');
    }
  };

  if (pendingOrder && txn) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16">
        <div className="card p-8 text-center">
          <h2 className="text-2xl font-extrabold">Secure Payment</h2>
          <p className="text-gray-500 mt-1 text-sm">Simulated {pendingOrder.paymentMethod.toUpperCase()} gateway</p>
          <p className="mt-6 text-3xl font-black text-brand">Rs. {pendingOrder.totalAmount}</p>
          <p className="text-xs text-gray-400 mt-1">Ref: {txn.transactionId}</p>
          <div className="mt-8 flex flex-col gap-3">
            <button onClick={() => completePayment(true)} className="btn-primary">Pay Now (Simulate Success)</button>
            <button onClick={() => completePayment(false)} className="btn-outline">Simulate Failure</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="card p-6">
          <h2 className="text-xl font-extrabold mb-4">1. Order Type</h2>
          <div className="grid grid-cols-2 gap-3">
            {['delivery', 'pickup'].map((t) => (
              <button key={t} onClick={() => setOrderType(t)}
                className={`p-4 rounded-xl border-2 font-bold ${orderType === t ? 'border-brand bg-brand/5 text-brand' : 'border-gray-200'}`}>
                {t === 'delivery' ? 'Home Delivery' : 'Restaurant Pickup'}
              </button>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-extrabold mb-4">2. Contact Details</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <input className="input" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
            <input className="input" placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-extrabold mb-4">
            {orderType === 'delivery' ? '3. Delivery Address' : '3. Pickup Time'}
          </h2>
          {orderType === 'delivery' ? (
            <div className="space-y-3">
              <input className="input" placeholder="House / street" value={address.line} onChange={(e) => setAddress({ ...address, line: e.target.value })} />
              <input className="input" placeholder="Area" value={address.area} onChange={(e) => setAddress({ ...address, area: e.target.value })} />
              <input className="input" placeholder="City" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
              <input className="input" placeholder="Delivery instructions (optional)" value={address.instructions} onChange={(e) => setAddress({ ...address, instructions: e.target.value })} />
            </div>
          ) : (
            <input className="input" type="time" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} />
          )}
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-extrabold mb-4">4. Payment Method</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { id: 'cod', label: 'Cash on Delivery', show: orderType === 'delivery' },
              { id: 'pickup_cash', label: 'Cash at Pickup', show: orderType === 'pickup' },
              { id: 'easypaisa', label: 'Easypaisa', show: true },
              { id: 'jazzcash', label: 'JazzCash', show: true },
              { id: 'card', label: 'Debit / Credit Card', show: true }
            ].filter((p) => p.show).map((p) => (
              <button key={p.id} onClick={() => setPaymentMethod(p.id)}
                className={`p-4 rounded-xl border-2 font-semibold text-left ${paymentMethod === p.id ? 'border-brand bg-brand/5 text-brand' : 'border-gray-200'}`}>
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <div className="card p-6">
          <h2 className="text-lg font-extrabold mb-3">Order Summary</h2>
          <div className="space-y-2 text-sm max-h-56 overflow-auto pr-1">
            {items.map((i) => (
              <div key={i.key} className="flex justify-between gap-2">
                <span>{i.quantity} × {i.name}</span>
                <span className="font-semibold">Rs. {i.unitPrice * i.quantity}</span>
              </div>
            ))}
          </div>
          <hr className="my-4" />
          <div className="space-y-1 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>Rs. {subtotal}</span></div>
            {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>− Rs. {discount}</span></div>}
            <div className="flex justify-between"><span>Delivery</span><span>{deliveryFee ? `Rs. ${deliveryFee}` : 'Free'}</span></div>
            <div className="flex justify-between font-extrabold text-base pt-2 border-t">
              <span>Total</span><span className="text-brand">Rs. {total}</span>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <input className="input" placeholder="Coupon code" value={coupon} onChange={(e) => setCoupon(e.target.value.toUpperCase())} />
            <button onClick={applyCoupon} className="bg-charcoal text-white px-4 rounded-lg font-semibold">Apply</button>
          </div>

          <button onClick={placeOrder} disabled={placing} className="btn-primary w-full mt-5">
            {placing ? 'Placing...' : `Place Order · Rs. ${total}`}
          </button>
          <p className="text-xs text-gray-400 text-center mt-3">Prices are verified on the server.</p>
        </div>
      </div>
    </div>
  );
}