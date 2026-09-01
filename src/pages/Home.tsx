import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBasket, ArrowRight, Truck, ShieldCheck, RefreshCw, Leaf } from 'lucide-react';
import { getFeaturedProducts, getNewestProducts, getCategories } from '@/services/productService';
import type { Product, Category } from '@/types';
import ProductCard from '@/components/ProductCard';
import CategoryCard from '@/components/CategoryCard';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';


export default function Home() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [newest, setNewest] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroImage, setHeroImage] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [f, n, c] = await Promise.all([
          getFeaturedProducts(8),
          getNewestProducts(4),
          getCategories(),
        ]);
        setFeatured(f);
        setNewest(n);
        setCategories(c.slice(0, 6));
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    setHeroImage('https://images.pexels.com/photos/9705821/pexels-photo-9705821.jpeg?auto=compress&cs=tinysrgb&h=650&w=940');
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 via-white to-green-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 mb-4">
                <Leaf className="h-3.5 w-3.5" />
                100% Fresh & Organic
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
                Fresh Groceries Delivered to Your Door
              </h1>
              <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-lg mx-auto lg:mx-0">
                Shop fresh fruits, vegetables, dairy, snacks and everyday essentials at great prices.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-7 py-3 text-base font-medium text-white shadow-md transition-all hover:bg-green-700 hover:shadow-lg"
                >
                  Shop Now
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/categories"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-7 py-3 text-base font-medium text-gray-700 transition-all hover:bg-gray-50"
                >
                  Explore Categories
                </Link>
              </div>
            </div>
            <div className="relative hidden lg:block">
              {heroImage && (
                <img
                  src={heroImage}
                  alt="Fresh groceries"
                  className="w-full h-96 object-cover rounded-3xl shadow-xl"
                />
              )}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg p-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
                  <Truck className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">Fast Delivery</p>
                  <p className="text-xs text-gray-500">Within 2 hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: 'Fast Delivery', desc: 'Within 2 hours' },
              { icon: ShieldCheck, title: 'Secure Payment', desc: '100% protected' },
              { icon: RefreshCw, title: 'Easy Returns', desc: '7-day return policy' },
              { icon: Leaf, title: 'Fresh & Organic', desc: 'Quality guaranteed' },
            ].map((f) => (
              <div key={f.title} className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600 shrink-0">
                  <f.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">{f.title}</p>
                  <p className="text-xs text-gray-500">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Shop by Category</h2>
            <p className="text-sm text-gray-500 mt-1">Browse your favorite grocery categories</p>
          </div>
          <Link to="/categories" className="text-sm font-medium text-green-600 hover:text-green-700 flex items-center gap-1">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Featured Products</h2>
            <p className="text-sm text-gray-500 mt-1">Special deals on fresh items</p>
          </div>
          <Link to="/products" className="text-sm font-medium text-green-600 hover:text-green-700 flex items-center gap-1">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Promo Banner */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="rounded-3xl bg-gradient-to-r from-green-600 to-green-700 p-8 lg:p-12 text-white text-center">
          <ShoppingBasket className="mx-auto h-12 w-12 mb-4 opacity-80" />
          <h2 className="text-2xl lg:text-3xl font-bold">Get 10% Off on Orders Above ₹1000</h2>
          <p className="mt-2 text-green-100">Use your cart to save big on your grocery shopping</p>
          <Link
            to="/products"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-green-700 transition-colors hover:bg-green-50"
          >
            Start Shopping <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 py-8 pb-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">New Arrivals</h2>
        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {newest.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
