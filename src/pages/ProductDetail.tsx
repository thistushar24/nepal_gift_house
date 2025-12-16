import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { openWhatsApp } from '../utils/whatsapp';
import { ShoppingCart, Heart, ArrowLeft, Tag, Package } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  offer_price: number | null;
  images: string[];
  tags: string[];
  status: string;
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  const fetchProduct = async (productId: string) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .eq('status', 'live')
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProduct({
          ...data,
          images: Array.isArray(data.images) ? data.images : [],
        });
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="bg-white rounded-lg shadow-md h-96"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <Link to="/products" className="text-rose-600 hover:text-rose-700 font-medium">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const hasOffer = product.offer_price && product.offer_price < product.price;
  const discount = hasOffer
    ? Math.round(((product.price - product.offer_price) / product.price) * 100)
    : 0;
  const displayImages =
    product.images.length > 0
      ? product.images
      : ['https://images.pexels.com/photos/265937/pexels-photo-265937.jpeg'];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-rose-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Products
        </Link>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-8">
            <div>
              <div className="relative aspect-square rounded-lg overflow-hidden mb-4 bg-gray-100">
                <img
                  src={displayImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {hasOffer && (
                  <div className="absolute top-4 right-4 bg-rose-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    {discount}% OFF
                  </div>
                )}
              </div>

              {displayImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {displayImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? 'border-rose-600 scale-95'
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                {product.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              <div className="mb-6">
                {hasOffer ? (
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold text-rose-600">
                      Rs. {product.offer_price}
                    </span>
                    <span className="text-2xl text-gray-500 line-through">
                      Rs. {product.price}
                    </span>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                      Save Rs. {product.price - product.offer_price}
                    </span>
                  </div>
                ) : (
                  <span className="text-4xl font-bold text-gray-900">Rs. {product.price}</span>
                )}
              </div>

              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>

              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-1">How to Order</h3>
                    <p className="text-blue-800 text-sm">
                      Click "Buy on WhatsApp" below. We'll send you product details and confirm
                      availability. No online payment needed - pay when you receive!
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() =>
                    openWhatsApp({
                      name: product.name,
                      price: product.price,
                      offerPrice: product.offer_price,
                    })
                  }
                  className="flex-1 bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-lg shadow-lg"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Buy on WhatsApp
                </button>

                <button className="sm:w-auto bg-gray-100 text-gray-700 px-6 py-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                  <Heart className="w-5 h-5" />
                  Save
                </button>
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <ul className="space-y-2 text-sm text-green-800">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    Quality guarantee on all products
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    Visit our physical shop to see before buying
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    Easy return and exchange policy
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    Trusted by thousands of happy customers
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
