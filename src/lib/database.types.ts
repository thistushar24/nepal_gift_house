export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'admin' | 'staff' | 'customer';
export type ProductStatus = 'draft' | 'live' | 'out_of_stock';
export type FeaturedType = 'banner' | 'featured_product' | 'offer';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          phone: string | null;
          role: UserRole;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          phone?: string | null;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          phone?: string | null;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          display_order?: number;
          created_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          category_id: string | null;
          name: string;
          description: string;
          price: number;
          offer_price: number | null;
          images: Json;
          tags: string[];
          status: ProductStatus;
          created_by: string;
          approved_by: string | null;
          approved_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id?: string | null;
          name: string;
          description: string;
          price: number;
          offer_price?: number | null;
          images?: Json;
          tags?: string[];
          status?: ProductStatus;
          created_by: string;
          approved_by?: string | null;
          approved_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string | null;
          name?: string;
          description?: string;
          price?: number;
          offer_price?: number | null;
          images?: Json;
          tags?: string[];
          status?: ProductStatus;
          created_by?: string;
          approved_by?: string | null;
          approved_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      featured_items: {
        Row: {
          id: string;
          product_id: string | null;
          title: string;
          subtitle: string | null;
          image_url: string | null;
          type: FeaturedType;
          display_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id?: string | null;
          title: string;
          subtitle?: string | null;
          image_url?: string | null;
          type: FeaturedType;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string | null;
          title?: string;
          subtitle?: string | null;
          image_url?: string | null;
          type?: FeaturedType;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
      };
    };
  };
}
