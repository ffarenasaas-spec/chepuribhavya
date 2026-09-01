import { type ReactNode, useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBasket, LayoutDashboard, Package, ClipboardList, Users, LogOut, Menu, X, Home } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/products', label: 'Products', icon: Package },
    { to: '/admin/orders', label: 'Orders', icon: ClipboardList },
    { to: '/admin/users', label: 'Users', icon: Users },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-gray-900 text-gray-300 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center gap-2 px-5 h-16 border-b border-gray-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600 text-white">
            <ShoppingBasket className="h-4 w-4" />
          </div>
          <span className="text-lg font-bold text-white">FreshBasket</span>
          <span className="ml-1 rounded bg-green-600 px-1.5 py-0.5 text-[10px] font-bold text-white">ADMIN</span>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive(item.to)
                  ? 'bg-green-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <div className="mb-3 px-3">
            <p className="text-sm font-medium text-white truncate">{profile?.full_name ?? 'Admin'}</p>
            <p className="text-xs text-gray-500 truncate">{profile?.email}</p>
          </div>
          <Link to="/" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-white">
            <Home className="h-4 w-4" /> Back to Store
          </Link>
          <button onClick={handleSignOut} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-900/30">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <header className="lg:hidden sticky top-0 z-20 flex items-center justify-between bg-white border-b border-gray-100 px-4 h-16">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-gray-100">
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <span className="font-bold text-gray-800">Admin Panel</span>
          <div className="w-9" />
        </header>

        <div className="p-4 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
