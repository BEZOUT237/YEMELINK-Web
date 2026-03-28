import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const CONNECT_LINKS = [
  { label: 'YouTube', href: 'https://www.youtube.com/@YEMELINK2000', icon: '▶' },
  { label: 'Instagram', href: 'https://www.instagram.com/yemelink2000', icon: '📷' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@yemelink', icon: '🎵' },
  { label: 'Blog', href: 'https://yemelink.blogspot.com', icon: '📝' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/105687625/admin/dashboard', icon: '💼' },
];

const STATS = [
  { label: 'Years of Experience', value: '2+' },
  { label: 'Projects Delivered', value: '16' },
  { label: 'Happy Clients', value: '16' },
];

const SERVICES = [
  { label: 'Web Development', href: '/services', icon: '💻' },
  { label: 'Mobile Apps', href: '/services', icon: '📱' },
  { label: 'Design', href: '/services', icon: '🎨' },
  { label: 'Content', href: '/services', icon: '✍️' },
  { label: 'Marketing', href: '/services', icon: '📈' },
  { label: 'Copywriting', href: '/services', icon: '📝' },
];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef(null);
  const { scrollY } = useScroll();

  // Parallax effect
  const yParallax = useTransform(scrollY, [0, 500], [0, 150]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen pt-20 flex items-center justify-center px-4 overflow-hidden">
        {/* Animated background */}
        <motion.div
          style={{ y: yParallax }}
          className="absolute inset-0 -z-10"
        >
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </motion.div>

        <div className="container mx-auto text-center max-w-3xl">
          {/* Logo Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="mb-8"
          >
            <div className="inline-block text-6xl md:text-7xl font-bold mb-4">
              <span className="text-primary">YL</span>
              <span>YEMELINK</span>
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
          >
            Online Products and Services
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg md:text-xl text-textSecondary mb-8"
          >
            Your Tech & Digital Media Hub
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/services"
              className="btn-primary px-8 py-4 text-lg inline-block"
            >
              Explore Services
            </Link>
            <Link
              to="/portfolio"
              className="btn-secondary px-8 py-4 text-lg inline-block"
            >
              View Our Work
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-surface/50">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STATS.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-8 rounded-lg glass"
              >
                <div className="text-5xl md:text-6xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <p className="text-textSecondary text-lg">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-12 text-center"
          >
            Our Services
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service, index) => (
              <motion.div
                key={service.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ translateY: -6 }}
                transition={{ delay: index * 0.05 }}
                className="card cursor-pointer group"
              >
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{service.label}</h3>
                <Link
                  to={service.href}
                  className="text-primary text-sm font-medium group-hover:translate-x-2 transition-transform inline-flex"
                >
                  Learn More →
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mt-12"
          >
            <Link to="/services" className="btn-primary px-8 py-4 inline-block">
              View All Services
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 px-4 bg-surface/50">
        <div className="container mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-12 text-center"
          >
            Featured Projects
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {[1, 2].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="card group overflow-hidden"
              >
                <div className="h-48 bg-gradient-to-br from-primary/20 to-transparent rounded-lg mb-4 group-hover:shadow-lg transition-all" />
                <h3 className="text-xl font-semibold mb-2">Project {i}</h3>
                <p className="text-textSecondary mb-4 text-sm">Innovative solution delivering exceptional results...</p>
                <Link to="/portfolio" className="text-primary text-sm font-medium">
                  View Project →
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center"
          >
            <Link to="/portfolio" className="btn-primary px-8 py-4 inline-block">
              View Our Work
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Connect Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-12 text-center"
          >
            Connect With Us
          </motion.h2>

          <div className="flex flex-wrap gap-4 justify-center">
            {CONNECT_LINKS.map((link) => (
              <motion.a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, y: -2 }}
                className="flex items-center gap-2 px-6 py-3 rounded-lg glass hover:border-primary transition-all"
              >
                <span className="text-2xl">{link.icon}</span>
                <span className="font-medium">{link.label}</span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-surface/50">
        <div className="container mx-auto text-center max-w-2xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Ready to Start Your Project?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-textSecondary mb-8 text-lg"
          >
            Let's bring your idea to life with our expert team.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/contact" className="btn-primary px-8 py-4 inline-block">
              Get in Touch
            </Link>
            <Link to="/quote-request" className="btn-secondary px-8 py-4 inline-block">
              Request Quote
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
