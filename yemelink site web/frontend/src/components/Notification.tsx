import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUI } from '@/store';

export default function Notification() {
  const { notification, clearNotification } = useUI();

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(clearNotification, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification, clearNotification]);

  if (!notification) return null;

  const bgColor = {
    success: 'bg-green-500/20 border-green-500',
    error: 'bg-red-500/20 border-red-500',
    warning: 'bg-yellow-500/20 border-yellow-500',
    info: 'bg-blue-500/20 border-blue-500',
  }[notification.type] || 'bg-blue-500/20 border-blue-500';

  const textColor = {
    success: 'text-green-400',
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400',
  }[notification.type] || 'text-blue-400';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`fixed top-20 right-4 z-50 ${bgColor} border rounded-lg p-4 max-w-sm`}
      >
        <p className={textColor}>{notification.message}</p>
      </motion.div>
    </AnimatePresence>
  );
}
