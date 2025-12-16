import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Gift, Heart, Star, TrendingUp, Phone, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';
import ProductCard from '../components/ProductCard';
import { openWhatsApp, CONTACT_INFO } from '../utils/whatsapp';

interface Product {
  id: string;
  name: string;
  price: number;
  offer_price: number | null;
  images: string[];
  tags: string[];
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'live')
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;

      const products = data.map((p) => ({
        ...p,
        images: Array.isArray(p.images) ? p.images : [],
      }));

      setFeaturedProducts(products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative bg-gradient-to-br from-rose-600 via-pink-500 to-orange-400 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
              Nepal Gift House
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-rose-50">
              Perfect Gifts for Every Special Moment
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="bg-white text-rose-600 px-8 py-3 rounded-lg font-semibold hover:bg-rose-50 transition-colors shadow-lg"
              >
                Browse Products
              </Link>
              <button
                onClick={() => openWhatsApp()}
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg"
              >
                Order on WhatsApp
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="p-6 rounded-lg bg-rose-50">
              <Gift className="w-12 h-12 text-rose-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Wide Selection</h3>
              <p className="text-sm text-gray-600">Hundreds of gift items to choose from</p>
            </div>
            <div className="p-6 rounded-lg bg-rose-50">
              <Heart className="w-12 h-12 text-rose-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Quality Products</h3>
              <p className="text-sm text-gray-600">Only the best quality teddy bears</p>
            </div>
            <div className="p-6 rounded-lg bg-rose-50">
              <Star className="w-12 h-12 text-rose-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Trusted Shop</h3>
              <p className="text-sm text-gray-600">Physical shop you can visit anytime</p>
            </div>
            <div className="p-6 rounded-lg bg-rose-50">
              <TrendingUp className="w-12 h-12 text-rose-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Best Prices</h3>
              <p className="text-sm text-gray-600">Great offers and discounts</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-gray-600">
              Handpicked collection of our most loved teddy bears and gifts
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md h-96 animate-pulse"></div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  offerPrice={product.offer_price}
                  image={product.images[0]}
                  tags={product.tags}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No products available at the moment.</p>
            </div>
          )}

          {featuredProducts.length > 0 && (
            <div className="text-center mt-12">
              <Link
                to="/products"
                className="inline-block bg-rose-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-rose-700 transition-colors"
              >
                View All Products
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-rose-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Trust Nepal Gift House?
            </h2>
            <p className="text-rose-100 text-lg">
              We are a real, physical shop you can visit
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-lg">
              <Phone className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Direct Contact</h3>
              <p className="text-rose-100 mb-3">
                Call or WhatsApp us anytime for inquiries
              </p>
              <a
                href={`tel:${CONTACT_INFO.phone}`}
                className="text-white font-semibold hover:underline"
              >
                {CONTACT_INFO.displayPhone}
              </a>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-lg">
              <MapPin className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Physical Location</h3>
              <p className="text-rose-100 mb-3">
                Visit our shop to see products before buying
              </p>
              <a
                href={CONTACT_INFO.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white font-semibold hover:underline"
              >
                Get Directions
              </a>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-lg">
              <Heart className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Quality Guarantee</h3>
              <p className="text-rose-100 mb-3">
                All products are carefully selected for quality
              </p>
              <button
                onClick={() => openWhatsApp()}
                className="text-white font-semibold hover:underline"
              >
                Ask About Quality
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Make Someone Happy?
          </h2>
          <p className="text-gray-300 mb-8 text-lg">
            Browse our collection and order directly on WhatsApp. No online payment needed!
          </p>
          <button
            onClick={() => openWhatsApp()}
            className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors text-lg shadow-lg"
          >
            Start Shopping on WhatsApp
          </button>
        </div>
      </section>
    </div>
  );
}
