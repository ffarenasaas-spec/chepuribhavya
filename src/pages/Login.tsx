import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBasket, Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { signIn, resendVerification } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState('');

  const from = (location.state as { from?: string })?.from ?? '/';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setUnverifiedEmail('');

    const { error } = await signIn(email, password);

    if (error) {
      if (error.includes('verify your email')) {
        setUnverifiedEmail(email);
        toast.error(error);
      } else {
        toast.error(error);
      }
    } else {
      toast.success('Welcome back!');
      navigate(from);
    }
    setLoading(false);
  };

  const handleResend = async () => {
    if (!unverifiedEmail) return;
    const { error } = await resendVerification(unverifiedEmail);
    if (error) {
      toast.error(error);
    } else {
      toast.success('Verification email sent! Check your inbox.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-600 text-white">
              <ShoppingBasket className="h-5 w-5" />
            </div>
            <span className="text-2xl font-bold text-gray-800">FreshBasket</span>
          </Link>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
          <h1 className="text-2xl font-bold text-gray-800 text-center">Welcome Back</h1>
          <p className="text-sm text-gray-500 text-center mt-1">Sign in to your account to continue shopping</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-10 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-green-600 hover:text-green-700 font-medium">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-green-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Login <ArrowRight className="h-4 w-4" /></>
              )}
            </button>

            {unverifiedEmail && (
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-center">
                <p className="text-sm text-amber-700">Please verify your email before logging in.</p>
                <button
                  type="button"
                  onClick={handleResend}
                  className="mt-2 text-sm font-medium text-amber-700 underline hover:text-amber-800"
                >
                  Resend Verification Email
                </button>
              </div>
            )}
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-green-600 hover:text-green-700">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
