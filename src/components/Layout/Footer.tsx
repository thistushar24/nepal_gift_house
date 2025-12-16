import { Gift, Phone, MapPin, Facebook, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CONTACT_INFO } from '../../utils/whatsapp';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Gift className="w-8 h-8 text-rose-500" />
              <span className="text-xl font-bold">Nepal Gift House</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Your trusted gift shop in Nepal. We offer a wide range of teddy bears and gift items
              perfect for every occasion.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-gray-400 hover:text-rose-500 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-rose-500 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  to="/gallery"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Gallery
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-rose-500" />
                <a
                  href={`tel:${CONTACT_INFO.phone}`}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {CONTACT_INFO.displayPhone}
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 text-rose-500 mt-1" />
                <a
                  href={CONTACT_INFO.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Visit Our Physical Shop
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Nepal Gift House. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Made with love in Nepal
          </p>
        </div>
      </div>
    </footer>
  );
}
