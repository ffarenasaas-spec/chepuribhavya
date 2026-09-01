import { Link } from 'react-router-dom';

export default function Unauthorized() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
          <span className="text-4xl font-bold text-red-500">403</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Access Denied</h1>
        <p className="mt-2 text-gray-500">
          You don't have permission to access this page. This area is restricted to administrators only.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-lg bg-green-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
