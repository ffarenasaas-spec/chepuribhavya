import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import type { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import Rating from '@/components/ui/Rating';
import toast from 'react-hot-toast';

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const effectivePrice = product.discount_price ?? product.price;
  const discountPercent = product.discount_price
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : 0;
  const outOfStock = product.stock_quantity <= 0;
  const rating = 4 + ((product.name.length % 10) / 10);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) {
      toast.error('This product is currently out of stock.');
      return;
    }
    try {
      await addToCart(product.id, 1);
      toast.success(`${product.name} added to cart`);
    } catch {
      toast.error('Failed to add item to cart. Please sign in.');
    }
  };

  return (
    <Link
      to={`/products/${product.id}`}
      className="group flex flex-col rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-green-200 hover:-translate-y-0.5"
    >
      <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-50">
        <img
          src={product.image_url ?? ''}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {discountPercent > 0 && (
          <span className="absolute top-2 left-2 rounded-md bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
            {discountPercent}% OFF
          </span>
        )}
        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="rounded-lg bg-white px-3 py-1 text-sm font-semibold text-gray-800">Out of Stock</span>
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-1 flex-col">
        <p className="text-xs font-medium text-green-600">{product.brand ?? 'FreshBasket'}</p>
        <h3 className="mt-0.5 text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-green-700">
          {product.name}
        </h3>
        <div className="mt-1">
          <Rating rating={rating} />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-gray-800">&#8377;{effectivePrice.toFixed(0)}</span>
          {product.discount_price && (
            <span className="text-sm text-gray-400 line-through">&#8377;{product.price.toFixed(0)}</span>
          )}
          <span className="text-xs text-gray-500">/ {product.unit}</span>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={outOfStock}
          className="mt-3 flex items-center justify-center gap-1.5 rounded-lg bg-green-50 py-2 text-sm font-medium text-green-700 transition-colors hover:bg-green-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </button>
      </div>
    </Link>
  );
}
