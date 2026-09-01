import { supabase } from '@/lib/supabase';
import type { Product, Category } from '@/types';

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');
  if (error) throw error;
  return data as Category[];
}

export async function getCategoriesWithCount(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*, products!inner(count)')
    .order('name');
  if (error) throw error;
  return data as Category[];
}

export async function getProducts(params: {
  search?: string;
  categoryId?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  limit?: number;
  offset?: number;
}): Promise<{ products: Product[]; total: number }> {
  let query = supabase
    .from('products')
    .select('*, category:categories(*)', { count: 'exact' })
    .eq('is_active', true);

  if (params.search) {
    query = query.ilike('name', `%${params.search}%`);
  }
  if (params.categoryId) {
    query = query.eq('category_id', params.categoryId);
  }
  if (params.brand) {
    query = query.eq('brand', params.brand);
  }
  if (params.minPrice !== undefined) {
    query = query.gte('price', params.minPrice);
  }
  if (params.maxPrice !== undefined) {
    query = query.lte('price', params.maxPrice);
  }

  switch (params.sort) {
    case 'price_asc':
      query = query.order('price', { ascending: true });
      break;
    case 'price_desc':
      query = query.order('price', { ascending: false });
      break;
    case 'newest':
      query = query.order('created_at', { ascending: false });
      break;
    default:
      query = query.order('created_at', { ascending: false });
  }

  if (params.limit) {
    query = query.limit(params.limit);
  }
  if (params.offset) {
    query = query.range(params.offset, params.offset + (params.limit ?? 12) - 1);
  } else if (params.limit) {
    query = query.range(0, params.limit - 1);
  }

  const { data, error, count } = await query;
  if (error) throw error;
  return { products: data as Product[], total: count ?? 0 };
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data as Product | null;
}

export async function getRelatedProducts(categoryId: string, excludeId: string, limit = 4): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', categoryId)
    .eq('is_active', true)
    .neq('id', excludeId)
    .limit(limit);
  if (error) throw error;
  return data as Product[];
}

export async function getBrands(): Promise<string[]> {
  const { data, error } = await supabase
    .from('products')
    .select('brand')
    .eq('is_active', true)
    .not('brand', 'is', null);
  if (error) throw error;
  const brands = [...new Set(data.map((p) => p.brand).filter(Boolean))] as string[];
  return brands.sort();
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('is_active', true)
    .not('discount_price', 'is', null)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data as Product[];
}

export async function getNewestProducts(limit = 4): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data as Product[];
}
