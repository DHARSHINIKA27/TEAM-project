import React, { useRef, useState, useEffect } from 'react';

const MagneticButton = ({ children, className = '', range = 50, strength = 0.35, ...props }) => {
  const buttonRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!buttonRef.current) return;

      const { clientX, clientY } = e;
      const rect = buttonRef.current.getBoundingClientRect();
      
      // Calculate center coordinates of the button
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate distance between cursor and button center
      const dx = clientX - centerX;
      const dy = clientY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < range) {
        setIsHovered(true);
        // Pull the button towards the cursor based on strength factor
        setPosition({
          x: dx * strength,
          y: dy * strength
        });
      } else {
        if (isHovered) {
          handleMouseLeave();
        }
      }
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      setPosition({ x: 0, y: 0 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    if (buttonRef.current) {
      buttonRef.current.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (buttonRef.current) {
        buttonRef.current.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [isHovered, range, strength]);

  return (
    <div
      ref={buttonRef}
      className={className}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: isHovered ? 'transform 0.1s cubic-bezier(0.25, 1, 0.5, 1)' : 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
        display: 'inline-block'
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default MagneticButton;
