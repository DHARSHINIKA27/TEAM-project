import React, { useState, useEffect, useRef } from 'react';
import { Video, VideoOff, Settings } from 'lucide-react';
import './BackgroundVideo.css';

const VIDEO_THEMES = [
  { id: 'mesh', name: 'Neural Mesh', url: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-screen-background-34281-large.mp4' },
  { id: 'tunnel', name: 'Space Warp', url: 'https://assets.mixkit.co/videos/preview/mixkit-tunnel-of-futuristic-blue-lights-32457-large.mp4' },
  { id: 'code', name: 'Cyber Code', url: 'https://assets.mixkit.co/videos/preview/mixkit-matrix-style-code-screen-background-34283-large.mp4' }
];

const BackgroundVideo = () => {
  const [isPlaying, setIsPlaying] = useState(() => {
    const saved = localStorage.getItem('bg-video-playing');
    return saved !== null ? JSON.parse(saved) : true;
  });
  
  const [videoTheme, setVideoTheme] = useState(() => {
    const saved = localStorage.getItem('bg-video-theme');
    return saved !== null ? saved : 'mesh';
  });

  const [opacity, setOpacity] = useState(0.08); // Slightly higher opacity for more attention grab
  const videoRef = useRef(null);

  const currentTheme = VIDEO_THEMES.find(t => t.id === videoTheme) || VIDEO_THEMES[0];

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(err => {
          console.log("Auto-play prevented by browser policy.", err);
        });
      } else {
        videoRef.current.pause();
      }
    }
    localStorage.setItem('bg-video-playing', JSON.stringify(isPlaying));
  }, [isPlaying]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      if (isPlaying) {
        videoRef.current.play().catch(err => {
          console.log("Play failed on video theme change.", err);
        });
      }
    }
    localStorage.setItem('bg-video-theme', videoTheme);
  }, [videoTheme]);

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="bg-video-wrapper" style={{ opacity: opacity }}>
      <video
        ref={videoRef}
        className="bg-video-element"
        src={currentTheme.url}
        loop
        muted
        playsInline
        autoPlay
      />
      <div className="bg-video-overlay" />
      
      {/* Floating Controls */}
      <div className="bg-video-controls fluent-glass">
        <button 
          onClick={togglePlayback} 
          className="bg-video-btn" 
          title={isPlaying ? "Pause background video" : "Play background video"}
        >
          {isPlaying ? <Video size={14} className="text-brand animate-pulse" /> : <VideoOff size={14} className="text-muted" />}
          <span>{isPlaying ? 'Video Active' : 'Video Paused'}</span>
        </button>

        {/* Video Theme Selector */}
        <div className="bg-video-theme-container">
          <Settings size={12} className="text-muted" />
          <select 
            value={videoTheme} 
            onChange={(e) => setVideoTheme(e.target.value)}
            className="bg-video-theme-select font-mono"
            title="Choose a background video theme"
          >
            {VIDEO_THEMES.map(theme => (
              <option key={theme.id} value={theme.id}>
                {theme.name}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-video-slider-container">
          <span className="slider-label">Opacity:</span>
          <input 
            type="range" 
            min="0.01" 
            max="0.30" 
            step="0.01" 
            value={opacity} 
            onChange={(e) => setOpacity(parseFloat(e.target.value))}
            className="bg-video-opacity-slider"
          />
        </div>
      </div>
    </div>
  );
};

export default BackgroundVideo;
