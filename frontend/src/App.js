import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import CommandPalette from './components/CommandPalette/CommandPalette';
import MobileBottomNav from './components/MobileBottomNav/MobileBottomNav';

import Home from './pages/Home/Home';
import BlogList from './pages/BlogList/BlogList';
import BlogDetail from './pages/BlogDetail/BlogDetail';
import CreatePost from './pages/CreatePost/CreatePost';
import EditPost from './pages/EditPost/EditPost';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Profile from './pages/Profile/Profile';
import ReadingList from './pages/ReadingList/ReadingList';
import Settings from './pages/Settings/Settings';

function AppContent() {
  const [cmdPaletteOpen, setCmdPaletteOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', paddingBottom: '60px' }}>
      <Navbar onOpenCmdPalette={() => setCmdPaletteOpen(true)} />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/"              element={<Home />} />
          <Route path="/blog"          element={<BlogList />} />
          <Route path="/blog/:id"      element={<BlogDetail />} />
          <Route path="/profile/:id"   element={<Profile />} />
          <Route path="/login"         element={<Login />} />
          <Route path="/register"      element={<Register />} />
          <Route
            path="/reading-list"
            element={
              <ProtectedRoute>
                <ReadingList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreatePost />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <ProtectedRoute>
                <EditPost />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
      <CommandPalette isOpen={cmdPaletteOpen} onClose={() => setCmdPaletteOpen(false)} />
      <MobileBottomNav />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#16213e',
                color: '#ffffff',
                border: '1px solid rgba(199, 112, 240, 0.3)',
                fontFamily: 'Raleway, sans-serif',
              },
              success: { iconTheme: { primary: '#c770f0', secondary: '#fff' } },
              error:   { iconTheme: { primary: '#ff6b6b', secondary: '#fff' } },
            }}
          />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
