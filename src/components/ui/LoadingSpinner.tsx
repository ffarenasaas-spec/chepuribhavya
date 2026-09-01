import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ size = 'md', label }: { size?: 'sm' | 'md' | 'lg'; label?: string }) {
  const sizeClass = size === 'sm' ? 'w-5 h-5' : size === 'lg' ? 'w-10 h-10' : 'w-7 h-7';
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <Loader2 className={`${sizeClass} animate-spin text-green-600`} />
      {label && <p className="text-sm text-gray-500">{label}</p>}
    </div>
  );
}
