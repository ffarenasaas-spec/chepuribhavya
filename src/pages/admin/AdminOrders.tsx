import { useEffect, useState } from 'react';
import { Search, Eye } from 'lucide-react';
import { getAllOrders, updateOrderStatus } from '@/services/orderService';
import type { Order } from '@/types';
import { ORDER_STATUSES } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';
import EmptyState from '@/components/ui/EmptyState';
import OrderStatusBadge from '@/components/ui/OrderStatusBadge';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [updatingId, setUpdatingId] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const data = await getAllOrders();
        setOrders(data);
      } catch (err) {
        setError('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = orders.filter((o) => {
    if (search) {
      const s = search.toLowerCase();
      if (!o.id.toLowerCase().includes(s) && !JSON.stringify(o.delivery_address ?? {}).toLowerCase().includes(s)) return false;
    }
    if (statusFilter && o.status !== statusFilter) return false;
    return true;
  });

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
      toast.success('Order status updated.');
    } catch (err) {
      toast.error('Failed to update order status.');
    }
    setUpdatingId('');
  };

  if (loading) return <LoadingSpinner size="lg" label="Loading orders..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Orders</h1>

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID or address..."
            className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm focus:border-green-500 focus:outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
        >
          <option value="">All Statuses</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Search} title="No orders found" description="No orders match your filters." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Order ID</th>
                <th className="px-4 py-3 text-left font-semibold">Customer</th>
                <th className="px-4 py-3 text-left font-semibold">Date</th>
                <th className="px-4 py-3 text-left font-semibold">Total</th>
                <th className="px-4 py-3 text-left font-semibold">Payment</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((o) => {
                const addr = o.delivery_address ?? {};
                const profile = (o as any).profiles;
                return (
                  <tr key={o.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">#{o.id.slice(0, 8).toUpperCase()}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800">{addr.full_name ?? profile?.full_name ?? '—'}</p>
                      <p className="text-xs text-gray-400">{profile?.email ?? ''}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(o.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-800">₹{Number(o.total_amount).toFixed(0)}</td>
                    <td className="px-4 py-3 text-gray-600">{o.payment_status}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <OrderStatusBadge status={o.status} />
                        <select
                          value={o.status}
                          onChange={(e) => handleStatusChange(o.id, e.target.value)}
                          disabled={updatingId === o.id}
                          className="rounded-md border border-gray-200 px-2 py-1 text-xs focus:border-green-500 focus:outline-none disabled:opacity-50"
                        >
                          {ORDER_STATUSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link to={`/orders/${o.id}`} className="inline-flex p-1.5 rounded-lg text-gray-500 hover:bg-blue-50 hover:text-blue-600" title="View Details">
                        <Eye className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
