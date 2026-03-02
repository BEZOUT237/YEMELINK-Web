import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Services() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="container mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold mb-4"
        >
          Our Services
        </motion.h1>
        <p className="text-textSecondary mb-12">
          Comprehensive digital solutions tailored to your needs
        </p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {[
            { title: 'Web Full Stack Development', icon: '💻' },
            { title: 'Mobile App Development (Android)', icon: '📱' },
            { title: 'Graphic Design', icon: '🎨' },
            { title: 'Content Creation', icon: '✍️' },
            { title: 'Digital Marketing & Social Media', icon: '📈' },
            { title: 'Persuasive Copywriting', icon: '📝' },
          ].map((service, i) => (
            <div key={i} className="card group cursor-pointer">
              <div className="text-5xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
              <p className="text-textSecondary mb-4">Premium {service.title.toLowerCase()} solutions</p>
              <Link to={`/services/${service.title.toLowerCase()}`} className="text-primary text-sm font-medium">
                Learn More →
              </Link>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
