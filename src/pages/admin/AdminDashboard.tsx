import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Package, ShoppingCart, IndianRupee, Clock, AlertTriangle, TrendingUp, ArrowRight } from 'lucide-react';
import { getAdminStats, getOrdersByStatus, getTopProducts } from '@/services/adminService';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';

export default function AdminDashboard() {
  const [stats, setStats] = useState<Awaited<ReturnType<typeof getAdminStats>> | null>(null);
  const [statusData, setStatusData] = useState<{ status: string; count: number }[]>([]);
  const [topProducts, setTopProducts] = useState<{ name: string; quantity: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [s, sd, tp] = await Promise.all([getAdminStats(), getOrdersByStatus(), getTopProducts()]);
        setStats(s);
        setStatusData(sd);
        setTopProducts(tp);
      } catch (err) {
        setError('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <LoadingSpinner size="lg" label="Loading dashboard..." />;
  if (error || !stats) return <ErrorMessage message={error || 'Failed to load dashboard.'} />;

  const cards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Products', value: stats.totalProducts, icon: Package, color: 'bg-green-50 text-green-600' },
    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'bg-purple-50 text-purple-600' },
    { label: 'Total Revenue', value: `₹${stats.totalRevenue.toFixed(0)}`, icon: IndianRupee, color: 'bg-amber-50 text-amber-600' },
    { label: 'Pending Orders', value: stats.pendingOrders, icon: Clock, color: 'bg-cyan-50 text-cyan-600' },
    { label: 'Low Stock Products', value: stats.lowStockProducts.length, icon: AlertTriangle, color: 'bg-red-50 text-red-600' },
  ];

  const maxStatusCount = Math.max(...statusData.map((s) => s.count), 1);
  const maxTopQty = Math.max(...topProducts.map((p) => p.quantity), 1);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.color} mb-3`}>
              <card.icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{card.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders by status */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Orders by Status</h2>
          {statusData.length === 0 ? (
            <p className="text-sm text-gray-500">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {statusData.map((s) => (
                <div key={s.status}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">{s.status}</span>
                    <span className="font-semibold text-gray-800">{s.count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100">
                    <div
                      className="h-2 rounded-full bg-green-600 transition-all"
                      style={{ width: `${(s.count / maxStatusCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top selling products */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" /> Top Selling Products
          </h2>
          {topProducts.length === 0 ? (
            <p className="text-sm text-gray-500">No sales data yet.</p>
          ) : (
            <div className="space-y-3">
              {topProducts.map((p, i) => (
                <div key={p.name} className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 text-sm font-bold text-green-700">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                    <div className="mt-1 h-1.5 rounded-full bg-gray-100">
                      <div
                        className="h-1.5 rounded-full bg-green-600"
                        style={{ width: `${(p.quantity / maxTopQty) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-bold text-gray-800">{p.quantity}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Low stock alert */}
      {stats.lowStockProducts.length > 0 && (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <h2 className="text-lg font-bold text-amber-800 mb-3 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" /> Low Stock Alert
          </h2>
          <div className="space-y-2">
            {stats.lowStockProducts.slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center justify-between text-sm">
                <span className="text-gray-700">{p.name}</span>
                <span className="font-semibold text-amber-700">{p.stock_quantity} left</span>
              </div>
            ))}
          </div>
          <Link to="/admin/products" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-amber-700 hover:text-amber-800">
            Manage Products <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
