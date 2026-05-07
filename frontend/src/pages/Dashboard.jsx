import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <h1>Environmental Simulation Platform</h1>
      <p>Transforming environmental data into architectural intelligence.</p>
      <button 
        className="primary-btn"
        onClick={() => navigate('/wizard')}
      >
        Start New Project
      </button>
    </section>
  );
}
