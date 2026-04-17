import { motion } from 'framer-motion';
import { AnimatedNumber } from './AnimatedNumber';

interface ProgressRingProps {
  value: number;
  max: number;
  size?: number;
  stroke?: number;
  color?: string;
  label?: string;
  sublabel?: string;
  animate?: boolean;
}

export function ProgressRing({
  value,
  max,
  size = 180,
  stroke = 14,
  color = '#8b5cf6',
  label,
  sublabel,
  animate = false,
}: ProgressRingProps) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(100, max > 0 ? (value / max) * 100 : 0);
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} fill="none" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {label && (
          <span className="text-3xl font-bold text-text-primary">
            {animate ? <AnimatedNumber value={Number(label)} /> : label}
          </span>
        )}
        {sublabel && <span className="text-sm text-text-muted mt-1">{sublabel}</span>}
      </div>
    </div>
  );
}
