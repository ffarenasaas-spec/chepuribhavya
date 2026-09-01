import { Check } from 'lucide-react';
import { ORDER_STATUSES } from '@/types';

interface OrderTimelineProps {
  currentStatus: string;
}

export default function OrderTimeline({ currentStatus }: OrderTimelineProps) {
  const steps = ORDER_STATUSES.filter((s) => s !== 'Cancelled');
  const currentIndex = steps.indexOf(currentStatus as any);
  const isCancelled = currentStatus === 'Cancelled';

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h3 className="mb-6 text-lg font-bold text-gray-800">Order Tracking</h3>
      {isCancelled ? (
        <div className="flex items-center gap-3 rounded-xl bg-red-50 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-white">
            <span className="text-lg font-bold">!</span>
          </div>
          <div>
            <p className="font-semibold text-red-700">Order Cancelled</p>
            <p className="text-sm text-red-500">This order has been cancelled.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-0">
          {steps.map((step, index) => {
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;
            const isLast = index === steps.length - 1;
            return (
              <div key={step} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                      isCompleted
                        ? isCurrent
                          ? 'bg-green-600 text-white ring-4 ring-green-100'
                          : 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {isCompleted ? <Check className="h-4 w-4" /> : <span className="text-xs font-bold">{index + 1}</span>}
                  </div>
                  {!isLast && (
                    <div className={`h-10 w-0.5 ${index < currentIndex ? 'bg-green-600' : 'bg-gray-200'}`} />
                  )}
                </div>
                <div className="pt-1.5">
                  <p className={`text-sm font-semibold ${isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>
                    {step}
                  </p>
                  {isCurrent && (
                    <p className="mt-0.5 text-xs text-green-600">Current status</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
