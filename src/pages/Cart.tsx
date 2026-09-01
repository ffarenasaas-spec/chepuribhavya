import { Link } from 'react-router-dom';
import { Trash2, ShoppingCart, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import QuantitySelector from '@/components/ui/QuantitySelector';
import EmptyState from '@/components/ui/EmptyState';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function Cart() {
  const { cartItems, cartLoading, cartSubtotal, updateQuantity, removeFromCart } = useCart();

  if (cartLoading) return <LoadingSpinner size="lg" label="Loading your cart..." />;

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <EmptyState
          icon={ShoppingCart}
          title="Your cart is empty"
          description="Browse our fresh groceries and add items to your cart."
          action={
            <Link to="/products" className="inline-block rounded-lg bg-green-600 px-5 py-2 text-sm font-medium text-white hover:bg-green-700">
              Start Shopping
            </Link>
          }
        />
      </div>
    );
  }

  const deliveryFee = cartSubtotal > 500 ? 0 : 40;
  const discount = cartSubtotal > 1000 ? cartSubtotal * 0.1 : 0;
  const total = cartSubtotal + deliveryFee - discount;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-3">
          {cartItems.map((item) => {
            const price = item.product?.discount_price ?? item.product?.price ?? 0;
            return (
              <div key={item.id} className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                <Link to={`/products/${item.product_id}`} className="shrink-0">
                  <img
                    src={item.product?.image_url ?? ''}
                    alt={item.product?.name ?? ''}
                    className="h-20 w-20 rounded-xl object-cover"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs text-green-600 font-medium">{item.product?.brand}</p>
                      <Link to={`/products/${item.product_id}`} className="text-sm font-semibold text-gray-800 hover:text-green-700">
                        {item.product?.name}
                      </Link>
                      <p className="text-xs text-gray-500 mt-0.5">{item.product?.unit}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <QuantitySelector
                      quantity={item.quantity}
                      onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                      onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
                      size="sm"
                    />
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-800">&#8377;{(price * item.quantity).toFixed(0)}</p>
                      {item.product?.discount_price && (
                        <p className="text-xs text-gray-400 line-through">&#8377;{(item.product.price * item.quantity).toFixed(0)}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <Link to="/products" className="inline-flex items-center gap-1.5 text-sm text-green-600 hover:text-green-700 font-medium mt-2">
            <ArrowLeft className="h-4 w-4" /> Continue Shopping
          </Link>
        </div>

        {/* Cart summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium text-gray-800">&#8377;{cartSubtotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span className="font-medium text-gray-800">
                  {deliveryFee === 0 ? <span className="text-green-600">FREE</span> : `₹${deliveryFee.toFixed(0)}`}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount (10%)</span>
                  <span className="font-medium">-&#8377;{discount.toFixed(0)}</span>
                </div>
              )}
              <div className="border-t border-gray-100 pt-2 mt-2 flex justify-between">
                <span className="font-bold text-gray-800">Grand Total</span>
                <span className="font-bold text-gray-800 text-lg">&#8377;{total.toFixed(0)}</span>
              </div>
            </div>

            {deliveryFee > 0 && (
              <p className="mt-3 text-xs text-gray-500 text-center">
                Add &#8377;{(500 - cartSubtotal).toFixed(0)} more for free delivery!
              </p>
            )}

            <Link
              to="/checkout"
              className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700"
            >
              Proceed to Checkout <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
