import React, { useEffect, useState } from 'react';
import FluentCard from '../components/FluentCard';
import { API_BASE } from '../context/AuthContext';
import { Cloud, Cpu, Shield, Globe, Settings, X, Terminal } from 'lucide-react';
import './Pages.css';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(`${API_BASE}/services`);
        if (res.ok) {
          const data = await res.json();
          setServices(data.filter(s => s.status === 'active'));
        }
      } catch (err) {
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const getIcon = (iconName, size = 28) => {
    switch (iconName) {
      case 'Cloud': return <Cloud size={size} className="text-brand" />;
      case 'Cpu': return <Cpu size={size} className="text-teal" />;
      case 'Shield': return <Shield size={size} className="text-purple" />;
      case 'Globe': return <Globe size={size} className="text-brand" />;
      default: return <Settings size={size} className="text-brand" />;
    }
  };

  const getStripeClass = (iconName) => {
    switch (iconName) {
      case 'Cloud': return 'ms-stripe-blue';
      case 'Cpu': return 'ms-stripe-teal';
      case 'Shield': return 'ms-stripe-purple';
      case 'Globe': return 'ms-stripe-green';
      default: return 'ms-stripe-blue';
    }
  };

  return (
    <div className="page-services section container animate-fade-in" style={{ paddingTop: '90px' }}>
      <div className="section-header">
        <span className="section-badge">SOLUTIONS DIRECTORY</span>
        <h1 className="section-title">Microsoft Enterprise Architectures</h1>
        <p className="section-desc">
          Browse our structured IT capabilities designed to scale performance, automate operations, and secure enterprise networks.
        </p>
      </div>

      {loading ? (
        <div className="loading-spinner">Querying products directory...</div>
      ) : (
        <div className="services-grid">
          {services.map(srv => (
            <FluentCard 
              key={srv.id} 
              className={`feat-card ${getStripeClass(srv.icon)}`} 
              onClick={() => setSelectedService(srv)}
            >
              <div className="feat-header">
                {getIcon(srv.icon)}
                <h2 className="feat-title">{srv.name}</h2>
              </div>
              <p className="feat-desc">{srv.description}</p>
              <div className="feat-link">
                <span>View blueprint spec</span>
              </div>
            </FluentCard>
          ))}
        </div>
      )}

      {/* Service Details Modal */}
      {selectedService && (
        <div className="modal-overlay" onClick={() => setSelectedService(null)}>
          <div className="modal-content fluent-glass" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedService(null)}>
              <X size={18} />
            </button>
            <div className="modal-body-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
                {getIcon(selectedService.icon, 36)}
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{selectedService.name}</h2>
                  <span className="badge badge-brand">{selectedService.id}</span>
                </div>
              </div>
              <div>
                <h4 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 700 }}>Overview</h4>
                <p style={{ color: 'var(--text-secondary)' }}>{selectedService.description}</p>
              </div>
              <div>
                <h4 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 700 }}>Implementation Blueprint</h4>
                <p style={{ lineHeight: '1.6', whiteSpace: 'pre-wrap', fontSize: '0.95rem' }}>{selectedService.details || 'Specification details are loaded under custom configuration.'}</p>
              </div>
              <div style={{ display: 'flex', gap: '1rem', background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
                <Terminal size={20} className="text-teal" style={{ flexShrink: 0 }} />
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <strong>Deployment Standard:</strong> Fully aligned with Microsoft Cloud Adoption Framework (CAF) and ISO 27001 operations guidelines.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
