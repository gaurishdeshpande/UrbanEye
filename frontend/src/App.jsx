import React from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Wizard from './pages/Wizard';
import './index.css';

function AppLayout({ children }) {
  return (
    <div className="app-container">
      <header className="header">
        <div className="logo">UrbanEye</div>
        <nav className="nav-links">
          <Link to="/" className="active">Dashboard</Link>
          <Link to="/">Projects</Link>
          <Link to="/">Settings</Link>
        </nav>
      </header>
      
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/wizard" element={<Wizard />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
