import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Onboarding } from './pages/Onboarding';
import { Log } from './pages/Log';
import { LogHistory } from './pages/LogHistory';
import { Progress } from './pages/Progress';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { useProfileStore } from './stores/profileStore';
import { ToastContainer } from './components/ui/Toast';

function ProtectedLayout() {
  const profileId = useProfileStore((s) => s.profileId);
  if (!profileId) return <Navigate to="/onboarding" replace />;
  return <Layout />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/" element={<ProtectedLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="log" element={<Log />} />
          <Route path="log/history" element={<LogHistory />} />
          <Route path="progress" element={<Progress />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
