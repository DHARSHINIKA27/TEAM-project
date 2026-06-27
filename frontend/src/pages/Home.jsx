import React, { useEffect, useState } from 'react';
import HeroSection from '../components/HeroSection';
import FluentCard from '../components/FluentCard';
import AnimatedSection from '../components/AnimatedSection';
import MagneticButton from '../components/MagneticButton';
import TelemetryPlayground from '../components/TelemetryPlayground';
import { API_BASE } from '../context/AuthContext';
import { ArrowRight, Cloud, Shield, Cpu, Zap, Activity, Users } from 'lucide-react';
import './Pages.css';

const Home = ({ setActivePage }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(`${API_BASE}/services`);
        if (res.ok) {
          const data = await res.json();
          setServices(data.filter(s => s.status === 'active').slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching home services:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Cloud': return <Cloud size={24} className="feat-icon text-brand" />;
      case 'Cpu': return <Cpu size={24} className="feat-icon text-teal" />;
      case 'Shield': return <Shield size={24} className="feat-icon text-purple" />;
      default: return <Zap size={24} className="feat-icon text-brand" />;
    }
  };

  const getStripeClass = (iconName) => {
    switch (iconName) {
      case 'Cloud': return 'ms-stripe-blue';
      case 'Cpu': return 'ms-stripe-teal';
      case 'Shield': return 'ms-stripe-purple';
      default: return 'ms-stripe-blue';
    }
  };

  return (
    <div className="page-home animate-fade-in">
      {/* Immersive Floating Aurora Glow */}
      <div className="aurora-glow-aurora" />

      <HeroSection setActivePage={setActivePage} />

      {/* Services Showcase Section */}
      <section className="section container">
        <AnimatedSection animationType="fade-in-up" delay={50}>
          <div className="section-header">
            <span className="section-badge">SOLUTIONS BY CATEGORY</span>
            <h2 className="section-title">Azure Enterprise Services</h2>
            <p className="section-desc">
              Explore structured engineering layers built to optimize, automate, and protect enterprise workloads.
            </p>
          </div>
        </AnimatedSection>

        {loading ? (
          <div className="loading-spinner">Querying product directory...</div>
        ) : (
          <div className="featured-grid">
            {services.map((srv, idx) => (
              <AnimatedSection 
                key={srv.id} 
                animationType="fade-in-up" 
                delay={100 * (idx + 1)}
              >
                <FluentCard 
                  className={`feat-card ${getStripeClass(srv.icon)}`} 
                  onClick={() => setActivePage('services')}
                >
                  <div className="feat-header">
                    {getIcon(srv.icon)}
                    <h3 className="feat-title">{srv.name}</h3>
                  </div>
                  <p className="feat-desc">{srv.description}</p>
                  <div className="feat-link">
                    <span>Learn more</span>
                    <ArrowRight size={12} />
                  </div>
                </FluentCard>
              </AnimatedSection>
            ))}
          </div>
        )}
      </section>

      {/* AI Telemetry Focus Section */}
      <section className="section highlight-section fluent-glass">
        <div className="fluent-grid-bg" />
        <div className="container highlight-container">
          
          <AnimatedSection animationType="slide-in-left" className="highlight-content">
            <span className="badge badge-teal">AI & DATA INTELLIGENCE</span>
            <h2>Orchestrate intelligent server networks autonomously</h2>
            <p>
              Integrate custom machine learning pipelines and vector indexing securely inside isolated cloud perimeters. Neural IT enables real-time node telemetry, automated failovers, and compliance-compliant chat indexes.
            </p>
            <div className="highlight-features">
              <div className="h-feat-item">
                <Activity size={16} className="text-teal" />
                <span>Real-time node status telemetry</span>
              </div>
              <div className="h-feat-item">
                <Shield size={16} className="text-purple" />
                <span>Zero-trust conditional boundaries</span>
              </div>
              <div className="h-feat-item">
                <Users size={16} className="text-brand" />
                <span>Multi-tenant database virtualization</span>
              </div>
            </div>
            
            <MagneticButton strength={0.2} range={60}>
              <button className="btn btn-primary" onClick={() => setActivePage('contact')}>
                Request consultation
              </button>
            </MagneticButton>
          </AnimatedSection>
          
          <AnimatedSection animationType="zoom-in" className="highlight-visual">
            <div className="visual-orb accent-glow-brand">
              <div className="inner-pulse" />
              <Cpu size={40} className="orb-icon text-teal" />
            </div>
            <div className="nodes-connection">
              <span className="dot dot-1" />
              <span className="dot dot-2" />
              <span className="dot dot-3" />
              <span className="line l-1" />
              <span className="line l-2" />
            </div>
          </AnimatedSection>
          
        </div>
      </section>

      {/* AI Telemetry Sandbox Section */}
      <div className="container" style={{ marginBottom: '4rem' }}>
        <AnimatedSection animationType="fade-in-up" delay={50}>
          <TelemetryPlayground />
        </AnimatedSection>
      </div>

      {/* Quick CTAs Bar */}
      <section className="section container cta-bar-section">
        <AnimatedSection animationType="fade-in-up" delay={50}>
          <div className="cta-bar fluent-glass">
            <div className="cta-text">
              <h3>Find a solution architect</h3>
              <p>Work with our engineers to configure your Azure migration or zero-trust deployment strategy.</p>
            </div>
            
            <MagneticButton strength={0.2} range={60}>
              <button className="btn btn-outline" onClick={() => setActivePage('contact')}>
                <span>Contact sales</span>
                <ArrowRight size={16} />
              </button>
            </MagneticButton>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
};

export default Home;
