import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { useThemeStore } from './stores/themeStore'

// Set initial theme class before React renders, to avoid flash
const stored = localStorage.getItem('hercules-theme');
let initialTheme: 'dark' | 'light' = 'dark';
try {
  if (stored) initialTheme = JSON.parse(stored).state.theme;
} catch {}
document.documentElement.classList.toggle('dark', initialTheme === 'dark');

function Root() {
  const theme = useThemeStore((s) => s.theme);
  useEffect(() => {
    console.log('[theme]', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
  return <App />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
