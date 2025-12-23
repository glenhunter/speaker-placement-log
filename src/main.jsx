import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext.jsx';
import App from './App.jsx';
import { SpeakerBaselines } from './pages/SpeakerBaselines.jsx';
import LoginPage from './components/LoginPage.jsx';
import PasswordResetPage from './components/PasswordResetPage.jsx';
import './css/index.css';

const queryClient = new QueryClient();

// Use basename only in production (GitHub Pages)
const basename = import.meta.env.MODE === 'production' ? '/speaker-placement-log' : '';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter basename={basename}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/reset-password" element={<PasswordResetPage />} />
            <Route path="/" element={<App />} />
            <Route path="/speaker-baselines" element={<SpeakerBaselines />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
