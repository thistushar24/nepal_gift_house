import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { openWhatsApp } from '../utils/whatsapp';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  offerPrice?: number | null;
  image: string;
  tags: string[];
}

export default function ProductCard({ id, name, price, offerPrice, image, tags }: ProductCardProps) {
  const hasOffer = offerPrice && offerPrice < price;
  const discount = hasOffer ? Math.round(((price - offerPrice) / price) * 100) : 0;

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    openWhatsApp({ name, price, offerPrice });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
      <Link to={`/products/${id}`} className="block">
        <div className="relative overflow-hidden aspect-square">
          <img
            src={image || 'https://images.pexels.com/photos/265937/pexels-photo-265937.jpeg'}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />

          {hasOffer && (
            <div className="absolute top-2 right-2 bg-rose-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              {discount}% OFF
            </div>
          )}

          {tags.includes('New Arrival') && (
            <div className="absolute top-2 left-2 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              New Arrival
            </div>
          )}

          {tags.includes('Limited Stock') && (
            <div className="absolute bottom-2 left-2 bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
              Limited Stock
            </div>
          )}

          <button
            className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Add to wishlist"
          >
            <Heart className="w-5 h-5 text-gray-600 hover:text-rose-600" />
          </button>
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{name}</h3>

          <div className="flex flex-wrap gap-1 mb-3">
            {tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div>
              {hasOffer ? (
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-rose-600">Rs. {offerPrice}</span>
                  <span className="text-sm text-gray-500 line-through">Rs. {price}</span>
                </div>
              ) : (
                <span className="text-xl font-bold text-gray-900">Rs. {price}</span>
              )}
            </div>
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4">
        <button
          onClick={handleBuyNow}
          className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-4 h-4" />
          Buy on WhatsApp
        </button>
      </div>
    </div>
  );
}
