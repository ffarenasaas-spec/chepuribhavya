import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export type Database = {
  profiles: {
    Row: {
      id: string;
      full_name: string | null;
      email: string | null;
      phone: string | null;
      address: string | null;
      city: string | null;
      state: string | null;
      pincode: string | null;
      avatar_url: string | null;
      role: 'customer' | 'admin';
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id: string;
      full_name?: string;
      email?: string;
      phone?: string;
      address?: string;
      city?: string;
      state?: string;
      pincode?: string;
      avatar_url?: string;
      role?: 'customer' | 'admin';
    };
    Update: {
      full_name?: string;
      phone?: string;
      address?: string;
      city?: string;
      state?: string;
      pincode?: string;
      avatar_url?: string;
    };
  };
  categories: {
    Row: {
      id: string;
      name: string;
      description: string | null;
      image_url: string | null;
      created_at: string;
    };
    Insert: {
      id?: string;
      name: string;
      description?: string;
      image_url?: string;
    };
    Update: {
      name?: string;
      description?: string;
      image_url?: string;
    };
  };
  products: {
    Row: {
      id: string;
      category_id: string | null;
      name: string;
      description: string | null;
      price: number;
      discount_price: number | null;
      stock_quantity: number;
      unit: string;
      image_url: string | null;
      brand: string | null;
      is_active: boolean;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      category_id?: string;
      name: string;
      description?: string;
      price: number;
      discount_price?: number | null;
      stock_quantity?: number;
      unit?: string;
      image_url?: string;
      brand?: string;
      is_active?: boolean;
    };
    Update: {
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
    };
  };
  cart_items: {
    Row: {
      id: string;
      user_id: string;
      product_id: string;
      quantity: number;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      user_id?: string;
      product_id: string;
      quantity?: number;
    };
    Update: {
      quantity?: number;
    };
  };
  orders: {
    Row: {
      id: string;
      user_id: string;
      total_amount: number;
      subtotal: number;
      delivery_fee: number;
      discount: number;
      status: string;
      payment_method: string;
      payment_status: string;
      delivery_address: any;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      user_id?: string;
      total_amount?: number;
      subtotal?: number;
      delivery_fee?: number;
      discount?: number;
      status?: string;
      payment_method?: string;
      payment_status?: string;
      delivery_address?: any;
    };
    Update: {
      status?: string;
      payment_status?: string;
    };
  };
  order_items: {
    Row: {
      id: string;
      order_id: string;
      product_id: string | null;
      product_name: string;
      quantity: number;
      price: number;
      subtotal: number;
      created_at: string;
    };
    Insert: {
      id?: string;
      order_id: string;
      product_id?: string;
      product_name: string;
      quantity?: number;
      price?: number;
      subtotal?: number;
    };
  };
};
