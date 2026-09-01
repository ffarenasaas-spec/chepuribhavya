import { supabase } from '@/lib/supabase';
import type { Product, Profile, Category } from '@/types';

export async function getAdminProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as Product[];
}

export async function createProduct(product: {
  category_id?: string;
  name: string;
  description?: string;
  price: number;
  discount_price?: number | null;
  stock_quantity?: number;
  unit: string;
  image_url?: string;
  brand?: string;
  is_active?: boolean;
}): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .insert(product)
    .select()
    .single();
  if (error) throw error;
  return data as Product;
}

export async function updateProduct(id: string, updates: {
  category_id?: string;
  name?: string;
  description?: string;
  price?: number;
  discount_price?: number | null;
  stock_quantity?: number;
  unit?: string;
  image_url?: string;
  brand?: string;
  is_active?: boolean;
}): Promise<void> {
  const { error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id);
  if (error) throw error;
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

export async function getAllUsers(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as Profile[];
}

export async function getAdminStats(): Promise<{
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  lowStockProducts: Product[];
}> {
  const [usersRes, productsRes, ordersRes, lowStockRes] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('products').select('id', { count: 'exact', head: true }),
    supabase.from('orders').select('total_amount, status'),
    supabase.from('products').select('*').lt('stock_quantity', 10).eq('is_active', true),
  ]);

  const orders = ordersRes.data ?? [];
  const totalRevenue = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + Number(o.total_amount), 0);
  const pendingOrders = orders.filter((o) => o.status === 'Pending').length;

  return {
    totalUsers: usersRes.count ?? 0,
    totalProducts: productsRes.count ?? 0,
    totalOrders: orders.length,
    totalRevenue,
    pendingOrders,
    lowStockProducts: (lowStockRes.data ?? []) as Product[],
  };
}

export async function getSalesData(): Promise<{ date: string; total: number }[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('created_at, total_amount')
    .order('created_at', { ascending: true })
    .limit(30);
  if (error) throw error;
  return (data ?? []).map((o) => ({
    date: o.created_at,
    total: Number(o.total_amount),
  }));
}

export async function getOrdersByStatus(): Promise<{ status: string; count: number }[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('status');
  if (error) throw error;
  const counts: Record<string, number> = {};
  (data ?? []).forEach((o) => {
    counts[o.status] = (counts[o.status] ?? 0) + 1;
  });
  return Object.entries(counts).map(([status, count]) => ({ status, count }));
}

export async function getTopProducts(): Promise<{ name: string; quantity: number }[]> {
  const { data, error } = await supabase
    .from('order_items')
    .select('product_name, quantity');
  if (error) throw error;
  const counts: Record<string, number> = {};
  (data ?? []).forEach((item) => {
    counts[item.product_name] = (counts[item.product_name] ?? 0) + item.quantity;
  });
  return Object.entries(counts)
    .map(([name, quantity]) => ({ name, quantity }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);
}
