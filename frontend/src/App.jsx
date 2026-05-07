import React from 'react'
import './index.css'

function App() {
  return (
    <div className="app-container">
      <header className="header">
        <div className="logo">UrbanEye</div>
        <nav className="nav-links">
          <a href="#" className="active">Dashboard</a>
          <a href="#">Projects</a>
          <a href="#">Settings</a>
        </nav>
      </header>
      
      <main className="main-content">
        <section className="hero">
          <h1>Environmental Simulation Platform</h1>
          <p>Transforming environmental data into architectural intelligence.</p>
          <button className="primary-btn">Start New Project</button>
        </section>
      </main>
    </div>
  )
}

export default App
