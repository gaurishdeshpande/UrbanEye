import React, { useState } from 'react';
import MapPicker from '../components/MapPicker';
import ModelUploader from '../components/ModelUploader';
import ThreeViewer from '../components/ThreeViewer';

export default function Wizard() {
  const [step, setStep] = useState(1);
  const [projectData, setProjectData] = useState({
    name: 'New Project',
    location: null,
    model: null,
    radius: 500
  });

  const nextStep = () => setStep(s => Math.min(s + 1, 3));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  return (
    <div className="wizard-container" style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="wizard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Project Setup</h2>
        <div className="steps-indicator" style={{ display: 'flex', gap: '1rem' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{
              width: '30px', height: '30px', borderRadius: '50%',
              backgroundColor: step >= i ? 'var(--accent-primary)' : 'var(--bg-panel)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 'bold'
            }}>{i}</div>
          ))}
        </div>
      </div>

      <div className="wizard-content" style={{ flex: 1, minHeight: '600px', backgroundColor: 'var(--bg-surface)', borderRadius: '12px', padding: '2rem', border: '1px solid var(--bg-panel)' }}>
        {step === 1 && (
          <div className="step-location" style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3>Step 1: Define Location</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Drop a pin to set your project coordinates and fetch surrounding context.</p>
            <div style={{ flex: 1, borderRadius: '8px', overflow: 'hidden' }}>
              <MapPicker 
                location={projectData.location} 
                onChange={(loc) => setProjectData({...projectData, location: loc})} 
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="step-model" style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3>Step 2: Upload Building Model</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Upload your GLB/OBJ file for analysis.</p>
            <ModelUploader 
              onUpload={(file) => setProjectData({...projectData, model: file})} 
            />
          </div>
        )}

        {step === 3 && (
          <div className="step-context" style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3>Step 3: Review Context</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Preview your model within the OpenStreetMap context.</p>
            <div style={{ flex: 1, borderRadius: '8px', overflow: 'hidden' }}>
              <ThreeViewer 
                model={projectData.model} 
                location={projectData.location}
                radius={projectData.radius}
              />
            </div>
          </div>
        )}
      </div>

      <div className="wizard-footer" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button 
          className="secondary-btn" 
          onClick={prevStep} 
          disabled={step === 1}
          style={{ padding: '0.75rem 1.5rem', borderRadius: '6px', background: 'var(--bg-panel)', color: 'white', border: 'none', cursor: step === 1 ? 'not-allowed' : 'pointer' }}
        >
          Back
        </button>
        <button 
          className="primary-btn" 
          onClick={step === 3 ? () => alert('Project saved!') : nextStep}
        >
          {step === 3 ? 'Finish Setup' : 'Next Step'}
        </button>
      </div>
    </div>
  );
}
