import React, { useRef, useState } from 'react';
import './FluentCard.css';

const FluentCard = ({ children, className = '', onClick = null, glowColor = 'rgba(0, 120, 212, 0.18)' }) => {
  const cardRef = useRef(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCoords({ x, y });

    // 3D Tilt calculation
    const width = rect.width;
    const height = rect.height;
    
    // Max tilt angle in degrees
    const maxTilt = 5;
    
    // Calculate tilt relative to the card's center
    const tiltX = -((y - height / 2) / (height / 2)) * maxTilt;
    const tiltY = ((x - width / 2) / (width / 2)) * maxTilt;
    
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      className={`fluent-card fluent-glass ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        '--mouse-x': `${coords.x}px`,
        '--mouse-y': `${coords.y}px`,
        '--glow-color': glowColor,
        transform: isHovered 
          ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-4px) scale(1.01)` 
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)',
        transition: isHovered 
          ? 'transform 0.1s cubic-bezier(0.25, 1, 0.5, 1), background-color var(--transition-normal)' 
          : 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), background-color var(--transition-normal)',
        cursor: onClick ? 'pointer' : 'default'
      }}
    >
      <div className="fluent-card-glow" />
      <div className="fluent-card-content">{children}</div>
    </div>
  );
};

export default FluentCard;
