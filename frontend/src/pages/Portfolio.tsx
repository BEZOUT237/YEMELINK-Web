// pages/Portfolio.tsx
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Portfolio() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="container mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold mb-12"
        >
          Our Work
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {[
            { name: 'YEMELINK AI Automation', url: 'https://symphonious-pony-88095a.netlify.app' },
            { name: 'Networker Platform', url: 'https://preview--networker.lovable.app/' },
            { name: 'Networker Softr', url: 'https://networker.softr.app/' },
          ].map((project, i) => (
            <div key={i} className="card group">
              <div className="h-48 bg-gradient-to-br from-primary/20 to-transparent rounded-lg mb-4" />
              <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-sm font-medium inline-flex items-center hover:gap-2 transition-all"
              >
                View Project →
              </a>
            </div>
          ))}
        </motion.div>

        <div className="mt-12 p-8 glass rounded-lg">
          <h3 className="text-2xl font-semibold mb-4">Arkigai Group & Portfolio Links</h3>
          <ul className="space-y-2">
            <li><a href="https://arkigai-group.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">arkigai-group.com</a></li>
            <li><a href="https://linktr.ee/YEMELINK" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://linktr.ee/YEMELINK</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
