import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
}

export default function QuantitySelector({
  quantity,
  onIncrease,
  onDecrease,
  min = 1,
  max = 99,
  size = 'md',
}: QuantitySelectorProps) {
  const btnSize = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10';
  const iconSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';

  return (
    <div className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1">
      <button
        onClick={onDecrease}
        disabled={quantity <= min}
        className={`${btnSize} flex items-center justify-center rounded-md text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        <Minus className={iconSize} />
      </button>
      <span className={`min-w-[2rem] text-center font-semibold text-gray-800 ${size === 'sm' ? 'text-sm' : ''}`}>
        {quantity}
      </span>
      <button
        onClick={onIncrease}
        disabled={quantity >= max}
        className={`${btnSize} flex items-center justify-center rounded-md text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        <Plus className={iconSize} />
      </button>
    </div>
  );
}
