import React, { useCallback, useState } from 'react';

export default function ModelUploader({ onUpload }) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState('');

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  }, []);

  const handleFile = (file) => {
    if (file.name.endsWith('.glb') || file.name.endsWith('.obj')) {
      setFileName(file.name);
      onUpload(file);
    } else {
      alert("Please upload a .glb or .obj file");
    }
  };

  return (
    <div 
      style={{
        flex: 1,
        border: `2px dashed ${isDragging ? 'var(--accent-primary)' : 'var(--bg-panel)'}`,
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: isDragging ? 'rgba(0, 184, 212, 0.1)' : 'transparent',
        transition: 'all 0.2s ease',
        cursor: 'pointer'
      }}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => document.getElementById('file-upload').click()}
    >
      <input 
        id="file-upload" 
        type="file" 
        accept=".glb,.obj" 
        style={{ display: 'none' }} 
        onChange={(e) => e.target.files && handleFile(e.target.files[0])}
      />
      
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem' }}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="17 8 12 3 7 8"></polyline>
        <line x1="12" y1="3" x2="12" y2="15"></line>
      </svg>
      
      <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
        {fileName ? `Selected: ${fileName}` : 'Drag & drop your 3D model here'}
      </p>
      <p style={{ color: 'var(--text-secondary)' }}>Supports .glb, .obj (Max 50MB)</p>
    </div>
  );
}
