import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Pencil, Trash2, Power } from 'lucide-react';
import { getAdminProducts, deleteProduct, updateProduct } from '@/services/adminService';
import { getCategories } from '@/services/productService';
import type { Product, Category } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';
import EmptyState from '@/components/ui/EmptyState';
import OrderStatusBadge from '@/components/ui/OrderStatusBadge';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [prods, cats] = await Promise.all([getAdminProducts(), getCategories()]);
        setProducts(prods);
        setCategories(cats);
      } catch (err) {
        setError('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = products.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (categoryFilter && p.category_id !== categoryFilter) return false;
    return true;
  });

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
      toast.success('Product deleted.');
    } catch (err) {
      toast.error('Failed to delete product.');
    }
  };

  const handleToggleActive = async (product: Product) => {
    try {
      await updateProduct(product.id, { is_active: !product.is_active });
      setProducts(products.map((p) => (p.id === product.id ? { ...p, is_active: !p.is_active } : p)));
      toast.success(product.is_active ? 'Product deactivated.' : 'Product activated.');
    } catch (err) {
      toast.error('Failed to update product.');
    }
  };

  if (loading) return <LoadingSpinner size="lg" label="Loading products..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Products</h1>
        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
        >
          <Plus className="h-4 w-4" /> Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm focus:border-green-500 focus:outline-none"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Plus}
          title="No products found"
          description="Add your first product to start selling."
          action={
            <Link to="/admin/products/new" className="inline-block rounded-lg bg-green-600 px-5 py-2 text-sm font-medium text-white hover:bg-green-700">
              Add Product
            </Link>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Product</th>
                <th className="px-4 py-3 text-left font-semibold">Category</th>
                <th className="px-4 py-3 text-left font-semibold">Price</th>
                <th className="px-4 py-3 text-left font-semibold">Stock</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.image_url ?? ''} alt="" className="h-10 w-10 rounded-lg object-cover" />
                      <div>
                        <p className="font-medium text-gray-800">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{p.category?.name ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-gray-800">₹{(p.discount_price ?? p.price).toFixed(0)}</span>
                    {p.discount_price && <span className="text-xs text-gray-400 line-through ml-1">₹{p.price.toFixed(0)}</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={p.stock_quantity < 10 ? 'font-semibold text-red-600' : 'text-gray-600'}>
                      {p.stock_quantity}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {p.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link to={`/admin/products/${p.id}/edit`} className="p-1.5 rounded-lg text-gray-500 hover:bg-blue-50 hover:text-blue-600" title="Edit">
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button onClick={() => handleToggleActive(p)} className="p-1.5 rounded-lg text-gray-500 hover:bg-amber-50 hover:text-amber-600" title="Toggle active">
                        <Power className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(p.id, p.name)} className="p-1.5 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
