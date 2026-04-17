import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = '', hover = true }: CardProps) {
  return <div className={`${hover ? 'card-hover' : 'card'} ${className}`}>{children}</div>;
}
