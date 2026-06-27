import React, { useEffect, useRef, useState } from 'react';
import './AnimatedSection.css';

const AnimatedSection = ({ children, animationType = 'fade-in-up', delay = 0, className = '', ...props }) => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Trigger only once to keep page stable after revealing
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.15, // Trigger when 15% of the element is visible
        rootMargin: '0px 0px -50px 0px' // Offset trigger point slightly above bottom viewport edge
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className={`reveal-section reveal-${animationType} ${isVisible ? 'is-visible' : ''} ${className}`}
      style={{
        transitionDelay: `${delay}ms`
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;
