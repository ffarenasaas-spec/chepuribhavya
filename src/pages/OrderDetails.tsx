import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, CreditCard, Package } from 'lucide-react';
import { getOrderById } from '@/services/orderService';
import type { Order } from '@/types';
import OrderStatusBadge from '@/components/ui/OrderStatusBadge';
import OrderTimeline from '@/components/ui/OrderTimeline';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    getOrderById(id)
      .then((data) => {
        if (!data) setError('Order not found.');
        else setOrder(data);
      })
      .catch(() => setError('Something went wrong. Please try again.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner size="lg" label="Loading order details..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!order) return null;

  const addr = order.delivery_address ?? {};

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/orders" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-green-700 mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Orders
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Order Details</h1>
          <p className="text-sm text-gray-500 mt-0.5">Order #{order.id.slice(0, 8).toUpperCase()}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* Timeline */}
      <div className="mb-6">
        <OrderTimeline currentStatus={order.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Package className="h-5 w-5 text-green-600" /> Order Items
            </h2>
            <div className="space-y-3">
              {order.order_items?.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{item.product_name}</p>
                    <p className="text-xs text-gray-500">{item.quantity} x &#8377;{Number(item.price).toFixed(0)}</p>
                  </div>
                  <p className="text-sm font-bold text-gray-800">&#8377;{Number(item.subtotal).toFixed(0)}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>&#8377;{Number(order.subtotal).toFixed(0)}</span></div>
              <div className="flex justify-between text-gray-600"><span>Delivery Fee</span><span>&#8377;{Number(order.delivery_fee).toFixed(0)}</span></div>
              {Number(order.discount) > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-&#8377;{Number(order.discount).toFixed(0)}</span></div>}
              <div className="flex justify-between font-bold text-gray-800 pt-1"><span>Total</span><span className="text-lg">&#8377;{Number(order.total_amount).toFixed(0)}</span></div>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-green-600" /> Delivery Address
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-medium text-gray-800">{addr.full_name}</p>
              <p>{addr.phone}</p>
              <p>{addr.address}</p>
              <p>{addr.city}, {addr.state} - {addr.pincode}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-green-600" /> Payment Info
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Method: <span className="font-medium text-gray-800">{order.payment_method}</span></p>
              <p>Status: <span className="font-medium text-gray-800">{order.payment_status}</span></p>
              <p>Date: <span className="font-medium text-gray-800">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
