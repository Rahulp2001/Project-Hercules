import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Home, Plus, BarChart3, User, Settings as SettingsIcon, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';

const navItems = [
  { to: '/',         label: 'Dashboard', icon: Home },
  { to: '/log',      label: 'Log',       icon: Plus },
  { to: '/progress', label: 'Progress',  icon: BarChart3 },
  { to: '/profile',  label: 'Profile',   icon: User },
  { to: '/settings', label: 'Settings',  icon: SettingsIcon },
];

export function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-bg text-text-primary flex">

      {/* ── Desktop sidebar ─────────────────────────── */}
      <aside
        className="hidden md:flex flex-col w-64 fixed top-0 left-0 bottom-0 z-40"
        style={{
          background: 'rgb(var(--bg-glass) / 0.6)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRight: '1px solid rgb(var(--border) / var(--border-alpha))',
        }}
      >
        {/* Logo */}
        <div className="px-6 pt-7 pb-6">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)' }}
            >
              <Zap size={16} className="text-white" fill="white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent leading-none">
                HERCULES
              </h1>
              <p className="text-[10px] text-text-muted mt-0.5 tracking-widest uppercase">Forge your strength</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => {
            const active = to === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(to);
            return (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  active
                    ? 'text-brand-primary'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {/* Active background */}
                {active && (
                  <span
                    className="absolute inset-0 rounded-xl"
                    style={{
                      background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(59,130,246,0.08))',
                      border: '1px solid rgba(139,92,246,0.2)',
                    }}
                  />
                )}
                {/* Hover background */}
                {!active && (
                  <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: 'rgba(139,92,246,0.06)' }}
                  />
                )}
                {/* Left accent bar */}
                {active && (
                  <span
                    className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full"
                    style={{ background: 'linear-gradient(180deg, #8b5cf6, #3b82f6)' }}
                  />
                )}
                <Icon size={18} className="relative z-10 shrink-0" />
                <span className="relative z-10 font-medium text-sm">{label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Theme toggle */}
        <div className="px-5 pb-7 pt-4" style={{ borderTop: '1px solid rgb(var(--border) / var(--border-alpha))' }}>
          <ThemeToggle />
        </div>
      </aside>

      {/* ── Main content ────────────────────────────── */}
      <main className="flex-1 md:ml-64 pb-24 pt-16 md:pt-0 md:pb-0 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-4 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* ── Mobile top bar ──────────────────────────── */}
      <header
        className="md:hidden fixed top-0 left-0 right-0 z-40 flex justify-between items-center px-5 h-14"
        style={{
          background: 'rgb(var(--bg-glass) / 0.8)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgb(var(--border) / var(--border-alpha))',
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)' }}
          >
            <Zap size={13} className="text-white" fill="white" />
          </div>
          <h1 className="text-base font-bold tracking-tight bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
            HERCULES
          </h1>
        </div>
        <ThemeToggle />
      </header>

      {/* ── Mobile bottom nav ───────────────────────── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center px-2 h-16"
        style={{
          background: 'rgb(var(--bg-glass) / 0.9)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgb(var(--border) / var(--border-alpha))',
        }}
      >
        {navItems.map(({ to, label, icon: Icon }) => {
          const active = to === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(to);
          return (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className="relative flex flex-col items-center gap-1 px-3 py-2 min-w-[52px]"
            >
              <div
                className={`relative flex items-center justify-center w-10 h-7 rounded-full transition-all duration-200 ${
                  active ? 'text-brand-primary' : 'text-text-muted'
                }`}
                style={active ? {
                  background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(59,130,246,0.1))',
                } : {}}
              >
                <Icon size={19} />
              </div>
              <span className={`text-[9px] font-medium tracking-wide transition-colors ${
                active ? 'text-brand-primary' : 'text-text-muted'
              }`}>
                {label}
              </span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
