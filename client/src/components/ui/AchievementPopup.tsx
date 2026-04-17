import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoalCelebration } from './GoalCelebration';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface Props {
  badge: Badge | null;
  onClose: () => void;
}

export function AchievementPopup({ badge, onClose }: Props) {
  useEffect(() => {
    if (!badge) return;
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [badge, onClose]);

  return (
    <AnimatePresence>
      {badge && (
        <>
          <GoalCelebration trigger={true} />
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0"
              style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
              onClick={onClose}
            />
            {/* Card */}
            <motion.div
              className="relative z-10 text-center p-8 rounded-3xl max-w-xs w-full mx-4"
              style={{
                background: 'rgb(var(--bg-glass) / 0.9)',
                border: '1px solid rgba(139,92,246,0.3)',
                boxShadow: '0 0 60px rgba(139,92,246,0.3), 0 0 120px rgba(59,130,246,0.15)',
              }}
              initial={{ scale: 0.5, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: -20 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            >
              <div className="text-6xl mb-4">{badge.icon}</div>
              <h3 className="text-xl font-bold text-text-primary mb-1">Badge Unlocked!</h3>
              <p className="text-lg font-semibold text-brand-primary mb-1">{badge.name}</p>
              <p className="text-sm text-text-muted">{badge.description}</p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2 rounded-xl text-sm font-medium text-white"
                style={{ background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)' }}
              >
                Awesome!
              </button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
