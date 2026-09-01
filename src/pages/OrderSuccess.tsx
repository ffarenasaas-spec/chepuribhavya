import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, MapPin, ArrowRight } from 'lucide-react';
import { getOrderById } from '@/services/orderService';
import type { Order } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import OrderStatusBadge from '@/components/ui/OrderStatusBadge';

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getOrderById(id)
      .then((data) => setOrder(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner size="lg" label="Loading order details..." />;
  if (!order) return <p className="text-center py-12 text-gray-500">Order not found.</p>;

  const deliveryDate = new Date(order.created_at);
  deliveryDate.setDate(deliveryDate.getDate() + 3);
  const addr = order.delivery_address ?? {};

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-gray-800">Order Placed Successfully!</h1>
        <p className="mt-1 text-sm text-gray-500">Thank you for your purchase. Your order is being processed.</p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-gray-50">
          <div>
            <p className="text-xs text-gray-500">Order ID</p>
            <p className="text-sm font-bold text-gray-800">#{order.id.slice(0, 8).toUpperCase()}</p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <Truck className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Estimated Delivery</p>
              <p className="text-sm font-semibold text-gray-800">{deliveryDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Package className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Total Amount</p>
              <p className="text-sm font-semibold text-gray-800">&#8377;{Number(order.total_amount).toFixed(0)}</p>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 pt-4 border-t border-gray-50">
          <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
          <div>
            <p className="text-xs text-gray-500">Delivery Address</p>
            <p className="text-sm text-gray-700">{addr.full_name}, {addr.phone}</p>
            <p className="text-sm text-gray-700">{addr.address}, {addr.city}, {addr.state} - {addr.pincode}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <Link
          to={`/orders/${order.id}`}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
        >
          View Order <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          to="/products"
          className="flex-1 inline-flex items-center justify-center rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
