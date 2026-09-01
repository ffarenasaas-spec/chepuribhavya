import { Link } from 'react-router-dom';
import { ShoppingBasket, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-600 text-white">
                <ShoppingBasket className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-white">FreshBasket</span>
            </div>
            <p className="text-sm leading-relaxed">
              Fresh groceries, everyday essentials, delivered to your doorstep.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-green-400 transition-colors">Home</Link></li>
              <li><Link to="/products" className="hover:text-green-400 transition-colors">Shop</Link></li>
              <li><Link to="/categories" className="hover:text-green-400 transition-colors">Categories</Link></li>
              <li><Link to="/about" className="hover:text-green-400 transition-colors">About</Link></li>
              <li><Link to="/contact" className="hover:text-green-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Customer */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Customer</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/profile" className="hover:text-green-400 transition-colors">My Account</Link></li>
              <li><Link to="/orders" className="hover:text-green-400 transition-colors">My Orders</Link></li>
              <li><Link to="/cart" className="hover:text-green-400 transition-colors">Cart</Link></li>
              <li><Link to="/contact" className="hover:text-green-400 transition-colors">Help</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-green-500" />
                <span>support@freshbasket.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-green-500" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-green-500 mt-0.5" />
                <span>123 Market Street, Bengaluru, Karnataka 560001</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-800 text-center text-sm">
          <p>&copy; 2026 FreshBasket. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
