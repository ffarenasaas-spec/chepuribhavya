import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Truck, CreditCard, ClipboardList } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { placeOrder } from '@/services/orderService';
import toast from 'react-hot-toast';

export default function Checkout() {
  const { cartItems, cartSubtotal, clearCart } = useCart();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [address, setAddress] = useState({
    full_name: profile?.full_name ?? '',
    phone: profile?.phone ?? '',
    address: profile?.address ?? '',
    city: profile?.city ?? '',
    state: profile?.state ?? '',
    pincode: profile?.pincode ?? '',
  });

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const deliveryFee = cartSubtotal > 500 ? 0 : 40;
  const discount = cartSubtotal > 1000 ? cartSubtotal * 0.1 : 0;
  const total = cartSubtotal + deliveryFee - discount;

  const handleAddressSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!address.full_name || !address.phone || !address.address || !address.city || !address.state || !address.pincode) {
      toast.error('Please fill in all delivery address fields.');
      return;
    }
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const orderId = await placeOrder(address, paymentMethod);
      await clearCart();
      toast.success('Order placed successfully!');
      navigate(`/order-success/${orderId}`);
    } catch (err: any) {
      toast.error(err.message ?? 'Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  const steps = [
    { num: 1, label: 'Delivery Address', icon: Truck },
    { num: 2, label: 'Order Summary', icon: ClipboardList },
    { num: 3, label: 'Payment', icon: CreditCard },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>

      {/* Stepper */}
      <div className="flex items-center justify-center mb-8">
        {steps.map((s, i) => (
          <div key={s.num} className="flex items-center">
            <div className={`flex flex-col items-center ${step >= s.num ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${step >= s.num ? 'border-green-600 bg-green-50' : 'border-gray-200'}`}>
                {step > s.num ? <Check className="h-5 w-5" /> : <s.icon className="h-5 w-5" />}
              </div>
              <span className="mt-1 text-xs font-medium">{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`h-0.5 w-12 sm:w-24 ${step > s.num ? 'bg-green-600' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Delivery Address */}
      {step === 1 && (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Delivery Address</h2>
          <form onSubmit={handleAddressSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={address.full_name}
                  onChange={(e) => setAddress({ ...address, full_name: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                <input
                  type="tel"
                  required
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
              <textarea
                required
                value={address.address}
                onChange={(e) => setAddress({ ...address, address: e.target.value })}
                rows={2}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 resize-none"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
                <input
                  type="text"
                  required
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">State</label>
                <input
                  type="text"
                  required
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Pincode</label>
                <input
                  type="text"
                  required
                  value={address.pincode}
                  onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700"
            >
              Continue to Summary
            </button>
          </form>
        </div>
      )}

      {/* Step 2: Order Summary */}
      {step === 2 && (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h2>
          <div className="space-y-3 mb-4">
            {cartItems.map((item) => {
              const price = item.product?.discount_price ?? item.product?.price ?? 0;
              return (
                <div key={item.id} className="flex items-center gap-3 pb-3 border-b border-gray-50 last:border-0">
                  <img src={item.product?.image_url ?? ''} alt="" className="h-14 w-14 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">{item.product?.name}</p>
                    <p className="text-xs text-gray-500">{item.quantity} x &#8377;{price.toFixed(0)}</p>
                  </div>
                  <p className="text-sm font-bold text-gray-800">&#8377;{(price * item.quantity).toFixed(0)}</p>
                </div>
              );
            })}
          </div>
          <div className="space-y-2 text-sm border-t border-gray-100 pt-3">
            <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>&#8377;{cartSubtotal.toFixed(0)}</span></div>
            <div className="flex justify-between text-gray-600"><span>Delivery Fee</span><span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(0)}`}</span></div>
            {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-&#8377;{discount.toFixed(0)}</span></div>}
            <div className="flex justify-between font-bold text-gray-800 pt-1"><span>Total</span><span>&#8377;{total.toFixed(0)}</span></div>
          </div>
          <div className="mt-6 flex gap-3">
            <button onClick={() => setStep(1)} className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Back
            </button>
            <button onClick={() => setStep(3)} className="flex-1 rounded-lg bg-green-600 py-2.5 text-sm font-semibold text-white hover:bg-green-700">
              Continue to Payment
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Payment */}
      {step === 3 && (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Payment Method</h2>
          <div className="space-y-3">
            <label className={`flex items-center gap-3 rounded-xl border-2 p-4 cursor-pointer transition-colors ${paymentMethod === 'Cash on Delivery' ? 'border-green-600 bg-green-50' : 'border-gray-200'}`}>
              <input
                type="radio"
                name="payment"
                value="Cash on Delivery"
                checked={paymentMethod === 'Cash on Delivery'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="text-green-600 focus:ring-green-500"
              />
              <div>
                <p className="text-sm font-semibold text-gray-800">Cash on Delivery</p>
                <p className="text-xs text-gray-500">Pay with cash when your order is delivered</p>
              </div>
            </label>
            <div className="flex items-center gap-3 rounded-xl border-2 border-dashed border-gray-200 p-4 opacity-50">
              <CreditCard className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-semibold text-gray-500">Online Payment</p>
                <p className="text-xs text-gray-400">Coming soon</p>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-gray-50 p-4">
            <div className="flex justify-between font-bold text-gray-800">
              <span>Total Amount</span>
              <span className="text-lg">&#8377;{total.toFixed(0)}</span>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button onClick={() => setStep(2)} className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Back
            </button>
            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="flex-1 rounded-lg bg-green-600 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Placing Order...</>
              ) : (
                'Place Order'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
