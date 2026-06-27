import React, { useEffect, useRef } from 'react';
import { ArrowRight, Terminal, Server, Shield, Activity } from 'lucide-react';
import MagneticButton from './MagneticButton';
import './HeroSection.css';

const HeroSection = ({ setActivePage }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles = [];
    const particleCount = 40;
    const connectionDist = 80;
    const mouse = { x: null, y: null, radius: 100 };

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.radius = Math.random() * 2 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= (dx / dist) * force * 1.2;
            this.y -= (dy / dist) * force * 1.2;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = document.documentElement.getAttribute('data-theme') === 'light' 
          ? 'rgba(0, 120, 212, 0.5)' 
          : 'rgba(0, 164, 239, 0.7)';
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    canvas.parentElement.addEventListener('mousemove', handleMouseMove);
    canvas.parentElement.addEventListener('mouseleave', handleMouseLeave);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDist) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const alpha = (1 - dist / connectionDist) * 0.15;
            ctx.strokeStyle = isLight 
              ? `rgba(0, 120, 212, ${alpha})` 
              : `rgba(0, 164, 239, ${alpha * 1.5})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      if (canvas.parentElement) {
        canvas.parentElement.removeEventListener('mousemove', handleMouseMove);
        canvas.parentElement.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <div className="hero-section">
      <div className="fluent-grid-bg" />
      <div className="hero-container container animate-fade-in">
        
        {/* Left Column: Microsoft Style Product Copy */}
        <div className="hero-content-col">
          <div className="hero-badge">
            <span className="hero-badge-marker" />
            <span>MICROSOFT AZURE PARTNER</span>
          </div>

          <h1 className="hero-title">
            Cloud for all.<br />
            Build what's next.
          </h1>

          <p className="hero-subtitle">
            Scale your enterprise IT architecture with secure multi-tenant cloud hosting, zero-trust endpoint directory perimeters, and cognitive telemetry auto-scaling.
          </p>

          <div className="hero-actions">
            <MagneticButton strength={0.2} range={60}>
              <button className="btn btn-primary" onClick={() => setActivePage('contact')}>
                <span>Get started</span>
                <ArrowRight size={16} />
              </button>
            </MagneticButton>
            
            <MagneticButton strength={0.2} range={60}>
              <button className="btn btn-outline" onClick={() => setActivePage('services')}>
                <span>Explore services</span>
              </button>
            </MagneticButton>
          </div>
        </div>

        {/* Right Column: Microsoft Portal Mockup Visual */}
        <div className="hero-visual-col">
          <div className="ms-portal-frame fluent-glass">
            {/* Window Title Bar */}
            <div className="portal-header">
              <div className="portal-controls">
                <span className="ctrl-dot ctrl-red" />
                <span className="ctrl-dot ctrl-yellow" />
                <span className="ctrl-dot ctrl-green" />
              </div>
              <div className="portal-title">
                <Terminal size={12} />
                <span>Azure Telemetry Portal - Live Nodes</span>
              </div>
              <span className="portal-status-dot" />
            </div>

            {/* Interactive Canvas Grid */}
            <div className="portal-body">
              <canvas ref={canvasRef} className="hero-canvas" />
              
              {/* Telemetry HUD overlays */}
              <div className="portal-hud hud-top-left">
                <Server size={14} className="text-brand" />
                <span>Node Group: Azure-US-West</span>
              </div>
              <div className="portal-hud hud-top-right">
                <Shield size={14} className="text-teal" />
                <span>Shield: Safe</span>
              </div>
              <div className="portal-hud hud-bottom-left">
                <Activity size={14} className="text-purple" style={{ animation: 'pulseGlow 2s infinite' }} />
                <span>CPU Load: 24.8%</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HeroSection;
