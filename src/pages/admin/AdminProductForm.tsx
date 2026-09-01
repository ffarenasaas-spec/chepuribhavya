import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { getCategories } from '@/services/productService';
import { createProduct, updateProduct, getAdminProducts } from '@/services/adminService';
import type { Category, Product } from '@/types';
import { UNITS } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(isEdit);
  const [form, setForm] = useState({
    name: '',
    category_id: '',
    brand: '',
    description: '',
    price: '',
    discount_price: '',
    stock_quantity: '',
    unit: 'piece',
    image_url: '',
    is_active: true,
  });

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
    if (isEdit) {
      getAdminProducts().then((products) => {
        const product = products.find((p) => p.id === id);
        if (product) {
          setForm({
            name: product.name,
            category_id: product.category_id ?? '',
            brand: product.brand ?? '',
            description: product.description ?? '',
            price: String(product.price),
            discount_price: product.discount_price ? String(product.discount_price) : '',
            stock_quantity: String(product.stock_quantity),
            unit: product.unit,
            image_url: product.image_url ?? '',
            is_active: product.is_active,
          });
        }
        setPageLoading(false);
      });
    }
  }, [id, isEdit]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Product name is required.'); return; }
    if (!form.price || Number(form.price) <= 0) { toast.error('Valid price is required.'); return; }
    if (!form.category_id) { toast.error('Category is required.'); return; }

    setLoading(true);
    const payload = {
      name: form.name,
      category_id: form.category_id,
      brand: form.brand || undefined,
      description: form.description || undefined,
      price: Number(form.price),
      discount_price: form.discount_price ? Number(form.discount_price) : null,
      stock_quantity: form.stock_quantity ? Number(form.stock_quantity) : 0,
      unit: form.unit,
      image_url: form.image_url || undefined,
      is_active: form.is_active,
    };

    try {
      if (isEdit) {
        await updateProduct(id!, payload);
        toast.success('Product updated successfully!');
      } else {
        await createProduct(payload);
        toast.success('Product created successfully!');
      }
      navigate('/admin/products');
    } catch (err: any) {
      toast.error(err.message ?? 'Something went wrong.');
    }
    setLoading(false);
  };

  if (pageLoading) return <LoadingSpinner size="lg" label="Loading product..." />;

  return (
    <div className="max-w-2xl">
      <Link to="/admin/products" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-green-700 mb-4">
        <ArrowLeft className="h-4 w-4" /> Back to Products
      </Link>

      <h1 className="text-2xl font-bold text-gray-800 mb-6">{isEdit ? 'Edit Product' : 'Add Product'}</h1>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Name *</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category *</label>
            <select
              required
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-green-500 focus:outline-none"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Brand</label>
            <input
              type="text"
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-green-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-green-500 focus:outline-none resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (₹) *</label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-green-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Discount Price (₹)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.discount_price}
              onChange={(e) => setForm({ ...form, discount_price: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-green-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Stock Quantity</label>
            <input
              type="number"
              min="0"
              value={form.stock_quantity}
              onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-green-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Unit</label>
            <select
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-green-500 focus:outline-none"
            >
              {UNITS.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Image URL</label>
            <input
              type="url"
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              placeholder="https://..."
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-green-500 focus:outline-none"
            />
          </div>
        </div>

        {form.image_url && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1.5">Image Preview</p>
            <img src={form.image_url} alt="Preview" className="h-24 w-24 rounded-xl object-cover border border-gray-100" />
          </div>
        )}

        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
          />
          Active (visible to customers)
        </label>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60"
        >
          {loading ? <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="h-4 w-4" />}
          {isEdit ? 'Update Product' : 'Create Product'}
        </button>
      </form>
    </div>
  );
}
