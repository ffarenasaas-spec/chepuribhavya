import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Zap, Truck, ShieldCheck, Minus, Plus } from 'lucide-react';
import { getProductById, getRelatedProducts } from '@/services/productService';
import type { Product } from '@/types';
import Rating from '@/components/ui/Rating';
import ProductCard from '@/components/ProductCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError('');
    Promise.all([
      getProductById(id),
      getRelatedProducts(id, id, 4),
    ]).then(([p, r]) => {
      if (!p) {
        setError('Product not found.');
      } else {
        setProduct(p);
        setRelated(r);
      }
    }).catch(() => {
      setError('Something went wrong. Please try again.');
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner size="lg" label="Loading product..." />;
  if (error) return <ErrorMessage message={error} onRetry={() => navigate('/products')} />;
  if (!product) return null;

  const effectivePrice = product.discount_price ?? product.price;
  const discountPercent = product.discount_price
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : 0;
  const outOfStock = product.stock_quantity <= 0;
  const rating = 4 + ((product.name.length % 10) / 10);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please sign in to add items to your cart.');
      navigate('/login', { state: { from: `/products/${product.id}` } });
      return;
    }
    if (outOfStock) {
      toast.error('This product is currently out of stock.');
      return;
    }
    try {
      await addToCart(product.id, quantity);
      toast.success(`${quantity} x ${product.name} added to cart`);
    } catch {
      toast.error('Failed to add item to cart.');
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      toast.error('Please sign in to continue.');
      navigate('/login', { state: { from: `/products/${product.id}` } });
      return;
    }
    if (outOfStock) {
      toast.error('This product is currently out of stock.');
      return;
    }
    try {
      await addToCart(product.id, quantity);
      navigate('/checkout');
    } catch {
      toast.error('Failed to proceed to checkout.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link to="/products" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-green-700 mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image */}
        <div className="relative rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
          <img
            src={product.image_url ?? ''}
            alt={product.name}
            className="w-full aspect-square object-cover"
          />
          {discountPercent > 0 && (
            <span className="absolute top-4 left-4 rounded-md bg-red-500 px-3 py-1 text-sm font-bold text-white">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Details */}
        <div>
          <p className="text-sm font-medium text-green-600">{product.brand ?? 'FreshBasket'}</p>
          <h1 className="mt-1 text-2xl lg:text-3xl font-bold text-gray-800">{product.name}</h1>
          <div className="mt-2"><Rating rating={rating} size="md" /></div>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-gray-800">&#8377;{effectivePrice.toFixed(0)}</span>
            {product.discount_price && (
              <span className="text-lg text-gray-400 line-through">&#8377;{product.price.toFixed(0)}</span>
            )}
            <span className="text-sm text-gray-500">/ {product.unit}</span>
          </div>

          <div className="mt-4">
            {outOfStock ? (
              <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
                Out of Stock
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                In Stock ({product.stock_quantity} available)
              </span>
            )}
          </div>

          <p className="mt-4 text-sm text-gray-600 leading-relaxed">{product.description ?? 'No description available.'}</p>

          {/* Quantity selector */}
          {!outOfStock && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <div className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-10 w-10 flex items-center justify-center rounded-md text-gray-600 hover:bg-gray-100"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-[3rem] text-center font-semibold text-gray-800">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                  className="h-10 w-10 flex items-center justify-center rounded-md text-gray-600 hover:bg-gray-100"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAddToCart}
              disabled={outOfStock}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="h-4 w-4" /> Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              disabled={outOfStock}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-green-600 py-3 text-sm font-semibold text-green-700 transition-colors hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Zap className="h-4 w-4" /> Buy Now
            </button>
          </div>

          {/* Features */}
          <div className="mt-8 grid grid-cols-3 gap-3">
            {[
              { icon: Truck, label: 'Fast Delivery', desc: 'Within 2 hours' },
              { icon: ShieldCheck, label: 'Secure', desc: 'Safe payment' },
              { icon: ShoppingCart, label: 'Easy Returns', desc: '7-day policy' },
            ].map((f) => (
              <div key={f.label} className="rounded-xl border border-gray-100 bg-white p-3 text-center">
                <f.icon className="mx-auto h-5 w-5 text-green-600" />
                <p className="mt-1 text-xs font-semibold text-gray-700">{f.label}</p>
                <p className="text-xs text-gray-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Related Products</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
