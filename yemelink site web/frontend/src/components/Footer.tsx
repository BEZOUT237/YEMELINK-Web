import { Link } from 'react-router-dom';

const SOCIAL_LINKS = [
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@YEMELINK2000',
    icon: '▶'
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/yemelink2000',
    icon: '📷'
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@yemelink',
    icon: '🎵'
  },
  {
    label: 'Blog',
    href: 'https://yemelink.blogspot.com',
    icon: '📝'
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/105687625/admin/dashboard',
    icon: '💼'
  }
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface border-t border-border mt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              <span className="text-primary">YL</span>EMELINK
            </h3>
            <p className="text-textSecondary text-sm mb-6">
              Online Products and Services
            </p>
            <p className="text-textSecondary text-sm">
              Tech & Digital Media Hub
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-textSecondary hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/services" className="text-textSecondary hover:text-primary transition-colors">Services</Link></li>
              <li><Link to="/portfolio" className="text-textSecondary hover:text-primary transition-colors">Portfolio</Link></li>
              <li><Link to="/blog" className="text-textSecondary hover:text-primary transition-colors">Blog</Link></li>
              <li><Link to="/community" className="text-textSecondary hover:text-primary transition-colors">Community</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/services" className="text-textSecondary hover:text-primary transition-colors">Web Development</Link></li>
              <li><Link to="/services" className="text-textSecondary hover:text-primary transition-colors">Mobile Apps</Link></li>
              <li><Link to="/services" className="text-textSecondary hover:text-primary transition-colors">Design</Link></li>
              <li><Link to="/services" className="text-textSecondary hover:text-primary transition-colors">Marketing</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Get in Touch</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:yemelink@gmail.com" className="text-textSecondary hover:text-primary transition-colors">
                  yemelink@gmail.com
                </a>
              </li>
              <li>
                <a href="https://wa.me/+905057404314" className="text-textSecondary hover:text-primary transition-colors">
                  +905057404314
                </a>
              </li>
              <li>
                <Link to="/contact" className="text-textSecondary hover:text-primary transition-colors">
                  Contact Form
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <div className="border-t border-border pt-8 mb-8">
          <h4 className="font-semibold mb-4">Connect With Us</h4>
          <div className="flex flex-wrap gap-4">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface hover:bg-primary/20 transition-colors text-sm"
              >
                <span className="text-lg">{link.icon}</span>
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-textSecondary">
          <p>&copy; {currentYear} YEMELINK. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
