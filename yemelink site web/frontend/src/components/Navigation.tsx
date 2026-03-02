import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, useUI } from '@/store';
import { motion } from 'framer-motion';

interface NavigationProps {
  isScrolled: boolean;
}

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Blog', href: '/blog' },
  { label: 'Community', href: '/community' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function Navigation({ isScrolled }: NavigationProps) {
  const { isAuthenticated, user, logout } = useAuth();
  const { isMobileMenuOpen, toggleMobileMenu } = useUI();
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-secondary/95 backdrop-blur-md border-b border-border'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl hover:text-primary transition-colors">
            <span className="text-primary">YL</span>
            <span>YEMELINK</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-textSecondary hover:text-primary transition-colors text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side - Auth & Actions */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-surface transition-colors"
                >
                  <img
                    src={user?.avatar_url || 'https://via.placeholder.com/32'}
                    alt={user?.first_name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm hidden sm:inline">{user?.first_name}</span>
                </button>

                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-surface rounded-lg shadow-elevated border border-border overflow-hidden"
                  >
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-surfaceLight transition-colors text-sm"
                    >
                      Profile
                    </Link>
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 hover:bg-surfaceLight transition-colors text-sm"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <Link
                      to="/chat"
                      className="block px-4 py-2 hover:bg-surfaceLight transition-colors text-sm"
                    >
                      AI Chat
                    </Link>
                    <Link
                      to="/premium"
                      className="block px-4 py-2 hover:bg-surfaceLight transition-colors text-sm"
                    >
                      Premium Zone
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-surfaceLight transition-colors text-sm text-red-400"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium hover:text-primary transition-colors hidden sm:inline"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-xs sm:text-sm"
                >
                  Sign Up
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-border"
          >
            <div className="py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="block px-4 py-2 rounded-lg hover:bg-surface transition-colors"
                  onClick={() => toggleMobileMenu()}
                >
                  {link.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <>
                  <Link to="/login" className="block px-4 py-2 rounded-lg hover:bg-surface transition-colors">
                    Login
                  </Link>
                  <Link to="/register" className="block px-4 py-2 btn-primary">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}
