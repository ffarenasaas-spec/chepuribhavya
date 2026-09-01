import { Link } from 'react-router-dom';
import type { Category } from '@/types';

export default function CategoryCard({ category, productCount }: { category: Category; productCount?: number }) {
  return (
    <Link
      to={`/products?category=${category.id}`}
      className="group flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-green-200 hover:-translate-y-1"
    >
      <div className="relative h-20 w-20 overflow-hidden rounded-full bg-green-50">
        {category.image_url && (
          <img
            src={category.image_url}
            alt={category.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        )}
      </div>
      <h3 className="mt-3 text-sm font-semibold text-gray-800 group-hover:text-green-700">{category.name}</h3>
      {productCount !== undefined && (
        <p className="mt-0.5 text-xs text-gray-400">{productCount} items</p>
      )}
    </Link>
  );
}
