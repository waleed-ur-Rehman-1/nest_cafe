import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import api from '../api/axios';

const FLOW = ['pending', 'accepted', 'preparing', 'ready', 'dispatched', 'delivered'];

// Div icons avoid Leaflet's broken default-marker problem on Vite
const makeIcon = (bg, emoji) =>
  new L.DivIcon({
    html: `<div style="background:${bg};width:34px;height:34px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:17px">${emoji}</div>`,
    className: '',
    iconSize: [34, 34],
    iconAnchor: [17, 17]
  });

const riderIcon = makeIcon('#15803D', '🛵');
const shopIcon = makeIcon('#C62828', '🏪');
const homeIcon = makeIcon('#FFC72C', '🏠');

function FitBounds({ points }) {
  const map = useMap();
  useEffect(() => {
    if (points.length > 1) {
      try { map.fitBounds(L.latLngBounds(points), { padding: [40, 40] }); } catch { /* noop */ }
    }
  }, [JSON.stringify(points)]);
  return null;
}

export default function TrackOrder() {
  const { orderNumber } = useParams();
  const navigate = useNavigate();
  const [input, setInput] = useState(orderNumber || '');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const load = () => {
    if (!orderNumber) return;
    api.get(`/orders/track/${orderNumber}`)
      .then(({ data }) => { setData(data); setError(''); })
      .catch(() => setError('Order not found'));
  };

  useEffect(() => { setError(''); setData(null); load(); /* eslint-disable-next-line */ }, [orderNumber]);

  useEffect(() => {
    if (!data) return;
    if (!['accepted', 'preparing', 'ready', 'dispatched'].includes(data.orderStatus)) return;
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
    /* eslint-disable-next-line */
  }, [data?.orderStatus, orderNumber]);

  const search = (e) => {
    e.preventDefault();
    if (input.trim()) navigate(`/track/${input.trim()}`);
  };

  const riderPos = data?.riderLocation?.lat ? [data.riderLocation.lat, data.riderLocation.lng] : null;
  const customerPos = data?.customerLocation?.lat ? [data.customerLocation.lat, data.customerLocation.lng] : null;
  const shopPos = data?.restaurantLocation?.lat ? [data.restaurantLocation.lat, data.restaurantLocation.lng] : [33.6436, 73.0176];

  const showMap = data && data.orderType === 'delivery';
  const mapPoints = [riderPos, customerPos, shopPos].filter(Boolean);
  const center = riderPos || shopPos;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold">Track Your Order</h1>
      <form onSubmit={search} className="mt-4 flex flex-col sm:flex-row gap-2">
        <input className="input flex-1" placeholder="Enter tracking number (e.g. NC3447525776)"
          value={input} onChange={(e) => setInput(e.target.value)} />
        <button className="btn-primary">Track</button>
      </form>

      {error && <p className="mt-6 text-red-600 font-semibold">{error}</p>}

      {data && (
        <>
          <div className="card mt-8 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <p className="text-xs uppercase font-bold text-gray-500 tracking-wider">Tracking Number</p>
                <p className="font-mono text-2xl font-black text-brand">{data.orderNumber}</p>
              </div>
              <span className="px-4 py-2 rounded-full bg-brand/10 text-brand text-sm font-bold capitalize self-start md:self-auto">
                {data.orderStatus.replace('_', ' ')}
              </span>
            </div>

            <ol className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-6">
              {FLOW.map((s, i) => {
                const reached = data.statusHistory?.some((h) => h.status === s) || data.orderStatus === s;
                return (
                  <li key={s} className="flex items-center gap-2">
                    <span className={`w-7 h-7 rounded-full grid place-items-center text-xs font-bold shrink-0 ${reached ? 'bg-brand text-white' : 'bg-gray-200 text-gray-500'}`}>{i + 1}</span>
                    <span className={`capitalize font-semibold text-sm ${reached ? 'text-charcoal' : 'text-gray-400'}`}>{s}</span>
                  </li>
                );
              })}
            </ol>

            {['cancelled', 'rejected', 'payment_failed'].includes(data.orderStatus) && (
              <p className="mt-4 text-red-600 font-bold capitalize">Order {data.orderStatus.replace('_', ' ')}</p>
            )}

            <p className="mt-4 text-sm text-gray-500">Total: <b className="text-brand">Rs. {data.totalAmount}</b></p>
          </div>

          {showMap && (
            <div className="card mt-6 p-0 overflow-hidden">
              <div className="p-4 border-b flex justify-between items-center">
                <div>
                  <h2 className="font-extrabold text-lg">Live Rider Location</h2>
                  <p className="text-xs text-gray-500">
                    {data.riderLocation?.updatedAt
                      ? `Updated ${new Date(data.riderLocation.updatedAt).toLocaleTimeString()}`
                      : 'Waiting for rider to share location...'}
                  </p>
                </div>
                {data.orderStatus === 'dispatched' && (
                  <span className="flex items-center gap-2 text-xs font-bold text-green-700">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> LIVE
                  </span>
                )}
              </div>
              <div style={{ height: 400 }}>
                <MapContainer center={center} zoom={14} style={{ height: '100%', width: '100%' }}>
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <FitBounds points={mapPoints} />
                  {shopPos && <Marker position={shopPos} icon={shopIcon}><Popup>NUST Café</Popup></Marker>}
                  {customerPos && <Marker position={customerPos} icon={homeIcon}><Popup>Your location</Popup></Marker>}
                  {riderPos && <Marker position={riderPos} icon={riderIcon}><Popup>Rider</Popup></Marker>}
                  {riderPos && customerPos && (
                    <Polyline positions={[riderPos, customerPos]} color="#15803D" weight={4} dashArray="8 8" />
                  )}
                  {riderPos && shopPos && (
                    <Polyline positions={[shopPos, riderPos]} color="#9CA3AF" weight={3} />
                  )}
                </MapContainer>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}