import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Gift, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, profile, signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Products' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center gap-2">
            <Gift className="w-8 h-8 text-rose-600" />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900">Nepal Gift House</span>
              <span className="text-xs text-gray-600">Perfect Gifts for Every Occasion</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-rose-600 border-b-2 border-rose-600 pb-1'
                    : 'text-gray-700 hover:text-rose-600'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {user && (profile?.role === 'admin' || profile?.role === 'staff') && (
              <Link
                to="/admin"
                className={`text-sm font-medium transition-colors ${
                  isActive('/admin')
                    ? 'text-rose-600 border-b-2 border-rose-600 pb-1'
                    : 'text-gray-700 hover:text-rose-600'
                }`}
              >
                Admin
              </Link>
            )}

            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-700">{profile?.full_name}</span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="text-sm font-medium text-gray-700 hover:text-rose-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-rose-700 transition-colors"
              >
                Login
              </Link>
            )}
          </nav>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700 hover:text-rose-600"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-sm font-medium ${
                    isActive(link.path) ? 'text-rose-600' : 'text-gray-700'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {user && (profile?.role === 'admin' || profile?.role === 'staff') && (
                <Link
                  to="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-sm font-medium ${
                    isActive('/admin') ? 'text-rose-600' : 'text-gray-700'
                  }`}
                >
                  Admin
                </Link>
              )}

              {user ? (
                <>
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-gray-700">{profile?.full_name}</span>
                  </div>
                  <button
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                    }}
                    className="text-sm font-medium text-gray-700 text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-medium text-center"
                >
                  Login
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
