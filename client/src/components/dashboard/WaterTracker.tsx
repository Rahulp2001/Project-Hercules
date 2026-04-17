import { useState } from 'react';
import { Droplet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/Card';

interface Props {
  amount: number;
  goal: number;
  onLog: (amount: number) => void;
}

export function WaterTracker({ amount, goal, onLog }: Props) {
  const glasses = Array.from({ length: goal }, (_, i) => i < amount);
  const [rippleKey, setRippleKey] = useState(0);
  const [rippleIdx, setRippleIdx] = useState(-1);

  const handleClick = (i: number) => {
    const newAmount = i + 1 === amount ? i : i + 1;
    setRippleIdx(i);
    setRippleKey((k) => k + 1);
    onLog(newAmount);
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm uppercase tracking-wide text-text-muted">Water</h3>
        <span className="text-xs text-text-secondary">
          {(amount * 0.25).toFixed(2)}L / {(goal * 0.25).toFixed(2)}L
        </span>
      </div>
      <div className="grid grid-cols-8 gap-2">
        {glasses.map((filled, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            className="relative aspect-square rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 overflow-hidden"
            style={{
              background: filled ? 'rgba(59, 130, 246, 0.2)' : 'rgb(var(--bg-elevated))',
              boxShadow: filled ? '0 0 12px rgba(59, 130, 246, 0.4)' : 'none',
            }}
          >
            <AnimatePresence>
              {rippleIdx === i && (
                <motion.div
                  key={rippleKey}
                  className="absolute inset-0 rounded-lg bg-brand-secondary/30"
                  initial={{ scale: 0.3, opacity: 0.8 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                />
              )}
            </AnimatePresence>
            <Droplet
              size={16}
              className={filled ? 'text-brand-secondary' : 'text-text-muted'}
              fill={filled ? 'currentColor' : 'none'}
            />
          </button>
        ))}
      </div>
    </Card>
  );
}
