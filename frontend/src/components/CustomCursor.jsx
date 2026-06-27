import React, { useEffect, useState, useRef } from 'react';
import './CustomCursor.css';

const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [hidden, setHidden] = useState(true);

  const mouseRef = useRef({ x: 0, y: 0 });
  const ringPosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      setHidden(false);
    };

    const handleMouseLeave = () => {
      setHidden(true);
    };

    const handleMouseEnter = () => {
      setHidden(false);
    };

    // Add global mouse listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Track hoverable elements to trigger cursor expansion
    const updateHoverState = () => {
      const hoverables = document.querySelectorAll('button, a, .fluent-card, input, select, textarea, [role="button"]');
      
      const onEnter = () => setHovered(true);
      const onLeave = () => setHovered(false);

      hoverables.forEach(el => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });

      return () => {
        hoverables.forEach(el => {
          el.removeEventListener('mouseenter', onEnter);
          el.removeEventListener('mouseleave', onLeave);
        });
      };
    };

    const cleanupHovers = updateHoverState();

    // Create a MutationObserver to re-bind events when the DOM shifts (e.g. page routes)
    const observer = new MutationObserver(() => {
      updateHoverState();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Animation Loop for Smooth Trailing Spring Effect
    let animFrameId;
    const updateCursor = () => {
      // Direct position for the inner dot
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseRef.current.x}px, ${mouseRef.current.y}px, 0)`;
      }

      // Smooth trailing interpolation (lerp) for the outer ring
      const dx = mouseRef.current.x - ringPosRef.current.x;
      const dy = mouseRef.current.y - ringPosRef.current.y;
      
      // Speed factor (lower value = slower, smoother trail)
      const speed = 0.15;
      ringPosRef.current.x += dx * speed;
      ringPosRef.current.y += dy * speed;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPosRef.current.x}px, ${ringPosRef.current.y}px, 0)`;
      }

      animFrameId = requestAnimationFrame(updateCursor);
    };

    updateCursor();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cleanupHovers();
      observer.disconnect();
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  return (
    <>
      <div 
        ref={dotRef} 
        className={`cursor-dot ${hidden ? 'cursor-hidden' : ''} ${hovered ? 'cursor-hover' : ''}`} 
      />
      <div 
        ref={ringRef} 
        className={`cursor-ring ${hidden ? 'cursor-hidden' : ''} ${hovered ? 'cursor-hover' : ''}`} 
      />
    </>
  );
};

export default CustomCursor;
