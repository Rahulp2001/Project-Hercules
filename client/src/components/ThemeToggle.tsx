import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../stores/themeStore';

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';
  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="nav-glow flex items-center gap-2 px-3 py-2 rounded-xl bg-bg-elevated text-text-secondary hover:text-brand-primary transition-all duration-300"
      style={{ border: '1px solid rgb(var(--border) / var(--border-alpha))' }}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
      <span className="text-xs font-medium">{isDark ? 'Light' : 'Dark'}</span>
    </button>
  );
}
