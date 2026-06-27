import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import BackgroundVideo from './components/BackgroundVideo';

// Pages
import Home from './pages/Home';
import Services from './pages/Services';
import Projects from './pages/Projects';
import Careers from './pages/Careers';
import Blogs from './pages/Blogs';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

import './App.css';

function MainApp() {
  const [activePage, setActivePage] = useState('home');
  const [renderPageId, setRenderPageId] = useState('home');
  const [transitionState, setTransitionState] = useState('fade-in');

  const handlePageChange = (newPageId) => {
    if (newPageId === activePage) return;
    setTransitionState('fade-out');
    setActivePage(newPageId);
    setTimeout(() => {
      setRenderPageId(newPageId);
      setTransitionState('fade-in');
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 200);
  };

  const renderPage = () => {
    switch (renderPageId) {
      case 'home':
        return <Home setActivePage={handlePageChange} />;
      case 'services':
        return <Services />;
      case 'projects':
        return <Projects />;
      case 'careers':
        return <Careers />;
      case 'blogs':
        return <Blogs />;
      case 'contact':
        return <Contact />;
      case 'login':
        return <Login setActivePage={handlePageChange} />;
      case 'dashboard':
        return <Dashboard setActivePage={handlePageChange} />;
      default:
        return <Home setActivePage={handlePageChange} />;
    }
  };

  return (
    <div className="app-layout">
      {/* Global Custom Cursor */}
      <CustomCursor />
      
      {/* Global High-Tech Video Background */}
      <BackgroundVideo />
      
      <Navbar activePage={activePage} setActivePage={handlePageChange} />
      
      <main className={`main-content-flow page-transition-${transitionState}`}>
        {renderPage()}
      </main>
      
      <Footer setActivePage={handlePageChange} />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
