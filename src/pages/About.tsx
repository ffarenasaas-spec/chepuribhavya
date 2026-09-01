import { ShoppingBasket, Leaf, Truck, ShieldCheck, Heart, Users } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-green-600 text-white mb-4">
          <ShoppingBasket className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800">About FreshBasket</h1>
        <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
          FreshBasket is your trusted online grocery store, bringing fresh fruits, vegetables, dairy,
          and everyday essentials right to your doorstep. We believe everyone deserves access to fresh,
          quality groceries at affordable prices.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { icon: Leaf, title: 'Fresh & Organic', desc: 'We source our produce directly from local farms to ensure maximum freshness and quality.' },
          { icon: Truck, title: 'Fast Delivery', desc: 'Get your groceries delivered within 2 hours of placing your order.' },
          { icon: ShieldCheck, title: 'Quality Assured', desc: 'Every product goes through strict quality checks before reaching you.' },
        ].map((f) => (
          <div key={f.title} className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600 mb-3">
              <f.icon className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-gray-800">{f.title}</h3>
            <p className="mt-1 text-sm text-gray-500">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-green-600 p-8 lg:p-12 text-white text-center">
        <Heart className="mx-auto h-10 w-10 mb-3 opacity-80" />
        <h2 className="text-2xl font-bold">Our Mission</h2>
        <p className="mt-2 text-green-100 max-w-2xl mx-auto">
          To make fresh, healthy groceries accessible to every household while supporting local farmers
          and promoting sustainable shopping practices.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {[
          { value: '10K+', label: 'Happy Customers' },
          { value: '500+', label: 'Products' },
          { value: '50+', label: 'Categories' },
          { value: '2hr', label: 'Delivery Time' },
        ].map((stat) => (
          <div key={stat.label}>
            <p className="text-3xl font-bold text-green-600">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
