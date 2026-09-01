import { supabase } from '@/lib/supabase';
import type { Order, OrderItem } from '@/types';

export async function placeOrder(deliveryAddress: {
  full_name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}, paymentMethod = 'Cash on Delivery'): Promise<string> {
  const { data, error } = await supabase.rpc('place_order', {
    p_delivery_address: deliveryAddress,
    p_payment_method: paymentMethod,
  });
  if (error) throw error;
  return data as string;
}

export async function getMyOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as Order[];
}

export async function getOrderById(id: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data as Order | null;
}

export async function getAllOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*), profiles!user_id(full_name, email)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as Order[];
}

export async function updateOrderStatus(orderId: string, status: string): Promise<void> {
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId);
  if (error) throw error;
}

export async function getOrderItems(orderId: string): Promise<OrderItem[]> {
  const { data, error } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', orderId);
  if (error) throw error;
  return data as OrderItem[];
}
