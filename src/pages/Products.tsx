import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, Search } from 'lucide-react';
import { getProducts, getCategories, getBrands } from '@/services/productService';
import type { Product, Category } from '@/types';
import ProductCard from '@/components/ProductCard';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import ErrorMessage from '@/components/ui/ErrorMessage';

const PAGE_SIZE = 12;

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const search = searchParams.get('search') ?? '';
  const categoryId = searchParams.get('category') ?? '';
  const brand = searchParams.get('brand') ?? '';
  const sort = searchParams.get('sort') ?? 'newest';
  const minPrice = searchParams.get('minPrice') ?? '';
  const maxPrice = searchParams.get('maxPrice') ?? '';

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { products: data, total: count } = await getProducts({
        search: search || undefined,
        categoryId: categoryId || undefined,
        brand: brand || undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        sort,
        limit: PAGE_SIZE,
      });
      setProducts(data);
      setTotal(count);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [search, categoryId, brand, sort, minPrice, maxPrice]);

  useEffect(() => {
    async function loadFilters() {
      try {
        const [cats, brnds] = await Promise.all([getCategories(), getBrands()]);
        setCategories(cats);
        setBrands(brnds);
      } catch (err) {
        console.error('Failed to load filters:', err);
      }
    }
    loadFilters();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const updateParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const hasFilters = !!(search || categoryId || brand || minPrice || maxPrice);

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-bold text-gray-800 mb-3">Categories</h3>
        <div className="space-y-1.5">
          <button
            onClick={() => updateParam('category', '')}
            className={`block w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${!categoryId ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateParam('category', cat.id)}
              className={`block w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${categoryId === cat.id ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-gray-800 mb-3">Brands</h3>
        <div className="space-y-1.5">
          <button
            onClick={() => updateParam('brand', '')}
            className={`block w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${!brand ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            All Brands
          </button>
          {brands.map((b) => (
            <button
              key={b}
              onClick={() => updateParam('brand', b)}
              className={`block w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${brand === b ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-gray-800 mb-3">Price Range</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => updateParam('minPrice', e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:border-green-500 focus:outline-none"
          />
          <span className="text-gray-400">-</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => updateParam('maxPrice', e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:border-green-500 focus:outline-none"
          />
        </div>
      </div>

      {hasFilters && (
        <button
          onClick={clearFilters}
          className="w-full rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Shop Fresh Groceries</h1>
        <p className="text-sm text-gray-500 mt-1">{total} products available</p>
      </div>

      <div className="flex gap-6">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <FilterPanel />
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <button
              onClick={() => setShowFilters(true)}
              className="lg:hidden flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </button>

            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-gray-500 hidden sm:inline">Sort by:</span>
              <select
                value={sort}
                onChange={(e) => updateParam('sort', e.target.value)}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-green-500 focus:outline-none"
              >
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Products grid */}
          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : error ? (
            <ErrorMessage message={error} onRetry={loadProducts} />
          ) : products.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No products found"
              description="Try adjusting your search or filters to find what you're looking for."
              action={hasFilters ? (
                <button onClick={clearFilters} className="rounded-lg bg-green-600 px-5 py-2 text-sm font-medium text-white hover:bg-green-700">
                  Clear Filters
                </button>
              ) : undefined}
            />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              {total > products.length && (
                <div className="mt-8 text-center">
                  <p className="text-sm text-gray-500">Showing {products.length} of {total} products</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowFilters(false)} />
          <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white p-5 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">Filters</h2>
              <button onClick={() => setShowFilters(false)} className="p-1 rounded-lg hover:bg-gray-100">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <FilterPanel />
          </div>
        </div>
      )}
    </div>
  );
}
