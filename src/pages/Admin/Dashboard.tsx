import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Package, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function Dashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    live: 0,
    draft: 0,
    outOfStock: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data: allProducts } = await supabase
        .from('products')
        .select('status', { count: 'exact' });

      if (allProducts) {
        setStats({
          total: allProducts.length,
          live: allProducts.filter((p) => p.status === 'live').length,
          draft: allProducts.filter((p) => p.status === 'draft').length,
          outOfStock: allProducts.filter((p) => p.status === 'out_of_stock').length,
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {profile?.full_name}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Products</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Package className="w-12 h-12 text-blue-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Live Products</p>
              <p className="text-3xl font-bold text-gray-900">{stats.live}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Approval</p>
              <p className="text-3xl font-bold text-gray-900">{stats.draft}</p>
            </div>
            <Clock className="w-12 h-12 text-orange-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Out of Stock</p>
              <p className="text-3xl font-bold text-gray-900">{stats.outOfStock}</p>
            </div>
            <XCircle className="w-12 h-12 text-red-600 opacity-20" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/products/new"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-rose-600 hover:bg-rose-50 transition-all text-center"
          >
            <Package className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="font-medium text-gray-700">Add New Product</p>
          </a>

          {profile?.role === 'admin' && stats.draft > 0 && (
            <a
              href="/admin/products?status=draft"
              className="p-4 border-2 border-dashed border-orange-300 rounded-lg hover:border-orange-600 hover:bg-orange-50 transition-all text-center"
            >
              <Clock className="w-8 h-8 text-orange-400 mx-auto mb-2" />
              <p className="font-medium text-gray-700">Review Pending Products</p>
              <p className="text-sm text-gray-500">{stats.draft} waiting</p>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
