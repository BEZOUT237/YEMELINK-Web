import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth, useUI } from '@/store';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
import Notification from '@/components/Notification';

export default function Layout() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { notification } = useUI();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-secondary">
      <Navigation isScrolled={isScrolled} />
      <Header />

      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />

      {notification && <Notification />}
    </div>
  );
}
