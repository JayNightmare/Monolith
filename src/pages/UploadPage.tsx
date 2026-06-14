import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UploadPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      startUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      startUpload(e.target.files[0]);
    }
  };

  const startUpload = async (file: File) => {
    if (!file.type.startsWith('video/')) {
      alert('Invalid file format. Please upload a video file (MP4, MOV, AVI).');
      return;
    }

    setIsUploading(true);
    setProgress(0);
    
    // Simulate initial progress while uploading
    let p = 0;
    const progressInterval = setInterval(() => {
      p += 5;
      if (p > 90) p = 90;
      setProgress(p);
    }, 200);

    try {
      const formData = new FormData();
      formData.append('video', file);

      const token = localStorage.getItem('token');
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();
      clearInterval(progressInterval);
      setProgress(100);
      
      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }
      
      if (data.jobId) {
        localStorage.setItem('monolith_job_id', data.jobId);
        setTimeout(() => {
          navigate('/processing');
        }, 500);
      }
    } catch (error) {
      console.error("Upload failed", error);
      clearInterval(progressInterval);
      setIsUploading(false);
      alert('Upload failed. Please try again.');
    }
  };

  return (
    <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 160px)' }}>
      <div 
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        style={{
          width: '100%',
          maxWidth: '800px',
          backgroundColor: isDragging ? 'var(--color-surface-container-highest)' : 'var(--color-surface)',
          border: '4px dashed var(--color-primary)',
          padding: '64px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          transition: 'background-color 0.2s'
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '64px', marginBottom: '24px' }}>upload_file</span>
        
        {!isUploading ? (
          <>
            <h1 className="headline-text" style={{ marginBottom: '16px' }}>DROP VIDEO ASSET HERE</h1>
            <p style={{ color: 'var(--color-on-surface-variant)', maxWidth: '400px', marginBottom: '32px' }}>
              Drag and drop your raw footage to begin processing. The system will automatically extract keyframes and generate marketing assets.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <input 
                type="file" 
                id="file-upload" 
                className="hidden" 
                style={{ display: 'none' }}
                accept="video/mp4,video/quicktime,video/x-msvideo"
                onChange={handleChange}
              />
              <label htmlFor="file-upload" className="btn-primary" style={{ width: '100%', maxWidth: '300px', textAlign: 'center' }}>
                SELECT FILE
              </label>
              
              <div className="label-caps" style={{ color: 'var(--color-on-surface-variant)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>info</span>
                ACCEPTED FORMATS: MP4, MOV, AVI
              </div>
            </div>
          </>
        ) : (
          <div style={{ width: '100%', maxWidth: '400px', marginTop: '32px' }}>
            <div className="flex-between" style={{ marginBottom: '8px' }}>
              <span className="label-caps">UPLOADING...</span>
              <span className="label-caps">{progress}%</span>
            </div>
            <div style={{ width: '100%', height: '16px', border: '2px solid var(--color-primary)', backgroundColor: 'var(--color-surface)', padding: '2px' }}>
              <div style={{ height: '100%', backgroundColor: 'var(--color-primary)', width: `${progress}%`, transition: 'width 0.2s' }}></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
