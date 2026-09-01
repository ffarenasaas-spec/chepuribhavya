import { useState, useEffect, type FormEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBasket, MailCheck, ArrowLeft, Send } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

export default function VerifyEmail() {
  const location = useLocation();
  const { resendVerification } = useAuth();
  const email = (location.state as { email?: string })?.email ?? '';
  const [resending, setResending] = useState(false);
  const [verified, setVerified] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    // When Supabase redirects back after email verification, it includes
    // type=signup and a token_hash in the URL. We detect a successful session
    // change which indicates the email was verified.
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type');

    if (type === 'signup' || type === 'recovery') {
      setChecking(true);
      // Supabase auto-detects the session from the URL (detectSessionInUrl: true).
      // We just need to check if a session was established.
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setVerified(true);
          toast.success('Email verified successfully!');
          // Clean the URL
          window.history.replaceState({}, '', window.location.pathname);
        }
        setChecking(false);
      });
    }
  }, []);

  const handleResend = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setResending(true);
    const { error } = await resendVerification(email);
    if (error) {
      toast.error(error);
    } else {
      toast.success('Verification email sent! Check your inbox.');
    }
    setResending(false);
  };

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="h-10 w-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-sm text-gray-500">Verifying your email...</p>
        </div>
      </div>
    );
  }

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

        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg text-center">
          <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${verified ? 'bg-green-100' : 'bg-amber-100'}`}>
            <MailCheck className={`h-8 w-8 ${verified ? 'text-green-600' : 'text-amber-500'}`} />
          </div>

          {verified ? (
            <>
              <h1 className="mt-4 text-2xl font-bold text-gray-800">Email Verified Successfully!</h1>
              <p className="mt-2 text-sm text-gray-500">Your email has been verified. You can now log in to your account.</p>
              <Link
                to="/login"
                className="mt-6 inline-block w-full rounded-lg bg-green-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700"
              >
                Continue to Login
              </Link>
            </>
          ) : (
            <>
              <h1 className="mt-4 text-2xl font-bold text-gray-800">Check Your Email</h1>
              <p className="mt-2 text-sm text-gray-500">
                Your account has been created successfully. We've sent a verification link to your email address. Please verify your email before logging in.
              </p>
              {email && (
                <p className="mt-3 text-sm font-semibold text-gray-700">{email}</p>
              )}

              <form onSubmit={handleResend} className="mt-6 space-y-3">
                <button
                  type="submit"
                  disabled={resending || !email}
                  className="w-full rounded-lg bg-green-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {resending ? (
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <><Send className="h-4 w-4" /> Resend Verification Email</>
                  )}
                </button>
                <Link
                  to="/login"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <ArrowLeft className="h-4 w-4" /> Back to Login
                </Link>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
